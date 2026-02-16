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
- Dark mode toggle (bottom-right floating button) persists across navigation
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
