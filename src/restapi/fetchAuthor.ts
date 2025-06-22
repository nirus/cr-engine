import type { Props as AuthorProps } from '@component/Footer/PostFooter.astro'
import { githubUserNameRegex } from '@utils/help'
import { author as mockAuthorResp } from './stubs/gitauthor'
// import fetch from 'node-fetch';

export async function fetchAuthor({
  author,
}: {
  author: string
}): Promise<AuthorProps | null> {
  const { GITHUB_TOKEN = null, PROD } = import.meta.env
  const isValid: boolean = githubUserNameRegex.test(author)
  try {
    let ghAuthor: AuthorProps | null = mockAuthorResp
    if (isValid && PROD) {
      const ghProfile = await fetch(`https://api.github.com/users/${author}`, {
        headers: {
          /* TODO: make this token a secret */
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      })

      ghAuthor = await ghProfile.json()
    }
    return ghAuthor
  } catch (e) {
    console.log('Error occurred in GitHub author api: ', e)
    throw e
  }
}
