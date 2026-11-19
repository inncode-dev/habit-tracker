import { useId } from 'react'
import type { HabitColor } from '../types'
import { HABIT_COLORS } from '../lib/colors'
import { labelClasses } from './fieldStyles'

interface ColorPickerProps {
  value: HabitColor
  onChange: (color: HabitColor) => void
}

// Native radio inputs, visually hidden (`sr-only`): arrow keys, grouping and screen reader
// support come for free. The coloured circle is the <span> that follows each input,
// styled through the `peer-*` variants.
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const name = useId()

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${labelClasses} mb-1.5`}>Colour</legend>
      <div className="flex flex-wrap gap-2 py-1">
        {HABIT_COLORS.map((color) => (
          <label key={color.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={color.value}
              checked={value === color.value}
              onChange={() => onChange(color.value)}
              className="peer sr-only"
            />
            <span
              title={color.label}
              style={{ backgroundColor: color.hex }}
              className="block size-7 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-surface peer-checked:ring-ink peer-focus-visible:ring-accent dark:ring-offset-night-surface dark:peer-checked:ring-paper dark:peer-focus-visible:ring-mint"
            >
              <span className="sr-only">{color.label}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
