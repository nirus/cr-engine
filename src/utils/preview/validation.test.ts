import { describe, expect, it } from 'vitest'
import {
  extractPostSlugWithBranchName,
  sanitizeAuthor,
  sanitizeSlug,
  validateGitHubUrl,
} from './validation'

describe('validateGitHubUrl', () => {
  it('accepts a valid repo URL with branch and slug', () => {
    expect(
      validateGitHubUrl(
        'https://github.com/nirus/coder-rocks/tree/draft/my-post',
      ),
    ).toBe(true)
  })

  it('accepts a valid repo URL with branch only (no slug)', () => {
    expect(
      validateGitHubUrl('https://github.com/nirus/coder-rocks/tree/main'),
    ).toBe(true)
  })

  it('accepts branches with dots and hyphens', () => {
    expect(
      validateGitHubUrl(
        'https://github.com/nirus/coder-rocks/tree/feature-1.2/my-post',
      ),
    ).toBe(true)
  })

  it('rejects empty string', () => {
    expect(validateGitHubUrl('')).toBe(false)
  })

  it('rejects null/undefined', () => {
    expect(validateGitHubUrl(null as unknown as string)).toBe(false)
    expect(validateGitHubUrl(undefined as unknown as string)).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(validateGitHubUrl(123 as unknown as string)).toBe(false)
  })

  it('rejects a different repository', () => {
    expect(
      validateGitHubUrl('https://github.com/other/repo/tree/main/my-post'),
    ).toBe(false)
  })

  it('rejects a URL without /tree/ path', () => {
    expect(
      validateGitHubUrl('https://github.com/nirus/coder-rocks/blob/main'),
    ).toBe(false)
  })

  it('rejects deeply nested paths beyond one slug level', () => {
    expect(
      validateGitHubUrl(
        'https://github.com/nirus/coder-rocks/tree/main/deep/nested/path',
      ),
    ).toBe(false)
  })
})

describe('sanitizeSlug', () => {
  it('returns slug unchanged for valid input', () => {
    expect(sanitizeSlug('my-post-slug')).toBe('my-post-slug')
  })

  it('allows underscores', () => {
    expect(sanitizeSlug('my_post')).toBe('my_post')
  })

  it('strips special characters', () => {
    expect(sanitizeSlug('my post!@#$%')).toBe('mypost')
  })

  it('strips unicode characters', () => {
    expect(sanitizeSlug('café-post')).toBe('caf-post')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeSlug('')).toBe('')
  })

  it('returns empty string for null/undefined', () => {
    expect(sanitizeSlug(null as unknown as string)).toBe('')
    expect(sanitizeSlug(undefined as unknown as string)).toBe('')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeSlug(42 as unknown as string)).toBe('')
  })
})

describe('extractPostSlugWithBranchName', () => {
  it('extracts branch and slug from a full URL', () => {
    expect(
      extractPostSlugWithBranchName(
        'https://github.com/nirus/coder-rocks/tree/draft/my-post',
      ),
    ).toBe('draft/my-post')
  })

  it('returns empty string when URL has fewer than 3 parts', () => {
    expect(extractPostSlugWithBranchName('ab')).toBe('')
  })

  it('returns empty string for empty input', () => {
    expect(extractPostSlugWithBranchName('')).toBe('')
  })

  it('sanitizes the slug portion', () => {
    expect(
      extractPostSlugWithBranchName(
        'https://github.com/nirus/coder-rocks/tree/draft/my post!',
      ),
    ).toBe('draft/mypost')
  })

  it('returns empty string when slug sanitizes to empty', () => {
    expect(
      extractPostSlugWithBranchName(
        'https://github.com/nirus/coder-rocks/tree/draft/!!!',
      ),
    ).toBe('')
  })
})

describe('sanitizeAuthor', () => {
  it('returns valid author name unchanged', () => {
    expect(sanitizeAuthor('nirus')).toBe('nirus')
  })

  it('allows hyphens and underscores', () => {
    expect(sanitizeAuthor('user-name_1')).toBe('user-name_1')
  })

  it('strips special characters', () => {
    expect(sanitizeAuthor('user@name!')).toBe('username')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeAuthor('')).toBe('')
  })

  it('returns empty string for null/undefined', () => {
    expect(sanitizeAuthor(null as unknown as string)).toBe('')
    expect(sanitizeAuthor(undefined as unknown as string)).toBe('')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeAuthor(99 as unknown as string)).toBe('')
  })
})
