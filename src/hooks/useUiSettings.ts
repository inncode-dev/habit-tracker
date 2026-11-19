import { use } from 'react'
import { UiSettingsContext } from '../state/uiSettingsContext'

export function useUiSettings() {
  const value = use(UiSettingsContext)
  if (!value) throw new Error('useUiSettings must be used inside <UiSettingsProvider>')
  return value
}
