import { useId, type SelectHTMLAttributes } from 'react'
import { borderFor, fieldClasses, labelClasses } from './fieldStyles'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {/* appearance-none removes the native arrow, which sits flush against the border;
          our own chevron gets a 12px gap on the right (right-3) and the text keeps clear of it (pr-9). */}
      <div className="relative">
        <select
          id={id}
          className={`${fieldClasses} ${borderFor(false)} cursor-pointer appearance-none pr-9 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted dark:text-night-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>
    </div>
  )
}
