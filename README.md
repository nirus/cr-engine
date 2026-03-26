<h1 align="center">cr-engine</h1>

<p align="center">
  <strong>Static site engine powering <a href="https://coder.rocks">coder.rocks</a></strong><br/>
  Built with Astro 5 &middot; Tailwind CSS v4 &middot; Cloudflare Pages
</p>

<p align="center">
  <a href="https://coder.rocks"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fcoder.rocks&label=coder.rocks"></a>
  <a href="https://github.com/nirus/cr-engine/actions"><img alt="CI" src="https://github.com/nirus/cr-engine/actions/workflows/pages-deployment.yaml/badge.svg"></a>
</p>

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) (Content Layer API, Vite 6) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (utility-first) |
| Search | [Pagefind](https://pagefind.app) (static client-side indexing) |
| Hosting | Cloudflare Pages |
| Testing | Vitest |
| Linting | ESLint + Prettier + commitlint (conventional commits) |

## Quick Start

```bash
yarn install
yarn pub-code:link    # clone content repo
yarn dev              # start dev server at localhost:4321
```

## Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Dev server with hot reload |
| `yarn build` | Full build: clean, clone content, astro build, pagefind index |
| `yarn test` | Run Vitest |
| `yarn lint` | ESLint check |
| `yarn lint:fix` | ESLint autofix |
| `yarn pub-code:link` | Clone content repo to `src/content/posts/` |
| `yarn pub-code:clean` | Remove cloned content |

## Architecture

```
src/
  content.config.ts       # Custom claim-json-loader
  content/posts/          # Content (cloned from coder-rocks repo)
  components/             # Astro components
  pages/                  # File-based routes
  utils/                  # Helpers, preview handler, theme
  config/site.ts          # Site settings
  styles/                 # Tailwind + custom CSS
plugins/
  CopyOgImages/           # Copies hero images to /og/ for social cards
  TransformCustomTags/    # Wraps markdown images in <figure>
scripts/
  cr-repo-connect/        # Content repo sparse checkout
  tweet-new-post.mjs      # Auto-tweet on new post deploy
```

## Content Pipeline

Content lives in a separate repo: [nirus/coder-rocks](https://github.com/nirus/coder-rocks).

```
coder-rocks (publish branch)
  --> repository_dispatch --> cr-engine CI
    --> build --> deploy --> tweet
```

Each post is a directory with `claim.json` (metadata), `index.md` (body), and `hero.jpg` (cover image). Push to `publish` and cr-engine handles the rest.

## Deploy Rules

| Commit type | CI | Deploy |
|-------------|-----|--------|
| `feat:` / `fix:` | Yes | Yes |
| `chore:` / `ci:` / `docs:` / `build(deps):` | Yes | Skipped |
| Content update (`repository_dispatch`) | Yes | Yes |

Cloudflare Pages free tier has limited daily deploys. `chore:` commits conserve the quota and are picked up on the next `feat:`/`fix:` deploy.

## Contributing

- PR titles must follow [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)
- Squash merge only
- All PRs must pass CI: lint, format check, tests, build
- See [CLAUDE.md](CLAUDE.md) for detailed conventions, security rules, and architecture docs

## License

MIT
