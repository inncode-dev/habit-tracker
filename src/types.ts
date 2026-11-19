export type Theme = 'light' | 'dark'

/** 0 = Sunday, 1 = Monday: same numbering as Date.getDay(). */
export type WeekStart = 0 | 1

/** A calendar day as `YYYY-MM-DD`. Strings avoid timezone surprises (see lib/dates.ts). */
export type IsoDate = string

export type HabitColor = 'slate' | 'sage' | 'ochre' | 'clay' | 'plum' | 'sky'

export interface Habit {
  id: string
  name: string
  color: HabitColor
  /** Goal: how many days per week (1-7). */
  targetPerWeek: number
  notes: string
  archived: boolean
  createdAt: IsoDate
}

/** What the form collects: a habit before it has an id, a creation date or an archived flag. */
export type HabitInput = Pick<Habit, 'name' | 'color' | 'targetPerWeek' | 'notes'>

/** Completed days of one habit, as a set-like object: `done['2026-11-19'] === true`. */
export type DoneDays = Record<IsoDate, true>

export type HabitFilter = 'active' | 'archived'

export interface Streaks {
  current: number
  best: number
}
