import { Settings } from '@config/site'

export interface PostData {
  title: string
  description: string
  pubDate: string
  tags: string[]
  author: string
  youtube?: string
}

// Destructure preview settings from Settings object
const { rawBaseUrl } = Settings.preview

/**
 * Get raw GitHub content URL
 */
const getRawUrl = (postSlug: string, fileName: string): string => {
  return `${rawBaseUrl}/${postSlug}/${fileName}`
}

/**
 * Fetch file content from raw.githubusercontent.com
 */
export const fetchFileContent = async (
  postSlug: string,
  fileName: string,
  request: Pick<Request, 'headers'>,
): Promise<string> => {
  const rawUrl = getRawUrl(postSlug, fileName)

  try {
    const response = await fetch(rawUrl, {
      headers: request.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName}: ${response.status}`)
    }

    const content = await response.text()

    return content
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error)
    return ''
  }
}

/**
 * Fetch post claim.json data
 */
export const fetchPostClaim = async (
  postSlug: string,
  request: Pick<Request, 'headers'>,
): Promise<PostData> => {
  const claimContent = await fetchFileContent(postSlug, 'claim.json', request)
  const postData = JSON.parse(claimContent)

  // Validate required fields
  if (!postData.title || !postData.description) {
    throw new Error('Invalid post data: missing required fields')
  }

  return postData
}

/**
 * Fetch post markdown content
 */
export const fetchPostMarkdown = async (
  postSlug: string,
  request: Pick<Request, 'headers'>,
): Promise<string> => {
  const content = await fetchFileContent(postSlug, 'index.md', request)
  return content
}

/**
 * Fetch hero image URL (tries PNG first, then JPG)
 */
export const fetchHeroImage = async (
  postSlug: string,
): Promise<string | null> => {
  // Helper function to try fetching a hero image
  const tryFetchHeroImage = async (
    extension: string,
  ): Promise<string | null> => {
    try {
      const heroImageUrl = getRawUrl(postSlug, `hero.${extension}`)
      const response = await fetch(heroImageUrl, {
        headers: {
          'User-Agent': 'CoderRocks-Preview/1.0',
        },
      })

      if (response.ok) {
        return heroImageUrl
      }

      return null
    } catch (_error) {
      return null
    }
  }

  // Try PNG first
  const pngUrl = await tryFetchHeroImage('png')
  if (pngUrl) return pngUrl

  // Try JPG if PNG doesn't exist
  const jpgUrl = await tryFetchHeroImage('jpg')
  if (jpgUrl) return jpgUrl

  // No hero image found
  return null
}
