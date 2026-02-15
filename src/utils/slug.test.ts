import { describe, expect, it } from 'vitest'

// The slug derivation logic used throughout the Content Layer migration.
// Glob loader produces IDs like 'my-post/index'. We strip the '/index' suffix.
function deriveSlug(postId: string): string {
  return postId.replace(/\/index$/, '')
}

describe('slug derivation from Content Layer post ID', () => {
  it('strips /index suffix from a standard post ID', () => {
    expect(deriveSlug('my-post-slug/index')).toBe('my-post-slug')
  })

  it('handles post IDs with hyphens', () => {
    expect(
      deriveSlug('apollo-graphql-client-abort-pending-requests/index'),
    ).toBe('apollo-graphql-client-abort-pending-requests')
  })

  it('handles post IDs that do not end with /index', () => {
    expect(deriveSlug('simple-slug')).toBe('simple-slug')
  })

  it('only strips trailing /index, not mid-string', () => {
    expect(deriveSlug('index/my-post/index')).toBe('index/my-post')
  })

  it('produces valid URL paths', () => {
    const slug = deriveSlug('storybook-js-custom-webpack-setup-for-scss/index')
    expect(`/posts/${slug}`).toBe(
      '/posts/storybook-js-custom-webpack-setup-for-scss',
    )
  })
})
