# Pages (Routes)

All routes use file-based routing. Static pages are pre-rendered at build time.

## Routes

| File | Route | Rendering | Purpose |
|------|-------|-----------|---------|
| `index.astro` | `/` | Static | Homepage — 3 newest posts as cards |
| `posts/[...page].astro` | `/posts/`, `/posts/2` | Static | Paginated post list (21/page), `getStaticPaths` + `paginate()` |
| `posts/[slug].astro` | `/posts/<slug>` | Static | Individual post — `getCollection('posts')`, `render(post)`, author via GitHub API |
| `search.astro` | `/search` | Static | Pagefind client-side search (debounced 300ms, max 15 results) |
| `submit.astro` | `/submit` | Static | Submission guidelines |
| `preview.astro` | `/preview?url=...` | **SSR** | GitHub URL preview — fetches claim.json + index.md from raw.githubusercontent.com |
| `404.astro` | 404 | Static | Not found page |

## Post Slug Derivation

Content collection IDs are `<slug>/index`. Page routes strip the suffix:

```typescript
post.id.replace(/\/index$/, '') // "my-post/index" → "my-post"
```

## Data Fetching Pattern

```typescript
// [slug].astro
const posts = await getCollection('posts')
// getStaticPaths returns { params: { slug }, props: { post } } for each
const { Content } = await render(post)
const author = await fetchAuthor({ author: post.data.author })
```

## Pagefind Attributes

- Post pages: `data-pagefind-body` on main content (indexed)
- Homepage, search, submit: `data-pagefind-ignore="all"` on body (excluded)
