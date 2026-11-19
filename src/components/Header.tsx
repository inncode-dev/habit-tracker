import { useState } from 'react'
import { useHabitStore } from '../store/habitStore'
import { useUiSettings } from '../hooks/useUiSettings'
import type { WeekStart } from '../types'
import { Button } from './Button'
import { Select } from './Select'
import { ThemeToggle } from './ThemeToggle'

const WEEK_START_OPTIONS = [
  { value: '1', label: 'Monday' },
  { value: '0', label: 'Sunday' },
]

export function Header() {
  // Selecting just the action: functions in a Zustand store never change, so this never re-renders.
  const resetDemo = useHabitStore((state) => state.resetDemo)
  const { weekStartsOn, setWeekStartsOn } = useUiSettings()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const handleReset = () => {
    resetDemo()
    setConfirmingReset(false)
  }

  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between dark:border-night-line">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted dark:text-night-muted">
          InnCode Lab · Project 02
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
          Habit Tracker
        </h1>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="w-36">
          <Select
            label="Week starts on"
            value={String(weekStartsOn)}
            onChange={(event) => setWeekStartsOn(Number(event.target.value) as WeekStart)}
            options={WEEK_START_OPTIONS}
          />
        </div>
        {confirmingReset ? (
          <>
            <span role="alert" className="py-2.5 font-mono text-xs text-muted dark:text-night-muted">
              Replace all data with the demo?
            </span>
            <Button variant="primary" onClick={handleReset} className="py-2.5">
              Yes, reset
            </Button>
            <Button onClick={() => setConfirmingReset(false)} className="py-2.5">
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setConfirmingReset(true)} className="py-2.5">
            Reset demo data
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
