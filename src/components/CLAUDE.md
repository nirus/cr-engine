# Components

All components are `.astro` files. No client-side framework — use `<script>` tags for interactivity.

## Content/

| Component | Props | Purpose |
|-----------|-------|---------|
| `Card.astro` | `post` (collection entry) | Post preview card — hero image (or YouTube thumb), title, date. Links to `/posts/{slug}` |
| `BlogPost.astro` | `title, pubDate, youtube, tags, author, legendImage` | Full post layout — header, hero, YouTube embed, content slot, metadata footer |
| `Paginator.astro` | `page` (Astro paginated result) | Prev/next pagination links |
| `SearchInput.astro` | — | Client-side Pagefind search with 300ms debounce, 15 result max |

## Head/

| Component | Props | Purpose |
|-----------|-------|---------|
| `BaseHead.astro` | `title, description, image?` | All `<head>` tags: meta, OG, Twitter, fonts (Poppins/Cutive Mono), GA, dark mode FOUC script |
| `HomeHead.astro` | `tagline, showLogo?, showHeading?` | Logo + heading section |
| `GoogleAnalytics.astro` | `gaTagId` | GA script tag |

## Footer/

| Component | Purpose |
|-----------|---------|
| `Footer.astro` | Copyright year + Social + ThemeToggle |
| `PostFooter.astro` | Author card (avatar, name, bio, GitHub link) |
| `Social.astro` | Twitter/GitHub/Email icons |

## Navigation/

| Component | Purpose |
|-----------|---------|
| `TopBar.astro` | Fixed nav with Home/Submit/Search links |
| `ThemeToggle.astro` | Floating button (bottom-right), toggles `.dark` class, persists to localStorage `theme-preference` |

## Preview/

| Component | Purpose |
|-----------|---------|
| `PreviewForm.astro` | GitHub URL input form |
| `PreviewContent.astro` | Renders fetched post or error via `@astropub/md` |

## Hero Image Resolution

`src/layouts/BlogHero.ts` uses `import.meta.glob('../content/posts/*/*.{jpg,png}')` to collect all post images at build time. `blogSlugToLegendImageData(slug)` returns the matching image metadata.
