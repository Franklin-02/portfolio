import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

interface ThemeToggleProps {
  className?: string
}

const icon = 'absolute transition duration-500 ease-out-expo'
const iconShown = 'scale-100 rotate-0 opacity-100'

/**
 * Switches between the dark (default) and light theme.
 *
 * The icon shows the theme the button switches to. The hit area is 44px on
 * compact and touch layouts and 40px on the desktop bar; the visible tile is
 * 36px so it lines up with the logo mark and the resume button.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'group inline-flex size-11 shrink-0 items-center justify-center rounded-xl xl:size-10 xl:pointer-coarse:size-11',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex size-9 items-center justify-center rounded-xl border border-line text-muted transition duration-200 group-hover:border-line-strong group-hover:bg-ink/6 group-hover:text-ink group-active:scale-95"
      >
        <Sun size={17} strokeWidth={1.75} className={cn(icon, isDark ? iconShown : 'scale-50 -rotate-90 opacity-0')} />
        <Moon size={17} strokeWidth={1.75} className={cn(icon, isDark ? 'scale-50 rotate-90 opacity-0' : iconShown)} />
      </span>
    </button>
  )
}
