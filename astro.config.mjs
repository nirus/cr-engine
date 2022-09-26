import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import { claimMiddleware } from './plugin/ClaimJson/index.mjs';
import { postImageFix } from './plugin/PostImageFix/index.mjs';
import buildImageFix from './plugin/BuildAssetFix/index.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), image(), buildImageFix()],
  site: 'https://coder.rocks',
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [postImageFix, claimMiddleware] // Adds the claim.json to the markdown files before parsing
  },

  vite: {
    resolve: {
      preserveSymlinks: true // Resolves the symlink files from 'astro-code-pub' folder properly
    }
  }
});