import type { DoneDays, Habit, IsoDate } from '../types'
import { addDays, dayNumber } from './dates'

export const COMPLETION_WINDOW_DAYS = 30

export function countDone(done: DoneDays | undefined, days: IsoDate[]): number {
  return done ? days.filter((day) => done[day]).length : 0
}

/**
 * Completion rate over the last 30 days (or since creation, for newer habits).
 * Expected check-ins = target per week × weeks in the window, so a "3 days a week"
 * habit done 3 times a week scores 100%, not 43%. Capped at 100%.
 */
export function completionRate(habit: Habit, done: DoneDays | undefined, today: IsoDate): number {
  const age = dayNumber(today) - dayNumber(habit.createdAt) + 1
  const windowDays = Math.max(1, Math.min(COMPLETION_WINDOW_DAYS, age))
  const start = addDays(today, -(windowDays - 1))

  const completed = Object.keys(done ?? {}).filter((day) => day >= start && day <= today).length
  const expected = (habit.targetPerWeek * windowDays) / 7
  return Math.min(100, Math.round((completed / expected) * 100))
}
