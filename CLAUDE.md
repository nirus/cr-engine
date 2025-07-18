# Coder Rocks - Cryogen Framework

A modern blog engine built with Astro, TypeScript, and Tailwind CSS that powers https://coder.rocks - a platform for sharing coding knowledge, ideas, and learning through articles.

## Project Overview

Astro-based static site generator for technical blogging with automated post processing, search functionality, and custom plugin system for content management.

## Technology Stack

- **Framework**: Astro 5.12.0 (Latest stable version - always use latest Astro framework features)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.1.7 with custom configuration (Latest version - always use latest Tailwind CSS features)
- **Build Tool**: Vite 6 with custom plugins
- **Package Manager**: Yarn
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Key Features

### Content Management
- **Posts Page Wrapper System**: Separate Git repository for content management
- **External Content Repository**: Content stored in `coder-rocks` repository
- **Automatic Post Processing**: Custom plugins handle markdown and metadata
- **Hero Images**: Automatic `hero.jpg` or `hero.png` detection
- **YouTube Integration**: Built-in YouTube video embedding
- **Search Functionality**: Full-text search with indexed content
- **RSS Feed**: Automated RSS generation at `/rss.xml`
- **Symlink System**: Automatic symlink creation for content integration

### Development Features
- **TypeScript Path Aliases**: Configured shortcuts for cleaner imports
- **Hot Reload**: Development server with live updates
- **Image Optimization**: Astro's built-in image processing
- **Sitemap Generation**: SEO-friendly sitemap generation
- **Pagination**: 21 posts per page with automatic pagination

## Project Structure

```
cr-engine/
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Content/         # Blog content components
│   │   ├── Footer/          # Footer components
│   │   ├── Head/            # HTML head components
│   │   ├── Navigation/      # Navigation components
│   │   ├── Shared/          # Shared components
│   │   └── VectorIcons/     # SVG icon components
│   ├── config/              # Site configuration
│   ├── layouts/             # Page layouts
│   ├── pages/               # Astro pages (routes)
│   │   └── posts/           # Blog posts (auto-generated)
│   ├── restapi/             # API utilities
│   ├── styles/              # Global CSS files
│   └── utils/               # Utility functions
├── plugins/                 # Custom Astro plugins
├── scripts/                 # Build and utility scripts
├── public/                  # Static assets
└── posts-page-wrapper/      # Posts page wrapper system
    └── [...page].astro      # Dynamic route wrapper component
```

## Configuration

### TypeScript Paths
- `@utils/*` → `src/utils/*`
- `@config/*` → `src/config/*`
- `@component/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@request/*` → `src/restapi/*`
- `@pages/*` → `src/pages/*`

### Site Configuration
`src/config/site.ts` - Site title, tagline, URLs, social media links, image dimensions, and content width settings

## Custom Plugins

### ClaimJson Plugin (`plugins/ClaimJson/index.mjs`)
- Processes `claim.json` files in post directories
- Adds metadata to frontmatter
- Handles slug generation and layout assignment

### PostsBundleProcess Plugin (`plugins/PostsBundleProcess/index.mjs`)
- Processes post bundles during build
- Handles image path resolution

### TransformCustomTags Plugin (`plugins/TransformCustomTags/index.mjs`)
- Transforms custom HTML tags in markdown
- Includes rehype figure processing

## Scripts and Commands

### Development
```bash
yarn run dev          # Start development server (preferred)
yarn run start        # Alias for dev
```

### Build
```bash
yarn run build        # Full build process
yarn run astro:build  # Astro build only
yarn run build:search # Build search index
yarn run preview      # Preview production builds
```

### Code Quality
```bash
yarn run prettier:write  # Format code with Prettier
```

### Content Management
```bash
yarn run pub-code:link    # Link external content repository and create symlinks
yarn run pub-code:clean   # Clean posts directory
yarn run pub-code:head    # Reset to latest published content (hard reset)
yarn run pub-code:refresh # Pull latest content updates from remote
```

## Posts Page Wrapper System

### Architecture Overview
Content management system that separates blog content from main application codebase:

- **External Content Repository**: Content stored in separate `coder-rocks` Git repository
- **Symlink Integration**: Automatic symlink creation between wrapper and content directories
- **Dynamic Route Generation**: Uses `[...page].astro` for static path generation
- **Pagination**: 21 posts per page
- **Sparse Checkout**: Only pulls necessary content files, excluding README.md

### Content Repository Structure
```
src/pages/posts/                 # Content repository (separate Git repo)
├── .git/                        # Git metadata
├── [...page].astro              # Symlink to wrapper component
└── [post-slug]/                 # Individual post directories
    ├── index.md                 # Post content (Markdown)
    ├── claim.json               # Post metadata (JSON)
    └── hero.jpg                 # Post hero image (optional)
```

### Post Requirements
- Each post must be in its own directory under `src/pages/posts/`
- Must contain `index.md` with frontmatter
- Must include `claim.json` with metadata
- Optional `hero.jpg` or `hero.png` for thumbnail

### Post Metadata Format (`claim.json`)
```json
{
  "title": "Post Title",
  "description": "Post description for SEO",
  "pubDate": "2020-06-06",
  "tags": ["javascript", "astro"],
  "author": "author-name"
}
```

### Post Content Format (`index.md`)
```markdown
---
title: "Post Title"
pubDate: "2020-06-06"
description: "Post description"
tags: ["javascript", "astro"]
author: "author-name"
---

# Post Content

Your markdown content here...
```

### Wrapper Component Features
- Dynamic route generation with `getStaticPaths`
- Posts sorted by publication date (newest first)
- SEO optimization with proper meta tags and structured data
- Responsive grid layout (1/2/3 columns)
- Card component with hero image presentation

## Styling

### Tailwind Configuration
- Uses Tailwind CSS v4 with `@tailwindcss/vite`
- Configuration in `tailwind.config.js` and `postcss.config.cjs`
- Custom color palette with `#12151E` as primary black
- Extended spacing scale up to 140 (36rem)
- Poppins font family for display and body text
- Prettier plugin for automatic class sorting: `prettier-plugin-tailwindcss`

### Tailwind Best Practices
- **NEVER use the `@apply` directive** - use utility classes directly
- **Always use the latest Tailwind CSS v4 features** - Modern CSS-first approach with native cascade layers
- Use mobile-first responsive design with `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes
- Leverage Tailwind's built-in color palette and spacing scale
- Use semantic class names and avoid arbitrary values when possible
- Follow Tailwind CSS v4 migration patterns and new syntax when applicable

### CSS Architecture
- `src/styles/global.css` - Global styles
- `src/styles/main.css` - Main layout styles
- `src/styles/content.css` - Content-specific styles
- `src/styles/code.css` - Code block styling
- Component-specific styles in `.astro` files

## Development Workflow

### Framework and Styling Requirements
- **ALWAYS use the latest stable Astro framework version** - Currently 5.12.0 with Astro Content Layer API and Vite 6 support
- **ALWAYS use the latest Tailwind CSS version** - Currently 4.1.7 with modern CSS features
- **Keep dependencies current** - Run `npx @astrojs/upgrade` regularly to stay updated
- **Follow Astro 5.x best practices** - Use Content Layer API, Server Islands, and modern routing patterns
- **Leverage Vite 6 features** - Utilize the new Environment API and improved build performance

### Component Development Guidelines
1. **Imports** - Import required modules and components
2. **Props Interface** - Define TypeScript interfaces for component props
3. **Props Destructuring** - Destructure props with defaults
4. **Data Fetching** - Use `Astro.glob()` for markdown files or Content Layer API for modern content management
5. **Template** - HTML template with component logic
6. **Scoped Styles** - Component-specific styling

### Performance Optimization
- Minimize client-side JavaScript; leverage static generation
- Use `client:*` directives judiciously:
  - `client:load` - immediately needed interactivity
  - `client:idle` - non-critical interactivity
  - `client:visible` - hydrate when visible
  - `client:media` - responsive hydration
  - `client:only` - framework-specific components
- Implement proper lazy loading for images and assets
- Monitor Core Web Vitals (LCP, FID, CLS)

### Code Quality Standards
- Use TypeScript with strict mode for all `.ts` and `.tsx` files
- Define proper interfaces and types for component props
- Avoid `any` types; use proper type annotations
- Follow naming conventions:
  - kebab-case for file names and URLs
  - camelCase for JavaScript/TypeScript variables and functions
  - PascalCase for component names and classes
- Add JSDoc comments for complex functions

### Git Integration
- Husky pre-commit hooks with lint-staged
- Prettier configuration for consistent code style
- Use meaningful commit messages
- Create feature branches for new development

### Build Process
1. Clean previous builds
2. Link external content repository (clone and setup sparse checkout)
3. Create symlinks between wrapper and content directories
4. Generate search index
5. Build Astro site with dynamic route generation
6. Generate sitemap and RSS feed



## Testing Commands

- `yarn run build` - Verify build succeeds
- `yarn run prettier:write` - Ensure code formatting
- `npx @astrojs/upgrade` - Keep Astro framework and integrations current
- Manual testing of development server with `yarn run dev`

## Accessibility and SEO

### Accessibility Guidelines
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation support
- Maintain proper color contrast ratios
- Use focus utilities for proper focus indicators

### SEO Best Practices
- Implement proper meta tags and structured data
- Use canonical URLs and proper redirects
- Optimize for Core Web Vitals
- Generate sitemap automatically via `@astrojs/sitemap`
- Use RSS feed generation for content syndication

## Important Notes

- Images in markdown should use relative paths with `./`
- Hero images are automatically detected and processed
- Search functionality requires running `yarn run build:search`
- Content is managed through external repository linking with symlinks
- Posts are paginated with 21 posts per page
- Content repository uses sparse checkout to exclude README.md files

## Troubleshooting

### Content Management Issues
```bash
# Check symlink status
ls -la src/pages/posts/

# Verify content repository status
git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts status

# Recreate symlinks
yarn run pub-code:link

# Clean and rebuild content
yarn run pub-code:clean && yarn run pub-code:link
```

### Common Problems
1. **Symlink Creation Fails**: Ensure proper permissions on posts directory
2. **Content Not Loading**: Verify content repository is properly cloned
3. **Build Errors**: Check sparse checkout configuration and dependencies

## Key Dependencies

- `@astrojs/rss` - RSS feed generation
- `@astrojs/sitemap` - Sitemap generation
- `@astropub/md` - Enhanced markdown processing
- `dayjs` - Date formatting
- `gray-matter` - Frontmatter parsing