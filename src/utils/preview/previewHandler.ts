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
  extractPostSlug,
  sanitizeAuthor,
  sanitizeSlug,
  validateGitHubUrl,
} from './validation'

// Destructure preview settings from Settings object
const { allowedRepo, allowedBranch } = Settings.preview

export interface PreviewResult {
  postData: PostData | null
  postContent: string
  authorDetails: AuthorProps | null
  heroImageUrl: string | null
  error: string
  showForm: boolean
}

/**
 * Handle example URL redirects
 */
export const handleExampleUrl = (
  exampleParam: string | null,
): string | null => {
  if (!exampleParam) return null

  const exampleUrls = {
    '1': `${allowedRepo}/tree/${allowedBranch}/apollo-graphql-client-abort-pending-requests`,
    '2': `${allowedRepo}/tree/${allowedBranch}/reverse-engineering-popunder-js-chrome`,
    '3': `${allowedRepo}/tree/${allowedBranch}/storybook-js-custom-webpack-setup-for-scss`,
  }

  return exampleUrls[exampleParam as keyof typeof exampleUrls] || null
}

/**
 * Process preview URL and fetch content
 */
export const processPreviewUrl = async (
  urlParam: string | null,
): Promise<PreviewResult> => {
  const result: PreviewResult = {
    postData: null,
    postContent: '',
    authorDetails: null,
    heroImageUrl: null,
    error: '',
    showForm: true,
  }

  if (!urlParam) {
    return result
  }

  result.showForm = false

  if (!validateGitHubUrl(urlParam)) {
    result.error = `Invalid URL. Only URLs from ${allowedRepo}/tree/${allowedBranch}/ are allowed.`
    return result
  }

  try {
    const rawSlug = extractPostSlug(urlParam)
    const postSlug = sanitizeSlug(rawSlug)

    if (!postSlug) {
      throw new Error('Invalid post slug')
    }

    // Fetch post data and content
    result.postData = await fetchPostClaim(postSlug)
    result.postContent = await fetchPostMarkdown(postSlug)

    // Fetch author data if available
    if (result.postData.author && typeof result.postData.author === 'string') {
      const sanitizedAuthor = sanitizeAuthor(result.postData.author)
      try {
        result.authorDetails = await fetchAuthor({
          author: sanitizedAuthor,
        }).then(details => (details?.name ? details : null))
      } catch (error) {
        console.warn('Could not fetch author data:', error)
      }
    }

    // Fetch hero image
    result.heroImageUrl = await fetchHeroImage(postSlug)
  } catch (err) {
    const error = err as Error
    result.error = `Failed to load post: ${error.message}`
  }

  return result
}
