import { useMemo, useState } from 'react'
import type { Habit, IsoDate, WeekStart } from '../types'
import { useHabitStore } from '../store/habitStore'
import { colorHex } from '../lib/colors'
import { completionRate, countDone } from '../lib/stats'
import { computeStreaks } from '../lib/streaks'
import { Button } from './Button'
import { DayToggle } from './DayToggle'
import { Heatmap } from './Heatmap'

interface HabitCardProps {
  habit: Habit
  weekDays: IsoDate[]
  today: IsoDate
  weekStartsOn: WeekStart
  isEditing: boolean
  onEdit: (id: string) => void
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-extrabold">{value}</dd>
    </div>
  )
}

export function HabitCard({ habit, weekDays, today, weekStartsOn, isEditing, onEdit }: HabitCardProps) {
  // Selectors: this card subscribes ONLY to its own completions. Ticking a day on another
  // habit creates a new object for that habit alone, so this selector returns the same
  // reference and the card does not re-render.
  const done = useHabitStore((state) => state.completions[habit.id])
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion)
  const setArchived = useHabitStore((state) => state.setArchived)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const color = colorHex(habit.color)
  const streaks = useMemo(() => computeStreaks(done, today), [done, today])
  const rate = useMemo(() => completionRate(habit, done, today), [habit, done, today])
  const weekDone = countDone(done, weekDays)

  return (
    <li
      className={`flex flex-col gap-4 rounded-lg border bg-surface p-4 dark:bg-night-surface ${
        isEditing ? 'border-accent dark:border-mint' : 'border-line dark:border-night-line'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="truncate font-display text-lg font-extrabold">{habit.name}</h3>
          </div>
          <p className="mt-1 font-mono text-xs text-muted dark:text-night-muted">
            {weekDone} / {habit.targetPerWeek} this week
            {habit.notes && <span> · {habit.notes}</span>}
          </p>
        </div>

        {confirmingDelete ? (
          <div role="group" aria-label={`Confirm deleting ${habit.name}`} className="flex items-center gap-2">
            <Button
              variant="danger"
              onClick={() => deleteHabit(habit.id)}
            >
              Delete forever
            </Button>
            <Button onClick={() => setConfirmingDelete(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            {!habit.archived && (
              <Button variant="ghost" onClick={() => onEdit(habit.id)} aria-label={`Edit ${habit.name}`}>
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setArchived(habit.id, !habit.archived)}
              aria-label={`${habit.archived ? 'Restore' : 'Archive'} ${habit.name}`}
            >
              {habit.archived ? 'Restore' : 'Archive'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingDelete(true)} aria-label={`Delete ${habit.name}`}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div role="group" aria-label={`${habit.name}: this week`} className="flex gap-1.5">
        {weekDays.map((date) => (
          <DayToggle
            key={date}
            date={date}
            habitName={habit.name}
            color={color}
            done={Boolean(done?.[date])}
            isToday={date === today}
            disabled={date > today || habit.archived}
            onToggle={(day) => toggleCompletion(habit.id, day)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10">
        <dl className="grid grid-cols-3 gap-4 sm:gap-6">
          <Stat label="Streak" value={`${streaks.current} d`} />
          <Stat label="Record" value={`${streaks.best} d`} />
          <Stat label="30 days" value={`${rate}%`} />
        </dl>
        <Heatmap done={done} color={color} today={today} weekStartsOn={weekStartsOn} createdAt={habit.createdAt} />
      </div>
    </li>
  )
}
