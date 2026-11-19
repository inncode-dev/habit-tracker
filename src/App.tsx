import { useMemo, useState } from 'react'
import { UiSettingsProvider } from './state/UiSettingsProvider'
import { useHabitStore } from './store/habitStore'
import { useUiSettings } from './hooks/useUiSettings'
import { useToday } from './hooks/useToday'
import { useWeek } from './hooks/useWeek'
import type { HabitFilter } from './types'
import { Header } from './components/Header'
import { HabitForm } from './components/HabitForm'
import { Toolbar } from './components/Toolbar'
import { HabitList } from './components/HabitList'

function Tracker() {
  const habits = useHabitStore((state) => state.habits)
  const { weekStartsOn } = useUiSettings()
  const today = useToday()
  const week = useWeek(today, weekStartsOn)

  // Local UI state: which list is shown and which habit is being edited.
  const [filter, setFilter] = useState<HabitFilter>('active')
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = habits.find((h) => h.id === editingId) ?? null

  const visible = useMemo(() => habits.filter((h) => h.archived === (filter === 'archived')), [habits, filter])
  const counts = useMemo(
    () => ({
      active: habits.filter((h) => !h.archived).length,
      archived: habits.filter((h) => h.archived).length,
    }),
    [habits],
  )

  return (
    <main className="flex flex-col gap-6">
      <HabitForm key={editing?.id ?? 'new'} editing={editing} onDone={() => setEditingId(null)} />
      <Toolbar
        filter={filter}
        onFilterChange={setFilter}
        weekLabel={week.label}
        isCurrentWeek={week.isCurrentWeek}
        onPrevious={week.goToPrevious}
        onNext={week.goToNext}
        onToday={week.goToToday}
        counts={counts}
      />
      <HabitList
        habits={visible}
        filter={filter}
        weekDays={week.days}
        today={today}
        weekStartsOn={weekStartsOn}
        editingId={editingId}
        onEdit={setEditingId}
      />
    </main>
  )
}

export default function App() {
  return (
    <UiSettingsProvider>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <Header />
        <Tracker />
      </div>
    </UiSettingsProvider>
  )
}
