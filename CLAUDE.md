# Coder Rocks - Cryogen Framework

Astro-based blog engine for https://coder.rocks with external content management and Cloudflare SSR deployment.

## Technology Stack

- **Framework**: Astro 5.12.0 with Cloudflare adapter
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.1.7 (no `@apply` directive - use utility classes only)
- **Deployment**: Cloudflare Pages with SSR and prerendering
- **Package Manager**: Yarn

## Project Structure

```
cr-engine/
├── src/
│   ├── components/           # Astro components
│   ├── config/site.ts        # Site configuration
│   ├── layouts/              # Page layouts
│   ├── pages/                # Routes
│   │   └── posts/            # External content (symlinked)
│   ├── restapi/              # API utilities
│   └── utils/                # Utility functions
├── plugins/                  # Custom Astro plugins
├── posts-page-wrapper/       # Posts wrapper system
└── wrangler.toml             # Cloudflare configuration
```

## Configuration

### TypeScript Paths
```json
{
  "@utils/*": "src/utils/*",
  "@config/*": "src/config/*", 
  "@component/*": "src/components/*",
  "@layouts/*": "src/layouts/*",
  "@request/*": "src/restapi/*",
  "@pages/*": "src/pages/*"
}
```

### Astro Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  // Individual pages use: export const prerender = true
});
```

### Cloudflare Configuration
```toml
# wrangler.toml
name = "coder-rocks"
pages_build_output_dir = "./dist"
compatibility_date = "2025-07-19"
compatibility_flags = ["nodejs_compat"]
```

## Content Management System

### External Repository Setup
Content stored in separate `coder-rocks` Git repository with symlink integration:

```bash
yarn run pub-code:link     # Clone and setup content repository
yarn run pub-code:clean    # Clean posts directory
yarn run pub-code:refresh  # Pull latest content updates
```

### Post Structure
```
src/pages/posts/[post-slug]/
├── index.md        # Markdown content
├── claim.json      # Metadata
└── hero.jpg        # Optional hero image
```

### Post Metadata (`claim.json`)
```json
{
  "title": "Post Title",
  "description": "SEO description", 
  "pubDate": "2020-06-06",
  "tags": ["javascript", "astro"],
  "author": "github-username"
}
```

## Development Commands

```bash
# Development
yarn run dev              # Local development server
yarn run preview:cf       # Cloudflare Pages local preview

# Build
yarn run build           # Full build process (includes content linking)
yarn run build:search    # Build search index

# Content Management  
yarn run pub-code:link   # Setup external content repository
yarn run prettier:write  # Format code
```

## Custom Plugins

- **ClaimJson**: Processes `claim.json` metadata files
- **PostsBundleProcess**: Handles post bundle processing
- **TransformCustomTags**: Transforms custom HTML tags in markdown

## Performance & Caching

### SSR Caching Strategy
```typescript
// Blog posts: 5min cache, 1hr edge cache
Astro.response.headers.set(
  'Cache-Control',
  'public, max-age=300, s-maxage=3600'
)
```

### User-Agent Handling
```typescript
// Required for GitHub API requests
const userAgent = Astro.request.headers.get('user-agent')
const authorDetails = await fetchAuthor({ author, userAgent })
```

### Prerendering
- All blog posts: `export const prerender = true`
- Dynamic routes: Static path generation
- Posts wrapper: 21 posts per page with pagination

## Development Guidelines

### Framework Requirements
- Always use latest Astro 5.x features
- Use Tailwind CSS v4 utility classes (never `@apply`)
- Follow TypeScript strict mode
- Leverage Cloudflare edge runtime when needed

### Tailwind Best Practices
- Mobile-first responsive design
- Use built-in color palette and spacing scale  
- Automatic class sorting with `prettier-plugin-tailwindcss`
- Primary color: `#12151E`, font: Poppins

### Component Structure
1. TypeScript interfaces for props
2. Props destructuring with defaults
3. Use `Astro.glob()` for content fetching
4. Scoped styles in `.astro` files

## Key Dependencies

- `@astrojs/cloudflare` - SSR adapter
- `@astrojs/rss` - RSS generation
- `@astrojs/sitemap` - Sitemap generation
- `wrangler` - Cloudflare CLI
- `dayjs` - Date formatting
- `gray-matter` - Frontmatter parsing

## Troubleshooting

### Content Issues
```bash
# Check symlink status
ls -la src/pages/posts/

# Recreate content setup
yarn run pub-code:clean && yarn run pub-code:link
```

### Common Problems
- **Symlink failures**: Check directory permissions
- **Build errors**: Verify sparse checkout configuration
- **Content missing**: Ensure external repository is cloned

## Important Notes

- Content managed via external Git repository with symlinks
- Images use relative paths: `./image.jpg`
- Search requires: `yarn run build:search`
- RSS feed auto-generated at `/rss.xml`
- Posts paginated: 21 per page