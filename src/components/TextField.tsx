import { useId, type InputHTMLAttributes, type Ref } from 'react'
import { borderFor, fieldClasses, labelClasses } from './fieldStyles'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** React 19: `ref` is a regular prop, no forwardRef needed. */
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, error, className = '', ref, ...props }: TextFieldProps) {
  // useId gives a unique, render-stable id to connect label, input and error message.
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldClasses} ${borderFor(Boolean(error))} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
