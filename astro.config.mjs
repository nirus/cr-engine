import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import { claimMiddleware } from './plugin/claimMiddleware.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), image()],
  site: 'https://coder.rocks',
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [claimMiddleware] // Adds the claim.json to the markdown files before parsing
  },

  vite: {
    resolve: {
      preserveSymlinks: true // Resolves the symlink files from 'astro-code-pub' folder properly
    }
  }
});