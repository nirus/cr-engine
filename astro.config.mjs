import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import { codeRocksMiddleWare } from './plugin/crMiddleware.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), image()],
  site: 'https://coder.rocks',
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [codeRocksMiddleWare]
  }
});