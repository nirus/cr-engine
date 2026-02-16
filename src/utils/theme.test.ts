import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  toggleTheme,
} from './theme'

describe('theme utilities', () => {
  beforeEach(() => {
    const store: Record<string, string> = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
    })
  })

  describe('getStoredTheme', () => {
    it('returns "light" when localStorage is empty', () => {
      expect(getStoredTheme()).toBe('light')
    })

    it('returns "dark" when stored preference is dark', () => {
      localStorage.setItem('theme-preference', 'dark')
      expect(getStoredTheme()).toBe('dark')
    })

    it('returns "light" when stored preference is light', () => {
      localStorage.setItem('theme-preference', 'light')
      expect(getStoredTheme()).toBe('light')
    })

    it('migrates legacy "system" value to "light"', () => {
      localStorage.setItem('theme-preference', 'system')
      expect(getStoredTheme()).toBe('light')
    })
  })

  describe('setStoredTheme', () => {
    it('persists the theme to localStorage', () => {
      setStoredTheme('dark')
      expect(localStorage.getItem('theme-preference')).toBe('dark')
    })
  })

  describe('toggleTheme', () => {
    it('toggles light to dark', () => {
      expect(toggleTheme('light')).toBe('dark')
    })

    it('toggles dark to light', () => {
      expect(toggleTheme('dark')).toBe('light')
    })
  })

  describe('applyTheme', () => {
    beforeEach(() => {
      vi.stubGlobal('document', {
        documentElement: {
          classList: {
            add: vi.fn(),
            remove: vi.fn(),
          },
        },
      })
    })

    it('adds "dark" class for dark preference', () => {
      applyTheme('dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        'dark',
      )
    })

    it('removes "dark" class for light preference', () => {
      applyTheme('light')
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        'dark',
      )
    })
  })
})
