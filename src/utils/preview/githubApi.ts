import { Settings } from '@config/site'

export interface GitHubApiResponse {
  content?: string
  download_url?: string
}

export interface PostData {
  title: string
  description: string
  pubDate: string
  tags: string[]
  author: string
  youtube?: string
}

/**
 * Secure API fetch with error handling and proper headers
 */
export const secureApiFetch = async (
  url: string,
): Promise<GitHubApiResponse> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CoderRocks-Preview/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

/**
 * Fetch and decode file content from GitHub API
 */
export const fetchFileContent = async (
  postSlug: string,
  fileName: string,
): Promise<string> => {
  const apiUrl = `${Settings.preview.githubApiBaseUrl}/${postSlug}/${fileName}?ref=${Settings.preview.allowedBranch}`
  const response = await secureApiFetch(apiUrl)

  if (!response.content) {
    throw new Error(`No ${fileName} content found`)
  }

  return atob(response.content)
}

/**
 * Fetch post claim.json data
 */
export const fetchPostClaim = async (postSlug: string): Promise<PostData> => {
  const claimContent = await fetchFileContent(postSlug, 'claim.json')
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
export const fetchPostMarkdown = async (postSlug: string): Promise<string> => {
  return await fetchFileContent(postSlug, 'index.md')
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
      const heroImageUrl = `${Settings.preview.githubApiBaseUrl}/${postSlug}/hero.${extension}?ref=${Settings.preview.allowedBranch}`
      const response = await fetch(heroImageUrl, {
        headers: {
          'User-Agent': 'CoderRocks-Preview/1.0',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.download_url || null
      }

      return null
    } catch (error) {
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
