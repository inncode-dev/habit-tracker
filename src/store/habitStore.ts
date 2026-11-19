import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DoneDays, Habit, HabitInput, IsoDate } from '../types'
import { isHabitColor } from '../lib/colors'
import { isValidISODate, todayISO } from '../lib/dates'
import { createDemoData } from '../lib/demoData'

interface HabitState {
  habits: Habit[]
  /** habit id → days completed. Kept apart from `habits` so ticking a day never touches the habit objects. */
  completions: Record<string, DoneDays>

  addHabit: (input: HabitInput) => void
  updateHabit: (id: string, input: HabitInput) => void
  deleteHabit: (id: string) => void
  setArchived: (id: string, archived: boolean) => void
  toggleCompletion: (id: string, date: IsoDate) => void
  resetDemo: () => void
}

type PersistedState = Pick<HabitState, 'habits' | 'completions'>

function isHabit(value: unknown): value is Habit {
  if (typeof value !== 'object' || value === null) return false
  const h = value as Record<string, unknown>
  return (
    typeof h.id === 'string' &&
    typeof h.name === 'string' &&
    typeof h.notes === 'string' &&
    isHabitColor(h.color) &&
    typeof h.targetPerWeek === 'number' &&
    h.targetPerWeek >= 1 &&
    h.targetPerWeek <= 7 &&
    typeof h.archived === 'boolean' &&
    isValidISODate(h.createdAt)
  )
}

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    Array.isArray(s.habits) &&
    s.habits.every(isHabit) &&
    typeof s.completions === 'object' &&
    s.completions !== null
  )
}

// The store is created once, outside React. Components subscribe with selectors:
//   useHabitStore((state) => state.habits)
// and re-render only when *that slice* changes.
export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      ...createDemoData(),

      addHabit: (input) =>
        set((state) => ({
          habits: [
            { ...input, id: crypto.randomUUID(), archived: false, createdAt: todayISO() },
            ...state.habits,
          ],
        })),

      updateHabit: (id, input) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...input } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => {
          // Drop the completions too, otherwise they would stay in localStorage forever.
          const { [id]: _removed, ...completions } = state.completions
          return { habits: state.habits.filter((h) => h.id !== id), completions }
        }),

      setArchived: (id, archived) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, archived } : h)),
        })),

      toggleCompletion: (id, date) =>
        set((state) => {
          const { [date]: wasDone, ...rest } = state.completions[id] ?? {}
          // Only this habit's entry gets a new object: other habits keep their identity,
          // so components selecting them do not re-render.
          return { completions: { ...state.completions, [id]: wasDone ? rest : { ...rest, [date]: true } } }
        }),

      resetDemo: () => set(createDemoData()),
    }),
    {
      name: 'inncode-habits:store',
      version: 1,
      // Save data only, never the action functions.
      partialize: (state): PersistedState => ({ habits: state.habits, completions: state.completions }),
      // Corrupted or hand-edited storage falls back to the demo data instead of crashing the app.
      merge: (persisted, current) => (isPersistedState(persisted) ? { ...current, ...persisted } : current),
    },
  ),
)
