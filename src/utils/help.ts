export const githubUserNameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

/**
 * Refer : https://stackoverflow.com/a/70568619/1848109
 * @param id youtube ID
 * @returns url
 */
export const youtubeImgPreview = (id: string) =>
  `http://i3.ytimg.com/vi/${id}/0.jpg`
