import type { DoneDays, IsoDate, Streaks } from '../types'
import { addDays, dayNumber } from './dates'

/**
 * Current streak: consecutive completed days ending today.
 * If today is not done yet we start from yesterday, so a streak of 12 does not
 * drop to 0 at 8 a.m. just because the user has not ticked today. It breaks
 * only when a whole day has passed without a check.
 *
 * Best streak: the longest run of consecutive days anywhere in the history.
 */
export function computeStreaks(done: DoneDays | undefined, today: IsoDate): Streaks {
  if (!done) return { current: 0, best: 0 }

  let cursor = done[today] ? today : addDays(today, -1)
  let current = 0
  while (done[cursor]) {
    current += 1
    cursor = addDays(cursor, -1)
  }

  // Sorting day numbers puts consecutive days next to each other: a gap of exactly 1 continues the run.
  const days = Object.keys(done).map(dayNumber).sort((a, b) => a - b)
  let best = 0
  let run = 0
  days.forEach((day, i) => {
    run = i > 0 && day - days[i - 1] === 1 ? run + 1 : 1
    best = Math.max(best, run)
  })

  return { current, best }
}
