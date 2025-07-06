# Posts Page Wrapper System Documentation

## Overview

The Posts Page Wrapper System is a sophisticated content management architecture that separates blog content from the main application codebase. It uses a separate Git repository for content management and employs symlinks to integrate content seamlessly into the Astro-based website.

## Architecture

### Core Components

1. **Content Repository**: `src/pages/posts/` - A separate Git repository containing markdown files and metadata
2. **Wrapper Component**: `src/posts-page-wrapper/[...page].astro` - The main wrapper that renders posts with proper SEO and layout
3. **Symlink System**: Automatically creates symlinks between wrapper and content directories
4. **Build Scripts**: Automated scripts for repository management and symlink creation

## Directory Structure

```
src/
├── posts-page-wrapper/
│   └── [...page].astro          # Main wrapper component
├── pages/
│   └── posts/                   # Content repository (separate Git repo)
│       ├── .git/                # Git metadata
│       ├── [...page].astro      # Symlink to wrapper
│       └── [post-slug]/         # Individual post directories
│           ├── index.md         # Post content
│           ├── claim.json       # Post metadata
│           └── hero.jpg         # Post image
```

## Content Repository Structure

Each post in the content repository follows this structure:

```
[post-slug]/
├── index.md                     # Main post content (Markdown)
├── claim.json                   # Post metadata (JSON)
└── hero.jpg                     # Post hero image (optional)
```

### Post Metadata Format (`claim.json`)

```json
{
    "title": "Post Title",
    "pubDate": "2020-06-06",
    "description": "Post description for SEO",
    "tags": ["javascript", "astro"],
    "author": "author-name"
}
```

### Post Content Format (`index.md`)

Posts are written in standard Markdown format with frontmatter:

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

## Wrapper Component (`[...page].astro`)

### Key Features

1. **Dynamic Route Generation**: Uses Astro's `getStaticPaths` to generate pages for all posts
2. **Pagination**: Implements pagination with 21 posts per page
3. **SEO Optimization**: Provides proper meta tags and structured data
4. **Responsive Layout**: Grid-based layout that adapts to different screen sizes

### Static Path Generation

```typescript
export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
  // Import all markdown files from posts directory
  const allPosts = import.meta.glob<MarkdownFrontmatter>('./**/*.md')
  
  // Extract and sort posts by publication date
  const extractedPosts = await Promise.all(
    Object.values(allPosts).map(async (value) => {
      const post = await value()
      return post
    }),
  )

  const sortedPosts = extractedPosts.sort(
    (a, b) =>
      new Date(b.frontmatter.pubDate).valueOf() -
      new Date(a.frontmatter.pubDate).valueOf(),
  )

  // Paginate posts (21 per page)
  const sorted = paginate(sortedPosts, {
    pageSize: 21,
  })

  return sorted
}
```

### Rendering Logic

The wrapper renders posts using the `Card` component in a responsive grid:

```astro
<section class="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
  {
    page.data.map((p: CardProps['post']) => (
      <div class="col-span-1">
        <Card post={p} />
      </div>
    ))
  }
</section>
```

## Symlink System

### Automatic Symlink Creation

The system uses a Node.js script (`scripts/symlink-repo/index.js`) to create symlinks:

```javascript
const files = ['[...page].astro']

for (const file of files) {
  if (!existsSync(resolve(`../../src/pages/posts/${file}`))) {
    symlinkSync(
      resolve(`../../src/posts-page-wrapper/${file}`),
      resolve(`../../src/pages/posts/${file}`),
    )
    console.log(`Symlinked: ${file}`)
  }
}
```

### Repository Management Scripts

#### Build Script (`scripts/cr-repo-connect/build.sh`)

```bash
#!/bin/bash

# Clone the content repository
git clone --no-checkout https://github.com/nirus/coder-rocks.git src/pages/posts

# Configure sparse checkout
git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts sparse-checkout init --cone

# Set up sparse checkout patterns
echo "/* \n!README.md" >> src/pages/posts/.git/info/sparse-checkout

# Checkout specific branch (default: publish)
if [[ -n "$branch" ]]; then
    git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts checkout $branch
else
    git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts checkout publish
fi
```

## Automation with Husky

### Post-Checkout Hook (`.husky/post-checkout`)

```bash
#!/bin/sh

# Check if posts directory exists
if [[ ! -d "src/pages/posts" ]]; then
  npm run pub-code:link
else
  # Check if posts directory is empty
  if [ $(find "src/pages/posts" -maxdepth 1 -type d ! -name "posts" ! -name ".git" | wc -l) -eq 0 ]; then
    echo "No posts found in 'src/pages/posts' >> Refreshing..."
    npm run pub-code:head
  fi
fi

# Start symlink script
npm run start --prefix scripts/symlink-repo
```

## NPM Scripts

### Content Management Scripts

```json
{
  "pub-code:link": "sh scripts/cr-repo-connect/build.sh && npm run start --prefix scripts/symlink-repo",
  "pub-code:clean": "npm run rmdir --silent -- src/pages/posts",
  "pub-code:head": "git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts reset --hard origin/publish",
  "pub-code:refresh": "git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts pull"
}
```

## Type Definitions

### MarkdownFrontmatter Interface

```typescript
export interface MarkdownFrontmatter {
  pubDate: Date
  url: string
  frontmatter: BlogPostProps
  file: string
}
```

### BlogPostProps Interface

```typescript
export interface Props {
  title: string
  pubDate: string
  youtube?: string
  author: AuthorProps | null
  tags: string[]
  slug?: string
  legendImage?: Promise<{ default: ImageMetadata }>
}
```

## Workflow

### Development Workflow

1. **Content Creation**: Authors create posts in the separate content repository
2. **Repository Sync**: Content is pulled into `src/pages/posts/` via build scripts
3. **Symlink Creation**: Wrapper files are symlinked to the posts directory
4. **Build Process**: Astro builds static pages from the content

### Deployment Workflow

1. **Content Updates**: Content repository is updated independently
2. **Build Trigger**: Main application build process pulls latest content
3. **Static Generation**: Astro generates static pages with latest content
4. **Deployment**: Static files are deployed to hosting platform

## Benefits

### Separation of Concerns

- **Content Management**: Independent Git repository for content
- **Application Logic**: Main codebase focuses on application features
- **Deployment**: Content can be updated without redeploying the entire application

### Scalability

- **Content Scaling**: Unlimited posts without affecting application performance
- **Team Collaboration**: Content team can work independently
- **Version Control**: Content has its own version history

### Performance

- **Static Generation**: All pages are pre-built at build time
- **CDN Friendly**: Static files can be served from CDN
- **SEO Optimized**: Proper meta tags and structured data

## Configuration

### Site Settings (`src/config/site.ts`)

```typescript
export const Settings = {
  site: {
    title: 'CoderRocks',
    tagline: 'Code Meets Creativity',
    mainUrl: 'https://coder.rocks',
    description: 'Coder Rocks is a blog site to share coding knowledge...',
  },
  post: {
    contentWidth: 'max-w-12xl',
    avatarSize: '100',
  },
  indexPage: {
    card: {
      height: 192,
      width: 360,
    },
  },
}
```

## Troubleshooting

### Common Issues

1. **Symlink Creation Fails**
   - Ensure proper permissions on the posts directory
   - Check if symlink already exists

2. **Content Not Loading**
   - Verify content repository is properly cloned
   - Check sparse checkout configuration

3. **Build Errors**
   - Ensure all required dependencies are installed
   - Check TypeScript type definitions

### Debug Commands

```bash
# Check symlink status
ls -la src/pages/posts/

# Verify content repository
git --git-dir=src/pages/posts/.git --work-tree=src/pages/posts status

# Recreate symlinks
npm run pub-code:link

# Clean and rebuild
npm run pub-code:clean && npm run pub-code:link
```

## Future Enhancements

### Planned Features

1. **Content Preview**: Real-time preview of content changes
2. **Multi-language Support**: Support for multiple content repositories
3. **Advanced Search**: Enhanced search functionality with filters
4. **Content Analytics**: Track content performance and engagement

### Technical Improvements

1. **Incremental Builds**: Only rebuild changed content
2. **Content Validation**: Automated validation of post metadata
3. **Image Optimization**: Automatic image optimization and resizing
4. **Caching Strategy**: Implement intelligent caching for better performance

## Contributing

### Adding New Posts

1. Create a new directory in the content repository
2. Add `index.md` with post content
3. Add `claim.json` with post metadata
4. Add hero image (optional)
5. Commit and push to the content repository

### Modifying the Wrapper

1. Edit `src/posts-page-wrapper/[...page].astro`
2. Test changes locally
3. Ensure symlinks are properly updated
4. Deploy changes

## Security Considerations

1. **Content Validation**: Validate all incoming content for security
2. **Access Control**: Restrict access to content repository
3. **Dependency Management**: Keep dependencies updated
4. **Environment Variables**: Secure sensitive configuration

## Performance Optimization

1. **Image Optimization**: Use WebP format and proper sizing
2. **Code Splitting**: Implement lazy loading for components
3. **Caching**: Implement proper cache headers
4. **CDN**: Use CDN for static assets

This documentation provides a comprehensive overview of the Posts Page Wrapper System, covering its architecture, implementation details, and best practices for maintenance and enhancement. 