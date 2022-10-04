
import { githubUserNameRegex } from "@utils/help";
import { author as mockAuthorResp } from "./__mocks__/gitauthor";
import type { Props as AuthorProps } from '@component/Footer/PostFooter.astro';
// import fetch from 'node-fetch';

export async function fetchAuthor({ author }: { author: string; }): Promise<AuthorProps | null> {
    const { GITHUB_API_KEY = null, PROD } = import.meta.env;
    const isValid: boolean = githubUserNameRegex.test(author);
    let ghAuthor: AuthorProps | null = mockAuthorResp;
    try {
        if (isValid && PROD) {
            const ghProfile = await fetch(`https://api.github.com/users/${author}`, {
                headers: {
                    /* TODO: make this token a secret */
                    Authorization: `token ${GITHUB_API_KEY}`,
                },
            });

            ghAuthor = await ghProfile.json() as AuthorProps;
        }
        return ghAuthor;
    } catch (e) {
        console.log("Error occurred in GitHub author api: ", e);
        throw e;
    }
}