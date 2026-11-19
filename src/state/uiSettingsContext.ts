import { createContext } from 'react'
import type { Theme, WeekStart } from '../types'

export interface UiSettings {
  theme: Theme
  weekStartsOn: WeekStart
  toggleTheme: () => void
  setWeekStartsOn: (value: WeekStart) => void
}

export const UiSettingsContext = createContext<UiSettings | null>(null)
