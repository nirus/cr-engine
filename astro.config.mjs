import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import { defineConfig, passthroughImageService } from 'astro/config'
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
  trailingSlash: 'never',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  site: 'https://coder.rocks',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
    rehypePlugins: [transformCustomTag],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
