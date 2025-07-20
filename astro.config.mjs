import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import markdownIntegration from '@astropub/md'
import { defineConfig, passthroughImageService } from 'astro/config'
import { claimMiddleware } from './plugins/ClaimJson/index.mjs'
import PostsBundleProcess from './plugins/PostsBundleProcess/index.mjs'
import { transformCustomTag } from './plugins/TransformCustomTags/index.mjs'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  image: {
    service: passthroughImageService(),
  },
  integrations: [sitemap(), PostsBundleProcess(), markdownIntegration()],
  site: 'https://coder.rocks',
  markdown: {
    syntaxHighlight: false,
    /**
     * - Adds 'claim.json' to markdown bundle process.
     * - fixes the path of image file referenced in markdown to absolute one.
     */
    remarkPlugins: [claimMiddleware],
    rehypePlugins: [transformCustomTag],
  },
  vite: {
    resolve: {
      preserveSymlinks: true, // Resolves the symlink files from 'posts-page-wrapper' folder properly
    },

    plugins: [tailwindcss()],
  },
})
