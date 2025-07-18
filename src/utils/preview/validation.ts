import { Settings } from '@config/site'

/**
 * Validate GitHub URL against allowed repository and branch
 */
export const validateGitHubUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false

  // Only allow specific repository and branch
  const allowedPattern = new RegExp(
    `^${Settings.preview.allowedRepo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/tree/${Settings.preview.allowedBranch}/[a-zA-Z0-9-_]+$`,
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
 * Extract post slug from GitHub URL
 */
export const extractPostSlug = (url: string): string => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1] || ''
}

/**
 * Sanitize author username for API calls
 */
export const sanitizeAuthor = (author: string): string => {
  if (!author || typeof author !== 'string') return ''
  return author.replace(/[^a-zA-Z0-9-_]/g, '')
}
