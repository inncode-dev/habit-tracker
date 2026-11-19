import type { DoneDays, Habit, HabitColor, IsoDate } from '../types'
import { addDays, todayISO } from './dates'

interface DemoHabit {
  name: string
  color: HabitColor
  targetPerWeek: number
  notes: string
  archived: boolean
  /** Rough probability of completing the habit on any given day. */
  chance: number
}

const DEMO: DemoHabit[] = [
  { name: 'Read 20 minutes', color: 'sage', targetPerWeek: 5, notes: 'Paper books before bed.', archived: false, chance: 0.75 },
  { name: 'Workout', color: 'clay', targetPerWeek: 3, notes: 'Gym or a run.', archived: false, chance: 0.5 },
  { name: 'Drink 2 L of water', color: 'sky', targetPerWeek: 7, notes: '', archived: false, chance: 0.85 },
  { name: 'Meditate', color: 'plum', targetPerWeek: 4, notes: '10 minutes, no phone.', archived: false, chance: 0.6 },
  { name: 'Practice guitar', color: 'ochre', targetPerWeek: 3, notes: 'Paused for now.', archived: true, chance: 0.4 },
]

const HISTORY_DAYS = 100

// A tiny deterministic "random" number in [0, 1): the same demo data every time,
// so screenshots and tests are reproducible. Not for anything security-related.
function pseudoRandom(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function createDemoData(today: IsoDate = todayISO()): {
  habits: Habit[]
  completions: Record<string, DoneDays>
} {
  const habits: Habit[] = []
  const completions: Record<string, DoneDays> = {}

  DEMO.forEach((demo, index) => {
    const id = `demo-${index + 1}`
    const { chance, ...fields } = demo
    habits.push({ id, ...fields, createdAt: addDays(today, -HISTORY_DAYS) })

    const done: DoneDays = {}
    for (let offset = 0; offset < HISTORY_DAYS; offset++) {
      // Today stays unchecked so the user can try the toggle straight away.
      if (offset > 0 && pseudoRandom(index + 1, offset) < chance) done[addDays(today, -offset)] = true
    }
    completions[id] = done
  })

  return { habits, completions }
}
