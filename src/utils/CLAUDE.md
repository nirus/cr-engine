# Utilities

## help.ts

- `githubUserNameRegex` — validates GitHub usernames (alphanumeric + hyphens, max 39 chars)
- `youtubeImgPreview(id)` — returns YouTube thumbnail URL

## theme.ts

Dark mode management for client-side `<script>` tags:
- `getStoredTheme()` / `setStoredTheme()` — localStorage key: `theme-preference`, default: `'light'`
- `toggleTheme(current)` — light ↔ dark
- `applyTheme(pref)` — adds/removes `dark` class on `document.documentElement`

FOUC prevention: inline script in `BaseHead.astro` applies theme before first paint.

## preview/

GitHub preview URL processing (used by SSR `/preview` route):

| File | Purpose |
|------|---------|
| `previewHandler.ts` | Orchestrator: `processPreviewUrl()` → validates URL, fetches claim.json + index.md + author + hero |
| `validation.ts` | `validateGitHubUrl()` against allowlist, `sanitizeSlug()`, `sanitizeAuthor()` |
| `githubApi.ts` | Raw GitHub API fetch: `fetchPostClaim()`, `fetchPostMarkdown()`, `fetchHeroImage()` |

## restapi/fetchAuthor.ts

```typescript
fetchAuthor({ author, userAgent }) → Promise<AuthorProps | null>
```

- Production: `GET https://api.github.com/users/{author}` (requires `GITHUB_TOKEN`)
- Development: Returns mock data
- Validates username with `githubUserNameRegex` before API call

## Tests

All test files are co-located: `*.test.ts` next to source. Framework: Vitest.
- `help.test.ts` — regex rules, YouTube URL generation
- `theme.test.ts` — localStorage mock, toggle/apply logic
- `fetchAuthor.test.ts` — regex guard, URL construction
- `preview/validation.test.ts` — URL allowlist, slug sanitization
