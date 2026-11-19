import { useEffect, useRef, useState } from 'react'
import type { IsoDate } from '../types'
import { todayISO } from '../lib/dates'

/**
 * Today's date, kept correct if the tab stays open past midnight.
 * Without this, "today" would be frozen at the moment the page loaded.
 */
export function useToday(): IsoDate {
  const [today, setToday] = useState(todayISO)
  // A ref holds the timer id: it must survive between calls (to cancel it) but is not something to render.
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const scheduleNextMidnight = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      // +1s of margin so we wake up just after the date has really changed.
      timer.current = window.setTimeout(refresh, midnight.getTime() - now.getTime() + 1000)
    }

    function refresh() {
      window.clearTimeout(timer.current)
      setToday(todayISO()) // same string as before => React skips the re-render
      scheduleNextMidnight()
    }

    scheduleNextMidnight()
    // Timers are paused or delayed while a laptop sleeps or a tab is in the background:
    // re-check as soon as the user comes back.
    document.addEventListener('visibilitychange', refresh)

    return () => {
      window.clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return today
}
