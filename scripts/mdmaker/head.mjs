/*TODO: get the PR author via github actions 
refer - https://github.com/orgs/community/discussions/25502
*/


//@credit : https://stackoverflow.com/a/63346501/1848109
function dontIndent(str) {
    return ('' + str).replace(/(\n)\s+/g, '$1');
}

export const template = function (claims, mdContents) {

    const { title, pubDate, slug, description, hero, tags, youtube, author } = claims;

    const head = `---
    title: "${title}"
    pubDate: "${pubDate}"
    slug: "${slug}"
    description: "${description}"
    hero: "${hero}"
    tags: [${tags.length ? tags.map((tag) => `"${tag}"`).join(',') : 'General'}]
    youtube: "${youtube}"
    layout: "../../../layouts/BlogPostLayout.astro"
    author: "${author}"
    ---    
    `;

    return dontIndent(head) + mdContents;
}