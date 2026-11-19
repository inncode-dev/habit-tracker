import { useMemo } from 'react'
import type { DoneDays, IsoDate, WeekStart } from '../types'
import { addDays, formatLongDay, getWeekDays, startOfWeek } from '../lib/dates'

const WEEKS = 13 // about three months

interface HeatmapProps {
  done: DoneDays | undefined
  color: string
  today: IsoDate
  weekStartsOn: WeekStart
  createdAt: IsoDate
}

// A "heatmap" with no library: a CSS grid with 7 rows (weekdays) that fills column by column
// (`grid-flow-col`), one column per week. Each cell is a coloured div.
export function Heatmap({ done, color, today, weekStartsOn, createdAt }: HeatmapProps) {
  const { days, completed } = useMemo(() => {
    const firstWeek = addDays(startOfWeek(today, weekStartsOn), -(WEEKS - 1) * 7)
    const days = Array.from({ length: WEEKS }, (_, w) => getWeekDays(addDays(firstWeek, w * 7))).flat()
    const completed = days.filter((d) => d <= today && done?.[d]).length
    return { days, completed }
  }, [done, today, weekStartsOn])

  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted">
        Last 3 months · {completed} {completed === 1 ? 'day' : 'days'}
      </p>
      {/* One label for the whole grid: 91 individual cells would be noise for a screen reader. */}
      <div
        role="img"
        aria-label={`Heatmap of the last 3 months: ${completed} days completed`}
        className="grid max-w-[17rem] auto-cols-fr grid-flow-col grid-rows-7 gap-1"
      >
        {days.map((date) => {
          const isFuture = date > today
          const isDone = !isFuture && done?.[date]
          return (
            <div
              key={date}
              title={isFuture ? undefined : `${formatLongDay(date)}${isDone ? ' ✓' : ''}`}
              style={isDone ? { backgroundColor: color } : undefined}
              className={`aspect-square rounded-xs ${
                isFuture
                  ? 'invisible'
                  : isDone
                    ? ''
                    : date < createdAt
                      ? 'bg-line/40 dark:bg-night-line/40'
                      : 'bg-line dark:bg-night-line'
              } ${date === today ? 'outline-1 outline-offset-1 outline-ink dark:outline-paper' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
}
