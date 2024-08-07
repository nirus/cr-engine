import { githubUserNameRegex } from '@utils/help'
import { author as mockAuthorResp } from './stubs/gitauthor'
import type { Props as AuthorProps } from '@component/Footer/PostFooter.astro'
// import fetch from 'node-fetch';

export async function fetchAuthor({
  author,
}: {
  author: string
}): Promise<AuthorProps | null> {
  const { GITHUB_TOKEN = null, PROD } = import.meta.env
  const isValid: boolean = githubUserNameRegex.test(author)
  let ghAuthor: AuthorProps | null = mockAuthorResp
  try {
    if (isValid && PROD) {
      const ghProfile = await fetch(`https://api.github.com/users/${author}`, {
        headers: {
          /* TODO: make this token a secret */
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      })

      ghAuthor = (await ghProfile.json()) as AuthorProps
    }
    return ghAuthor
  } catch (e) {
    console.log('Error occurred in GitHub author api: ', e)
    throw e
  }
}
