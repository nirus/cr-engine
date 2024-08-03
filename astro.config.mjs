import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import { claimMiddleware } from './plugins/ClaimJson/index.mjs';
import PostsBundleProcess from './plugins/PostsBundleProcess/index.mjs';
import { transformCustomTag } from './plugins/TransformCustomTags/index.mjs';

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  integrations: [sitemap(), PostsBundleProcess()],
  site: 'https://coder.rocks',
  markdown: {
    extendDefaultPlugins: true,
    shikiConfig: {
      wrap: null,
    },
    /**
     * - Adds 'claim.json' to markdown bundle process.
     * - fixes the path of image file referenced in markdown to absolute one.
     */
    remarkPlugins: [claimMiddleware],
    rehypePlugins: [transformCustomTag]
  },
  vite: {
    resolve: {
      preserveSymlinks: true // Resolves the symlink files from 'posts-astro-code' folder properly
    }
  }
});