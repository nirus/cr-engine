export const template = function (claims) {
    const { title, pubDate, slug, description, hero, tags, youtube } = claims;

    return `
    ---
    title: "${title}"
    pubDate: "${pubDate}"
    slug: "${slug}"
    description: "${description}"
    hero: "${hero}"
    tags: [${tags.map((tag) => `"${tag}"`).join(',')}]
    youtube: "${youtube}"
    layout: "../../layouts/BlogPostLayout.astro"
    ---
    `;
}