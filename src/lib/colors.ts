import type { HabitColor } from '../types'

// Mid-tone colours that stay readable on both the light and the dark background.
export const HABIT_COLORS: { value: HabitColor; label: string; hex: string }[] = [
  { value: 'slate', label: 'Slate', hex: '#4f6b78' },
  { value: 'sage', label: 'Sage', hex: '#5f9470' },
  { value: 'ochre', label: 'Ochre', hex: '#b58a2e' },
  { value: 'clay', label: 'Clay', hex: '#b5654a' },
  { value: 'plum', label: 'Plum', hex: '#8a5f9c' },
  { value: 'sky', label: 'Sky', hex: '#4a7fb5' },
]

export function colorHex(color: HabitColor): string {
  return HABIT_COLORS.find((c) => c.value === color)?.hex ?? HABIT_COLORS[0].hex
}

export function isHabitColor(value: unknown): value is HabitColor {
  return HABIT_COLORS.some((c) => c.value === value)
}
