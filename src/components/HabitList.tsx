import type { Habit, HabitFilter, IsoDate, WeekStart } from '../types'
import { HabitCard } from './HabitCard'

interface HabitListProps {
  habits: Habit[]
  filter: HabitFilter
  weekDays: IsoDate[]
  today: IsoDate
  weekStartsOn: WeekStart
  editingId: string | null
  onEdit: (id: string) => void
}

export function HabitList({ habits, filter, weekDays, today, weekStartsOn, editingId, onEdit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p
        role="status"
        className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-muted dark:border-night-line dark:text-night-muted"
      >
        {filter === 'active'
          ? 'No active habits. Add your first one above.'
          : 'Nothing archived yet. Archive a habit to keep its history without cluttering the week.'}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          weekDays={weekDays}
          today={today}
          weekStartsOn={weekStartsOn}
          isEditing={habit.id === editingId}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
