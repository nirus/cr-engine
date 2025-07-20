import type { Props as AuthorProps } from '@component/Footer/PostFooter.astro'
import { Settings } from '@config/site'
import { fetchAuthor } from '@request/fetchAuthor'
import {
  fetchHeroImage,
  fetchPostClaim,
  fetchPostMarkdown,
  type PostData,
} from './githubApi'
import {
  extractPostSlugWithBranchName,
  sanitizeAuthor,
  validateGitHubUrl,
} from './validation'

// Destructure preview settings from Settings object
const { allowedRepo } = Settings.preview

export interface PreviewResult {
  postData: PostData | null
  postContent: string
  authorDetails: AuthorProps | null
  heroImageUrl: string | null
  error: string
}

/**
 * Process preview URL and fetch content
 */
export const processPreviewUrl = async (
  urlParam: string | null,
  userAgent: string | null,
): Promise<PreviewResult> => {
  const result: PreviewResult = {
    postData: null,
    postContent: '',
    authorDetails: null,
    heroImageUrl: null,
    error: '',
  }

  if (!urlParam) {
    return result
  }
  if (!validateGitHubUrl(urlParam)) {
    result.error = `Invalid URL. Only URLs from ${allowedRepo}/tree/ are allowed.`
    return result
  }

  try {
    const rawSlugWithBranch = extractPostSlugWithBranchName(urlParam)

    if (!rawSlugWithBranch) {
      throw new Error('Invalid post slug')
    }

    // Fetch post data and content
    result.postData = await fetchPostClaim(rawSlugWithBranch)

    result.postContent = await fetchPostMarkdown(rawSlugWithBranch)

    // Fetch author data if available
    if (result.postData.author && typeof result.postData.author === 'string') {
      const sanitizedAuthor = sanitizeAuthor(result.postData.author)
      try {
        result.authorDetails = await fetchAuthor({
          author: sanitizedAuthor,
          userAgent,
        }).then(details => (details?.name ? details : null))
      } catch (error) {
        console.warn('Could not fetch author data:', error)
      }
    }

    // Fetch hero image
    result.heroImageUrl = await fetchHeroImage(rawSlugWithBranch)
  } catch (err) {
    const error = err as Error
    result.error = `Failed to load post: ${error.message}`
  }

  return result
}
