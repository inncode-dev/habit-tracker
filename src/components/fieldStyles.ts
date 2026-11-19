// Shared by TextField and Select so both look identical.
export const fieldClasses =
  'w-full rounded-md border bg-paper px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-2 ' +
  'focus-visible:outline-offset-1 focus-visible:outline-accent dark:bg-night dark:placeholder:text-night-muted ' +
  'dark:focus-visible:outline-mint'

export const labelClasses = 'font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted'

export function borderFor(hasError: boolean) {
  return hasError ? 'border-red-600 dark:border-red-400' : 'border-line dark:border-night-line'
}
