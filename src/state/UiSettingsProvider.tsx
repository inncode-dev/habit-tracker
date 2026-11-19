import { useEffect, useMemo, type ReactNode } from 'react'
import type { Theme, WeekStart } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { UiSettingsContext } from './uiSettingsContext'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

function isWeekStart(value: unknown): value is WeekStart {
  return value === 0 || value === 1
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Why a Context here and not Zustand? These are two tiny UI preferences read by a few
// components and changed rarely. A Context is built into React and plenty for that;
// the habits, which are the real application data, live in the Zustand store.
export function UiSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('inncode-habits:theme', getSystemTheme(), isTheme)
  const [weekStartsOn, setWeekStartsOn] = useLocalStorage<WeekStart>('inncode-habits:week-start', 1, isWeekStart)

  // Tailwind's `dark:` variant looks for a `dark` class on <html>: syncing the DOM is a side effect.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // useMemo keeps the value's identity stable between renders, so consumers
  // re-render only when a setting actually changes.
  const value = useMemo(
    () => ({
      theme,
      weekStartsOn,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setWeekStartsOn,
    }),
    [theme, weekStartsOn, setTheme, setWeekStartsOn],
  )

  return <UiSettingsContext value={value}>{children}</UiSettingsContext>
}
