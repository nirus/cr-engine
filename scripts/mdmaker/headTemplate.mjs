
//@credit : https://stackoverflow.com/a/63346501/1848109
function dontIndent(str) {
    return ('' + str).replace(/(\n)\s+/g, '$1');
}

export const template = function (claims, mdContents) {

    const { title, pubDate, slug, description, hero, tags, youtube } = claims;

    const head = `---
    title: "${title}"
    pubDate: "${pubDate}"
    slug: "${slug}"
    description: "${description}"
    hero: "${hero}"
    tags: [${tags.map((tag) => `"${tag}"`).join(',')}]
    youtube: "${youtube}"
    layout: "../../../layouts/BlogPostLayout.astro"
    ---    
    `;

    return dontIndent(head) + mdContents;
}