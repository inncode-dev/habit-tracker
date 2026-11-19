import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Habit, HabitColor } from '../types'
import { useHabitStore } from '../store/habitStore'
import { NAME_MAX, NOTES_MAX, validateHabitForm, type HabitFormErrors } from '../lib/validation'
import { Button } from './Button'
import { ColorPicker } from './ColorPicker'
import { Select } from './Select'
import { TextAreaField } from './TextAreaField'
import { TextField } from './TextField'

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  value: String(n),
  label: n === 7 ? 'Every day' : `${n} ${n === 1 ? 'day' : 'days'} a week`,
}))

interface HabitFormProps {
  /** The habit being edited, or null to create a new one. */
  editing: Habit | null
  onDone: () => void
}

// The parent gives this form a `key` tied to the habit being edited, so React
// remounts it and the initial values below are re-read: no effect needed to sync props into state.
export function HabitForm({ editing, onDone }: HabitFormProps) {
  const addHabit = useHabitStore((state) => state.addHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)

  const [name, setName] = useState(editing?.name ?? '')
  const [color, setColor] = useState<HabitColor>(editing?.color ?? 'sage')
  const [target, setTarget] = useState(String(editing?.targetPerWeek ?? 5))
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [errors, setErrors] = useState<HabitFormErrors>({})

  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) nameRef.current?.focus()
  }, [editing])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateHabitForm({ name, notes })
    setErrors(nextErrors)
    if (nextErrors.name) return nameRef.current?.focus()
    if (nextErrors.notes) return

    const input = { name: name.trim(), color, targetPerWeek: Number(target), notes: notes.trim() }

    if (editing) {
      updateHabit(editing.id, input)
      onDone()
      return
    }

    addHabit(input)
    setName('')
    setNotes('')
    nameRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={editing ? 'Edit habit' : 'New habit'}
      className="rounded-lg border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface"
    >
      <h2 className="mb-4 font-display text-lg font-extrabold uppercase">{editing ? 'Edit habit' : 'New habit'}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_2fr_auto] lg:items-start">
        <TextField
          ref={nameRef}
          label="Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }))
          }}
          maxLength={NAME_MAX + 10}
          placeholder="e.g. Read 20 minutes"
          error={errors.name}
        />
        <Select
          label="Goal"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          options={TARGET_OPTIONS}
        />
        <TextAreaField
          label="Notes (optional)"
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value)
            if (errors.notes) setErrors((current) => ({ ...current, notes: undefined }))
          }}
          rows={1}
          maxLength={NOTES_MAX + 20}
          placeholder="Why does it matter?"
          error={errors.notes}
        />
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" variant="primary" className="py-2.5">
          {editing ? 'Save changes' : 'Add habit'}
        </Button>
        {editing && (
          <Button onClick={onDone} className="py-2.5">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
