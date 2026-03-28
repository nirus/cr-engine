export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

export function getStoredTheme(): ThemePreference {
  if (typeof localStorage === 'undefined') {
    return 'dark'
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function setStoredTheme(theme: ThemePreference): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(STORAGE_KEY, theme)
}

export function toggleTheme(current: ThemePreference): ThemePreference {
  return current === 'light' ? 'dark' : 'light'
}

export function applyTheme(preference: ThemePreference): void {
  if (preference === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
