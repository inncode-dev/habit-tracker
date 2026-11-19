import type { IsoDate, WeekStart } from '../types'

// All the date maths works on `YYYY-MM-DD` strings, converted to UTC day
// numbers only when needed. UTC has no daylight-saving changes, so
// "add 7 days" is always exactly 7 days (a local-time Date can give 6 or 8
// when the clocks change). Only `todayISO` looks at the local calendar,
// because "today" is by definition what the user's wall clock says.

const pad = (n: number) => String(n).padStart(2, '0')

function toUtcDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function fromUtcDate(date: Date): IsoDate {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export function todayISO(): IsoDate {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = toUtcDate(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return fromUtcDate(date)
}

/** Whole days since 1970-01-01: lets us compare days with plain subtraction. */
export function dayNumber(iso: IsoDate): number {
  return toUtcDate(iso).getTime() / 86_400_000
}

export function startOfWeek(iso: IsoDate, weekStartsOn: WeekStart): IsoDate {
  const weekday = toUtcDate(iso).getUTCDay()
  return addDays(iso, -((weekday - weekStartsOn + 7) % 7))
}

export function getWeekDays(weekStart: IsoDate): IsoDate[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' })
const longDayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const shortDayFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const yearFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', timeZone: 'UTC' })

export const formatWeekday = (iso: IsoDate) => weekdayFormatter.format(toUtcDate(iso))
export const formatLongDay = (iso: IsoDate) => longDayFormatter.format(toUtcDate(iso))
export const dayOfMonth = (iso: IsoDate) => String(toUtcDate(iso).getUTCDate())

/** "17 Nov – 23 Nov 2026" */
export function formatWeekRange(first: IsoDate, last: IsoDate): string {
  return `${shortDayFormatter.format(toUtcDate(first))} – ${shortDayFormatter.format(toUtcDate(last))} ${yearFormatter.format(toUtcDate(last))}`
}

export function isValidISODate(value: unknown): value is IsoDate {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return fromUtcDate(toUtcDate(value)) === value
}
