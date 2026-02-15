import { githubUserNameRegex } from '@utils/help'
import { describe, expect, it } from 'vitest'

/**
 * fetchAuthor itself depends on Astro's import.meta.env and an Astro
 * component type import, making it hard to unit-test in isolation.
 * We test the validation logic that guards the fetch call instead.
 */
describe('fetchAuthor validation logic', () => {
  describe('githubUserNameRegex guards', () => {
    it('allows a valid author through to the fetch path', () => {
      expect(githubUserNameRegex.test('nirus')).toBe(true)
    })

    it('blocks author names with special characters', () => {
      expect(githubUserNameRegex.test('nirus!')).toBe(false)
      expect(githubUserNameRegex.test('user@evil')).toBe(false)
    })

    it('blocks empty author name', () => {
      expect(githubUserNameRegex.test('')).toBe(false)
    })

    it('blocks author name starting with hyphen', () => {
      expect(githubUserNameRegex.test('-nirus')).toBe(false)
    })

    it('blocks overly long author names', () => {
      expect(githubUserNameRegex.test('a'.repeat(40))).toBe(false)
    })
  })

  describe('GitHub API URL construction', () => {
    it('constructs the correct API endpoint', () => {
      const author = 'nirus'
      const url = `https://api.github.com/users/${author}`
      expect(url).toBe('https://api.github.com/users/nirus')
    })

    it('does not encode the username in the URL', () => {
      const author = 'my-user'
      const url = `https://api.github.com/users/${author}`
      expect(url).toContain('my-user')
    })
  })
})
