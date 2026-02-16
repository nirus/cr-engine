import { describe, expect, it } from 'vitest'
import { githubUserNameRegex, youtubeImgPreview } from './help'

describe('youtubeImgPreview', () => {
  it('constructs the correct YouTube thumbnail URL', () => {
    expect(youtubeImgPreview('dQw4w9WgXcQ')).toBe(
      'http://i3.ytimg.com/vi/dQw4w9WgXcQ/0.jpg',
    )
  })

  it('handles short video IDs', () => {
    expect(youtubeImgPreview('abc')).toBe('http://i3.ytimg.com/vi/abc/0.jpg')
  })

  it('embeds the ID as-is without encoding', () => {
    const id = 'a-B_c1'
    expect(youtubeImgPreview(id)).toContain(id)
  })
})

describe('githubUserNameRegex', () => {
  it('matches a simple lowercase username', () => {
    expect(githubUserNameRegex.test('nirus')).toBe(true)
  })

  it('matches a username with hyphens', () => {
    expect(githubUserNameRegex.test('my-user')).toBe(true)
  })

  it('matches a username with digits', () => {
    expect(githubUserNameRegex.test('user123')).toBe(true)
  })

  it('matches a single character username', () => {
    expect(githubUserNameRegex.test('a')).toBe(true)
  })

  it('matches an uppercase username (case-insensitive)', () => {
    expect(githubUserNameRegex.test('Nirus')).toBe(true)
  })

  it('rejects a username starting with a hyphen', () => {
    expect(githubUserNameRegex.test('-user')).toBe(false)
  })

  it('rejects a username with consecutive hyphens', () => {
    expect(githubUserNameRegex.test('user--name')).toBe(false)
  })

  it('rejects a username ending with a hyphen', () => {
    expect(githubUserNameRegex.test('user-')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(githubUserNameRegex.test('')).toBe(false)
  })

  it('rejects a username longer than 39 characters', () => {
    expect(githubUserNameRegex.test('a'.repeat(40))).toBe(false)
  })

  it('accepts a username exactly 39 characters', () => {
    expect(githubUserNameRegex.test('a'.repeat(39))).toBe(true)
  })

  it('rejects usernames with special characters', () => {
    expect(githubUserNameRegex.test('user@name')).toBe(false)
    expect(githubUserNameRegex.test('user.name')).toBe(false)
    expect(githubUserNameRegex.test('user_name')).toBe(false)
  })
})
