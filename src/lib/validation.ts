export const NAME_MAX = 40
export const NOTES_MAX = 200

export interface HabitFormValues {
  name: string
  notes: string
}

export type HabitFormErrors = Partial<Record<keyof HabitFormValues, string>>

export function validateHabitForm({ name, notes }: HabitFormValues): HabitFormErrors {
  const errors: HabitFormErrors = {}
  const trimmed = name.trim()
  if (!trimmed) errors.name = 'Name is required.'
  else if (trimmed.length > NAME_MAX) errors.name = `Keep it under ${NAME_MAX} characters.`
  if (notes.trim().length > NOTES_MAX) errors.notes = `Keep notes under ${NOTES_MAX} characters.`
  return errors
}
