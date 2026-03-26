import fs from 'node:fs'
import path from 'node:path'

/**
 * Astro integration that copies hero images to /og/{slug}.{ext}
 * so social card crawlers can access them at a predictable static path.
 */
export function copyOgImages() {
  return {
    name: 'copy-og-images',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const postsDir = path.resolve('src/content/posts')
        if (!fs.existsSync(postsDir)) {
          return
        }

        const ogDir = path.join(dir.pathname, 'og')
        fs.mkdirSync(ogDir, { recursive: true })

        for (const slug of fs.readdirSync(postsDir)) {
          const postDir = path.join(postsDir, slug)
          if (!fs.statSync(postDir).isDirectory()) {
            continue
          }

          for (const ext of ['jpg', 'png']) {
            const src = path.join(postDir, `hero.${ext}`)
            if (fs.existsSync(src)) {
              fs.copyFileSync(src, path.join(ogDir, `${slug}.${ext}`))
              break
            }
          }
        }
      },
    },
  }
}
