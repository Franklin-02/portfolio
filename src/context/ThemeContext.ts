import { createContext } from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** localStorage key. Keep in sync with the inline script in index.html. */
export const THEME_STORAGE_KEY = 'fsm-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)
