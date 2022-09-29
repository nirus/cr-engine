import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import { claimMiddleware } from './plugins/ClaimJson/index.mjs';
import { postsImagePathFixture } from './plugins/PostsImagePathFixture/index.mjs';
import PostsBundleProcess from './plugins/PostsBundleProcess/index.mjs';
import { transformCustomTag } from './plugins/TransformCustomTags/index.mjs';
import htmlMinifier from "astro-html-minifier";

const isProd = process.env.PROD;
// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), image(), PostsBundleProcess(), isProd ? () => { } : htmlMinifier()],
  site: 'https://coder.rocks',
  markdown: {
    extendDefaultPlugins: true,

    /**
     * - Adds 'claim.json' to markdown bundle process.
     * - fixes the path of image file referenced in markdown to absolute one.
     */
    remarkPlugins: [postsImagePathFixture, claimMiddleware],
    rehypePlugins: [transformCustomTag]
  },
  vite: {
    resolve: {
      preserveSymlinks: true // Resolves the symlink files from 'posts-astro-code' folder properly
    }
  }
});