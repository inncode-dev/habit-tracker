import type { HabitFilter } from '../types'
import { Button } from './Button'

interface ToolbarProps {
  filter: HabitFilter
  onFilterChange: (filter: HabitFilter) => void
  weekLabel: string
  isCurrentWeek: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  counts: Record<HabitFilter, number>
}

const FILTERS: { value: HabitFilter; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

export function Toolbar({ filter, onFilterChange, weekLabel, isCurrentWeek, onPrevious, onNext, onToday, counts }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label="Show habits" className="flex gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? 'primary' : 'secondary'}
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {label} ({counts[value]})
          </Button>
        ))}
      </div>

      <div role="group" aria-label="Week navigation" className="flex items-center gap-2">
        <Button onClick={onPrevious} aria-label="Previous week">
          ←
        </Button>
        <p aria-live="polite" className="min-w-40 text-center font-mono text-xs uppercase tracking-wide">
          {weekLabel}
        </p>
        <Button onClick={onNext} aria-label="Next week">
          →
        </Button>
        <Button onClick={onToday} disabled={isCurrentWeek}>
          Today
        </Button>
      </div>
    </div>
  )
}
