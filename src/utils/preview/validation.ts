import { Settings } from '@config/site'

/**
 * Validate GitHub URL against allowed repository and branch
 */
export const validateGitHubUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false

  // Only allow specific repository and branch
  const allowedPattern = new RegExp(
    `^${Settings.preview.allowedRepo.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    )}/tree/[a-zA-Z0-9_][a-zA-Z0-9_.-]*(/[a-zA-Z0-9_-]+)?$`,
  )
  return allowedPattern.test(url)
}

/**
 * Sanitize post slug to only allow safe characters
 */
export const sanitizeSlug = (slug: string): string => {
  if (!slug || typeof slug !== 'string') return ''
  // Only allow alphanumeric, hyphens, and underscores
  return slug.replace(/[^a-zA-Z0-9-_]/g, '')
}

/**
 * Extract post slug with branch name from GitHub URL
 */
export const extractPostSlugWithBranchName = (url: string): string => {
  const parts = url.split('/')

  if (parts.length < 3) {
    return ''
  }

  const slug = sanitizeSlug(parts[parts.length - 1])
  const branch = parts[parts.length - 2]
  if (!url || !branch || !slug) {
    return ''
  }
  return `${branch}/${slug}`
}

/**
 * Sanitize author username for API calls
 */
export const sanitizeAuthor = (author: string): string => {
  if (!author || typeof author !== 'string') return ''
  return author.replace(/[^a-zA-Z0-9-_]/g, '')
}
