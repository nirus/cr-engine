import type { Loader } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

function claimJsonLoader(): Loader {
  const postsDir = './src/content/posts'

  return {
    name: 'claim-json-loader',
    async load(context) {
      const { store, logger, parseData, generateDigest } = context

      let entries: string[]
      try {
        entries = await readdir(postsDir, { withFileTypes: true }).then(d =>
          d
            .filter(e => e.isDirectory() && !e.name.startsWith('.'))
            .map(e => e.name),
        )
      } catch {
        logger.warn(`Posts directory not found: ${postsDir}`)
        return
      }

      const validIds = new Set<string>()

      for (const slug of entries) {
        const dir = join(postsDir, slug)
        const claimPath = join(dir, 'claim.json')
        const mdPath = join(dir, 'index.md')

        let claimRaw: string
        let mdRaw: string
        try {
          ;[claimRaw, mdRaw] = await Promise.all([
            readFile(claimPath, 'utf-8'),
            readFile(mdPath, 'utf-8'),
          ])
        } catch {
          logger.warn(`Skipping "${slug}": missing claim.json or index.md`)
          continue
        }

        let claim: Record<string, unknown>
        try {
          claim = JSON.parse(claimRaw)
        } catch {
          logger.warn(`Skipping "${slug}": invalid claim.json`)
          continue
        }

        const id = `${slug}/index`
        validIds.add(id)

        const digest = generateDigest(`${claimRaw}${mdRaw}`)

        const data = await parseData({
          id,
          data: {
            title: claim.title,
            description: claim.description,
            pubDate: claim.pubDate,
            tags: claim.tags,
            author: claim.author,
            youtube: claim.youtube,
            lang: claim.lang,
          },
        })

        store.set({
          id,
          data,
          body: mdRaw,
          filePath: relative('.', mdPath),
          digest,
          deferredRender: true,
        })
      }

      // Remove stale entries
      const keysToDelete: string[] = []
      for (const key of store.keys()) {
        if (!validIds.has(key)) {
          keysToDelete.push(key)
        }
      }
      for (const key of keysToDelete) {
        store.delete(key)
      }
    },
  }
}

const posts = defineCollection({
  loader: claimJsonLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('nirus'),
    youtube: z.string().optional(),
    lang: z.string().default('en'),
  }),
})

export const collections = { posts }
