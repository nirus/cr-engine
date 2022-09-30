export const Settings = {
    site: {
        title: 'CoderRocks',
        tagline: 'Progress by coding',
        gaUserAgent: '',
        mainUrl: 'https://coder.rocks',
        secondUrl: 'https://CoderRocks.com'
    },

    post: {
        contentWidth: "max-w-12xl",
        avatarSize: '100'
    },

    indexPage: {
        card: {
            height: '192',
            width: '360'
        }
    },

    cr: {
        email: 'mailtto:support@coder.rocks',
        twitter: 'https://twitter.com/coder_rocks',
        github: 'https://github.com/nirus/coder-rocks'
    },

    legendImageSize: {
        width: 1024,
        height: 420,
        aspectRatio: 16 / 9,
    }

}

/**
 * Refer : https://stackoverflow.com/a/70568619/1848109
 * @param id youtube ID
 * @returns url
 */
export const youtubeImgPreview = (id: string) => `http://i3.ytimg.com/vi/${id}/0.jpg`