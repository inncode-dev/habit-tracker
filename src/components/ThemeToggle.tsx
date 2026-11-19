import { useUiSettings } from '../hooks/useUiSettings'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useUiSettings()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button onClick={toggleTheme} className="py-2.5" aria-label={`Switch to ${next} theme`}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  )
}
