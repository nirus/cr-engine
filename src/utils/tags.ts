export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, '-')
}

export function extractTagMap(
  posts: { frontmatter: { tags?: string[] } }[],
): Map<string, string> {
  const tagMap = new Map<string, string>()

  for (const post of posts) {
    const tags = post.frontmatter.tags
    if (!tags) continue
    for (const tag of tags) {
      const slug = normalizeTag(tag)
      if (!tagMap.has(slug)) {
        tagMap.set(slug, tag)
      }
    }
  }

  return tagMap
}
