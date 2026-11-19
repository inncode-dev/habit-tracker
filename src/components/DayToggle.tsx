import type { IsoDate } from '../types'
import { dayOfMonth, formatLongDay, formatWeekday } from '../lib/dates'

interface DayToggleProps {
  date: IsoDate
  habitName: string
  color: string
  done: boolean
  isToday: boolean
  /** Future days (and every day of an archived habit) cannot be ticked. */
  disabled: boolean
  onToggle: (date: IsoDate) => void
}

export function DayToggle({ date, habitName, color, done, isToday, disabled, onToggle }: DayToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={`${habitName}, ${formatLongDay(date)}`}
      disabled={disabled}
      onClick={() => onToggle(date)}
      // The habit colour is chosen by the user at runtime, so it cannot be a Tailwind class: inline style.
      style={done ? { backgroundColor: color, borderColor: color } : undefined}
      className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-md border py-2 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:outline-mint ${
        done
          ? 'text-white'
          : 'border-line bg-paper hover:border-ink dark:border-night-line dark:bg-night dark:hover:border-paper'
      } ${isToday && !done ? 'border-ink dark:border-paper' : ''}`}
    >
      <span className="uppercase">{formatWeekday(date)}</span>
      <span className="text-sm font-medium">{dayOfMonth(date)}</span>
    </button>
  )
}
