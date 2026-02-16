# Coder Rocks - cr-engine

Astro static site generator powering https://coder.rocks — a technical blogging platform.

## Stack

- **Framework**: Astro 5 (Content Layer API, Vite 6)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (utility-first, **never use `@apply`**)
- **Hosting**: Cloudflare Pages/Workers
- **Search**: Pagefind (static client-side indexing)
- **Testing**: Vitest
- **Package Manager**: Yarn

## Architecture

```
src/
├── content.config.ts          # Custom claim-json-loader (reads claim.json, not frontmatter)
├── content/posts/             # Post collection (cloned from external repo)
│   └── <slug>/
│       ├── claim.json         # Metadata: title, description, pubDate, tags, author, youtube
│       ├── index.md           # Markdown body (NO frontmatter)
│       └── hero.jpg           # Optional hero image
├── components/                # See src/components/CLAUDE.md
├── pages/                     # See src/pages/CLAUDE.md
├── utils/                     # See src/utils/CLAUDE.md
├── config/site.ts             # Central site settings (title, URLs, social, dimensions)
├── layouts/                   # BaseLayout.astro + BlogHero.ts (image glob helper)
├── restapi/fetchAuthor.ts     # GitHub API author fetch (mock in dev, live in prod)
└── styles/                    # global.css → content.css → code.css (dark mode via .dark class)
plugins/                       # See plugins/CLAUDE.md
scripts/cr-repo-connect/       # Content repo cloning with sparse checkout
```

## Content Data Flow

```
claim.json + index.md → claimJsonLoader → Astro Content Collection → Page Components
```

- `claimJsonLoader()` in `content.config.ts` reads `claim.json` for metadata (not markdown frontmatter)
- Entry IDs are `<slug>/index` — pages strip `/index` suffix to get the URL slug
- `deferredRender: true` — must call `store.addModuleImport(filePath)` after `store.set()`
- Schema: title, description, pubDate (coerced date), tags (default []), author (default 'nirus'), youtube?, lang (default 'en')

## Commands

```bash
yarn dev                    # Dev server
yarn build                  # Full: clean → link content → astro build → pagefind
yarn test                   # Vitest
yarn pub-code:link          # Clone content repo to src/content/posts/
yarn pub-code:clean         # Remove content directory
```

## TypeScript Path Aliases

`@utils/*`, `@config/*`, `@component/*`, `@layouts/*`, `@request/*` (restapi), `@pages/*`

## Conventions

- **Naming**: kebab-case files, camelCase vars, PascalCase components
- **Styling**: Tailwind utility classes only, mobile-first responsive (`sm:`, `md:`, `lg:`)
- **Dark mode**: `document.documentElement.classList` + localStorage `theme-preference`
- **Images**: Relative paths (`./image.png`), hero images auto-detected per post
- **Pagination**: 21 posts per page
- **SSR**: Only `/preview` route — everything else is static

## Troubleshooting

See `DEBUG.md` for CI/CD preview deployment and Cloudflare Pages debugging.

### Content Issues
```bash
yarn pub-code:clean && yarn pub-code:link   # Reset content
```

### Common CI Issues
- **Missing page routes**: `src/pages/posts/[slug].astro` and `[...page].astro` must be committed
- **`UnknownContentCollectionError`**: Custom loaders with `deferredRender: true` must call `store.addModuleImport(filePath)` after `store.set()`
- **Pagefind indexes 0 pages**: Verify `getCollection('posts')` returns entries and page routes exist
