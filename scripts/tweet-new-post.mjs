import { createHmac, randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'

const SITE_URL = process.env.SITE_URL || 'https://coder.rocks'
const X_HANDLE = process.env.X_HANDLE || 'Coder_Rocks'
const API_URL = 'https://api.x.com/2/tweets'

const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env

const slugs = (process.argv[2] || '').split(',').filter(Boolean)

if (slugs.length === 0) {
  console.log('No new posts to tweet')
  process.exit(0)
}

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
  console.error('Missing X API credentials in environment')
  process.exit(1)
}

/**
 * Generate OAuth 1.0a signature for the X API
 */
function oauthSign(method, url, params) {
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(
      Object.keys(params)
        .sort()
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&'),
    ),
  ].join('&')

  const signingKey = `${encodeURIComponent(X_API_SECRET)}&${encodeURIComponent(X_ACCESS_SECRET)}`
  return createHmac('sha1', signingKey).update(signatureBase).digest('base64')
}

/**
 * Build OAuth 1.0a Authorization header
 */
function oauthHeader(method, url) {
  const oauthParams = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: X_ACCESS_TOKEN,
    oauth_version: '1.0',
  }

  oauthParams.oauth_signature = oauthSign(method, url, oauthParams)

  const header = Object.keys(oauthParams)
    .sort()
    .map(
      k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`,
    )
    .join(', ')

  return `OAuth ${header}`
}

/**
 * Compose tweet text from claim.json metadata
 */
function composeTweet(slug, claim) {
  const title = claim.title || slug
  const description = claim.description || ''
  const tags = (claim.tags || [])
    .slice(0, 4)
    .map(t => `#${t.replace(/\s+/g, '')}`)
    .join(' ')
  const url = `${SITE_URL}/posts/${slug}`

  let tweet = `${title}\n\n${description}\n\n${tags}\n${url}`

  // X counts URLs as ~23 chars. Trim description if over 280.
  if (tweet.length > 280) {
    const available = 280 - title.length - tags.length - 23 - 8 // newlines + buffer
    const trimmed = description.slice(0, Math.max(0, available)) + '...'
    tweet = `${title}\n\n${trimmed}\n\n${tags}\n${url}`
  }

  return tweet
}

/**
 * Post a tweet via X API v2
 */
async function postTweet(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: oauthHeader('POST', API_URL),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`X API error ${response.status}: ${JSON.stringify(data)}`)
  }
  return data
}

// Process each new post
for (const slug of slugs) {
  const claimPath = `src/content/posts/${slug}/claim.json`
  let claim
  try {
    claim = JSON.parse(readFileSync(claimPath, 'utf8'))
  } catch {
    console.log(`Skipping ${slug} — claim.json not found`)
    continue
  }

  const tweet = composeTweet(slug, claim)
  console.log(`Tweeting for: ${slug}`)
  console.log(tweet)
  console.log('---')

  try {
    const result = await postTweet(tweet)
    console.log(`Posted: https://x.com/${X_HANDLE}/status/${result.data.id}`)
  } catch (err) {
    console.error(`Failed to tweet for ${slug}:`, err.message)
    // Don't fail the build if tweeting fails
  }
}
