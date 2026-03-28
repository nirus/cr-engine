# Debugging via CI/CD Preview Deployment

## Deploy a Preview Build

Push your feature branch to a `demo/**` branch to trigger a Cloudflare Pages preview deployment:

```bash
git push origin feat/my-feature:demo/my-feature
```

## Monitor the CI Build

```bash
# Find the run ID
gh run list --branch demo/my-feature --limit 1

# Watch build progress in real time
gh run watch <run-id>

# Check if build succeeded
gh run view <run-id>
```

## Find the Deployment URL

```bash
# Extract the Cloudflare Pages deployment URL from CI logs
gh run view <run-id> --log 2>&1 | grep "Deployment complete"
```

Output looks like:
```
✨ Deployment complete! Take a peek over at https://<hash>.coder-rocks.pages.dev
```

The branch alias URL follows the pattern:
```
https://demo-my-feature.coder-rocks.pages.dev
```

## Verify in Chrome Browser

Navigate to the deployment URL and verify these pages:

| Page | What to check |
|------|---------------|
| `/` | Logo, 3-column card grid, post titles and dates from `claim.json` |
| `/posts/` | Paginated article list, responsive grid |
| `/posts/<slug>/` | Title, hero image, rendered markdown, code blocks, YouTube embed, author footer |
| `/search/` | Pagefind instant search, keyword highlighting |
| `/submit/` | Submission guidelines content |
| `/rss.xml` | RSS feed with all posts |
| `/sitemap-index.xml` | Sitemap generation |

Also verify:
- Dark mode is the default for new visitors (no localStorage)
- Light mode opt-in via floating icon (bottom-right) works and persists
- No FOUC (flash of unstyled content) on page load

## Cloudflare Access Authentication

Preview deployments on `*.coder-rocks.pages.dev` are behind Cloudflare Access. If the browser shows a Cloudflare Access login screen:

1. Ask the user to sign in to Cloudflare Access manually in the browser
2. Once authenticated, navigate to the deployment URL again
3. The session persists across pages on the same domain

**Do not attempt to bypass or automate the Cloudflare Access login.**

As a workaround for local testing without authentication, serve the build output locally:
```bash
npx wrangler pages dev dist --port 8787
# Then test at http://localhost:8787
```

## Debugging Build Failures

```bash
# Full build logs
gh run view <run-id> --log

# Check if post pages were generated
gh run view <run-id> --log 2>&1 | grep "prerender\|slug\|page\.astro"

# Check Pagefind indexing count
gh run view <run-id> --log 2>&1 | grep "pagefind\|Indexed"

# Check for content loader errors
gh run view <run-id> --log 2>&1 | grep "claim-json-loader\|UnknownContentCollectionError"
```

### Common CI Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| No post pages generated | `src/pages/posts/[slug].astro` or `[...page].astro` not committed | `git add src/pages/posts/` and commit |
| Pagefind indexes 0 pages | Post HTML not in `dist/` | Verify `getCollection('posts')` returns entries and page routes exist |
| `UnknownContentCollectionError` | `store.addModuleImport()` not called after `store.set()` | Custom loaders with `deferredRender: true` must call `store.addModuleImport(filePath)` explicitly — Astro's digest cache skips module registration on cache hits |
| Tests pass but build fails | Content not linked | CI runs `pub-code:link` — check the script clones content to `src/content/posts/` |

## Cleanup

```bash
git push origin --delete demo/my-feature
```

---

# Feature Preview on Cloudflare Before Merge

End-to-end process for previewing a feature branch on Cloudflare Pages before merging to `main`.

## How It Works

The CI workflow (`.github/workflows/pages-deployment.yaml`) triggers on pushes to `main` and `demo/**` branches. Pushing to a `demo/**` branch runs the full pipeline — lint, format, test, build, deploy — producing a preview URL on Cloudflare Pages without touching production.

### CI Pipeline Steps

```
Install → Lint → Format check → Test → Build → Deploy check → Deploy
```

- **Lint**: `yarn lint` (ESLint)
- **Format**: `yarn prettier --check` (Prettier, check-only — no writes)
- **Test**: `yarn test` (Vitest)
- **Build**: `yarn build` (clean → link content → astro build → pagefind)
- **Deploy check**: `feat:` and `fix:` commits deploy; `chore:`, `docs:`, `ci:`, `build(deps):` skip deploy but still run the full CI pipeline
- **Deploy**: `wrangler pages deploy dist` to Cloudflare Pages

## Step-by-Step

### 1. Create a feature branch and commit

```bash
git checkout -b feat/dark-theme-default
# ... make changes ...
git add <files>
git commit -m "feat: make dark theme default"
```

### 2. Push to a demo branch

This triggers the CI workflow and Cloudflare deploy:

```bash
git push origin feat/dark-theme-default:demo/dark-theme-default
```

The `demo/` prefix is what triggers the workflow — your local branch name doesn't matter.

### 3. Monitor the CI run

```bash
# Find the run
gh run list --branch demo/dark-theme-default --limit 1

# Watch it live
gh run watch <run-id>
```

### 4. Get the preview URL

```bash
gh run view <run-id> --log 2>&1 | grep "Deployment complete"
```

Two URLs are available:
- **Hash URL**: `https://<hash>.coder-rocks.pages.dev` (unique per deploy)
- **Branch alias**: `https://demo-dark-theme-default.coder-rocks.pages.dev` (updates on each push)

### 5. Test the preview

Open the preview URL in a browser. Preview deployments are behind **Cloudflare Access** — sign in when prompted.

**If Cloudflare Access blocks you**, test locally instead:

```bash
# Build locally with the same pipeline as CI
yarn build

# Serve with Cloudflare Workers runtime
yarn preview:cf
# Open http://localhost:8787
```

### 6. Iterate

Push more commits to your feature branch, then update the demo branch:

```bash
# After committing more changes on your feature branch
git push origin feat/dark-theme-default:demo/dark-theme-default
```

Each push triggers a fresh CI run and updates the branch alias URL.

### 7. Create the PR

Once the preview looks good:

```bash
# Push the feature branch itself
git push origin feat/dark-theme-default

# Create the PR
gh pr create --title "feat: make dark theme default" --body "..."
```

PR title must follow conventional commits (`feat:`, `fix:`, etc.). CI runs again on the PR branch — all checks must pass before merge.

### 8. Clean up the demo branch

```bash
git push origin --delete demo/dark-theme-default
```

## Deploy Behavior Reference

| Commit prefix | CI runs? | Deploys to Cloudflare? |
|---------------|----------|------------------------|
| `feat:` | Yes | Yes |
| `fix:` | Yes | Yes |
| `chore:` | Yes | No (skipped) |
| `docs:` | Yes | No (skipped) |
| `ci:` | Yes | No (skipped) |
| `build(deps):` | Yes | No (skipped) |
| `repository_dispatch` | Yes | Yes (always) |

**Important**: Cloudflare Pages free tier has limited daily deploys. Batch related changes into a single commit/push rather than pushing repeatedly.

## Troubleshooting Preview Deploys

| Problem | Cause | Fix |
|---------|-------|-----|
| CI passes but no deploy | Commit message starts with `chore:`, `docs:`, etc. | Use `feat:` or `fix:` prefix |
| Preview URL shows old version | Browser cache | Hard-reload (`Cmd+Shift+R`) or use incognito |
| Cloudflare Access blocks you | Preview domains require auth | Sign in, or use `yarn build && yarn preview:cf` locally |
| Deploy step skipped in logs | `should-deploy` check returned false | Check commit message — only `feat:`/`fix:` trigger deploy |
| Branch alias URL 404 | Branch name has special chars | Keep demo branch names to `[a-z0-9-]` |

---

# Local Development & Testing

Quick reference for running, testing, and iterating locally using `package.json` scripts.

## 1. Setup Content

Blog content lives in a separate repo and must be linked before the site works:

```bash
# Clone content into src/content/posts/ (sparse checkout)
yarn pub-code:link

# If content gets stale, reset it
yarn pub-code:clean && yarn pub-code:link

# Pull latest content without re-cloning
yarn pub-code:refresh
```

## 2. Dev Server

```bash
yarn dev          # Starts Astro dev server (http://localhost:4321)
```

- Hot-reloads on file changes (components, styles, layouts, pages)
- Content changes (claim.json, index.md) also trigger reload
- Dev server uses mock author data (no GitHub API calls)

## 3. Run Tests

```bash
yarn test          # Single run (Vitest)
yarn test:watch    # Re-runs on file changes
yarn test:ui       # Browser-based test dashboard
```

Tests are co-located with source files (`*.test.ts`). Key test suites:

| File | What it covers |
|------|----------------|
| `src/utils/theme.test.ts` | Theme toggle, localStorage, default preference |
| `src/utils/help.test.ts` | GitHub username regex, YouTube URL helper |
| `src/utils/preview/validation.test.ts` | URL allowlist, slug sanitization |
| `src/restapi/fetchAuthor.test.ts` | Author API fetch, regex guard |
| `src/content.config.test.ts` | claim.json loader, schema validation |

## 4. Lint & Format

```bash
yarn lint          # Check for ESLint errors
yarn lint:fix      # Auto-fix ESLint errors
yarn prettier:write  # Format all source files
```

Lint-staged runs automatically on `git commit` (ESLint first, then Prettier).

## 5. Full Production Build

```bash
yarn build         # clean → link content → astro build → pagefind index
```

This runs the complete pipeline:
1. `pub-code:clean` — removes `src/content/posts/`
2. `pub-code:link` — clones fresh content
3. `astro:build` — generates static site in `dist/`
4. `pagefind --site dist` — builds search index

## 6. Preview the Production Build

```bash
yarn preview       # Astro's built-in preview (http://localhost:4321)
yarn preview:cf    # Wrangler Pages dev server (http://localhost:8787)
```

Use `preview:cf` to test with Cloudflare Workers runtime (closer to production).

## 7. Testing Theme Changes

After modifying dark/light mode behavior:

1. **Run unit tests** — `yarn test` (covers `theme.ts` logic)
2. **Start dev server** — `yarn dev`
3. **Check in browser:**

| What to verify | How |
|----------------|-----|
| Default theme is dark | Open `http://localhost:4321` in a private/incognito window (no localStorage) |
| Light mode opt-in | Click the floating sun icon (bottom-right) — page should switch to light |
| Preference persists | Reload the page — should stay on whichever theme you chose |
| No FOUC | Hard-reload (`Cmd+Shift+R`) — no white flash before dark theme applies |
| Icon state | Dark mode shows sun icon, light mode shows moon icon |

4. **Clear stored preference** to re-test default:
   - Open DevTools → Application → Local Storage → delete `theme-preference`
   - Reload — should default back to dark

## 8. Common Workflow: Change → Test → Verify

```bash
# 1. Make your code changes

# 2. Run tests
yarn test

# 3. Check lint
yarn lint

# 4. Start dev server and verify in browser
yarn dev

# 5. (Optional) Full build + preview to catch SSG issues
yarn build && yarn preview:cf
```
