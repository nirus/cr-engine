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

## Content Repo (`coder-rocks`)

The blog content lives in a separate repo: [`nirus/coder-rocks`](https://github.com/nirus/coder-rocks).

- **Default branch**: `publish`
- **Local path**: `/Volumes/aryabhata/workspace/coder-rocks`
- **Structure**: each post is a directory with `claim.json`, `index.md`, and optional `hero.jpg`/`hero.png`
- **Deploy trigger**: pushing to `publish` fires `.github/workflows/trigger-build.yaml`, which sends a `repository_dispatch` (`content-update`) to `cr-engine` using the `CR_ENGINE_TRIGGER_TOKEN` PAT
- **During build**: `scripts/cr-repo-connect/build.sh` clones `coder-rocks` into `src/content/posts/` via sparse checkout

### Adding a new post

1. Create a directory in `coder-rocks` with the post slug
2. Add `claim.json` (title, description, pubDate, tags, author), `index.md`, and `hero.jpg`
3. Push/merge to `publish` — cr-engine deploys automatically

## Deployment

- **Cloudflare Pages free tier has limited deployments per day.** Batch all related changes into a single PR and merge once — do not create separate PRs for each small change.
- Every push to `main` triggers CI (lint, format, test, build). **Deploy only runs for `feat:` and `fix:` commits.**
- **`chore:`, `build(deps):`, `ci:`, `docs:` commits skip deploy** — they still run the full CI pipeline but don't consume a Cloudflare deployment. Changes are picked up on the next `feat:`/`fix:` deploy.
- The content repo (`coder-rocks`) always triggers a deploy via `repository_dispatch`.
- **OG images**: `plugins/CopyOgImages/index.mjs` copies hero images to `dist/og/{slug}.{ext}` at build time for social card previews (Cloudflare blocks crawler access to Vite-hashed `/_astro/` paths).
- **Auto-tweet**: new blog posts are announced on @Coder_Rocks after deploy (`scripts/tweet-new-post.mjs`).

## Conventions

- **Naming**: kebab-case files, camelCase vars, PascalCase components
- **Styling**: Tailwind utility classes only, mobile-first responsive (`sm:`, `md:`, `lg:`)
- **Dark mode**: `document.documentElement.classList` + localStorage `theme-preference`
- **Images**: Relative paths (`./image.png`), hero images auto-detected per post
- **Pagination**: 21 posts per page
- **SSR**: Only `/preview` route — everything else is static

## PR Rules

- **One PR per logical change.** Batch related fixes into a single PR — Cloudflare free tier has limited daily deploys.
- **All PRs must pass CI** before merging: lint, format check, tests, build.
- **Squash merge only** to keep `main` history clean.
- **Delete branch after merge** (auto-enabled in repo settings).
- **Dependabot PRs** auto-merge when CI passes. Do not manually merge Dependabot PRs that have failing checks.
- **Never force-push to `main`.**
- **PR titles** follow conventional commits: `feat:`, `fix:`, `chore:`, `build:`, `docs:`.
- **PR descriptions** must include a `## Summary` and `## Test plan` section.

## Lint Rules

ESLint enforces these rules (pre-commit hook + CI):

- **`curly: 'error'`** — always use braces on `if`/`else`/`for`/`while`. Never write `if (x) return`.
- **`@typescript-eslint/consistent-type-assertions: never`** — do not use `as` type casts. Use type guards (`instanceof`, `in`, narrowing) instead. If unavoidable, add `eslint-disable-next-line` with a comment explaining why.
- **Lint-staged order**: ESLint runs first, then Prettier formats the result.

## Security

### Secrets — never commit these

| Secret | Where it lives | Purpose |
|--------|---------------|---------|
| `CLOUDFLARE_API_TOKEN` | GitHub repo secrets | Cloudflare Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub repo secrets | Cloudflare account |
| `GITHUB_TOKEN` | GitHub auto-provided | CI workflows |
| `GA_TAG_ID` | GitHub repo variables | Google Analytics |
| `SITE` | GitHub repo secrets | Site configuration |
| `CR_ENGINE_TRIGGER_TOKEN` | `coder-rocks` repo secrets | Cross-repo deploy dispatch |

### Rules

- **Never commit `.env`, `.dev.vars`, API keys, tokens, or credentials.** These are already in `.gitignore`.
- **Never log secrets** in CI output, console.log, or error messages.
- **Never put secrets in URL parameters** — they leak in server logs and referrer headers.
- **Never hardcode secrets in source code.** Use `import.meta.env` for environment variables.
- **Review CI workflow changes carefully** — `pages-deployment.yaml` has access to all deploy secrets.
- **PATs (Personal Access Tokens)** must be scoped to the minimum required permissions and stored as GitHub secrets, never in code.
- **Dependabot PRs** that modify `package.json`, `yarn.lock`, or CI workflows should be reviewed for supply chain risks before merging.
- **Third-party Actions** in workflows must be pinned to a specific version (e.g., `actions/checkout@v3`), not `@latest`.

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
