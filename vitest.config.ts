import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'plugins/**/*.test.mjs'],
  },
})
