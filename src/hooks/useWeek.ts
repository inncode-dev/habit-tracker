import { useMemo, useState } from 'react'
import type { IsoDate, WeekStart } from '../types'
import { addDays, formatWeekRange, getWeekDays, startOfWeek } from '../lib/dates'

/** The week on screen and the controls to move between weeks. */
export function useWeek(today: IsoDate, weekStartsOn: WeekStart) {
  // Local state stores only "how many weeks away from this one", not a date.
  // The visible week therefore follows `today` and `weekStartsOn` automatically.
  const [offset, setOffset] = useState(0)

  const days = useMemo(
    () => getWeekDays(addDays(startOfWeek(today, weekStartsOn), offset * 7)),
    [today, weekStartsOn, offset],
  )

  return {
    days,
    label: formatWeekRange(days[0], days[6]),
    isCurrentWeek: offset === 0,
    goToPrevious: () => setOffset((o) => o - 1),
    goToNext: () => setOffset((o) => o + 1),
    goToToday: () => setOffset(0),
  }
}
