export const Settings = {
    site: {
        title: 'CoderRocks',
        tagline: 'coding & hacking articles',
        gaUserAgent: ''
    },

    post: {
        contentWidth: "max-w-12xl",
        avatarSize: '100'
    },

    cr: {
        email: 'mailtto:support@coder.rocks',
        twitter: 'https://twitter.com/coder_rocks',
        github: 'https://github.com/nirus/coder-rocks'
    }

}

/**
 * Refer : https://stackoverflow.com/a/70568619/1848109
 * @param id youtube ID
 * @returns url
 */
export const youtubeImgPreview = (id: string) => `http://i3.ytimg.com/vi/${id}/0.jpg`