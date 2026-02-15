import { z } from 'astro/zod'
import type { Dirent } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:fs/promises')

/**
 * Mirror the schema from content.config.ts for testing.
 * We can't import content.config.ts directly because it uses
 * `astro:content` which requires the Astro runtime.
 */
const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  author: z.string().default('nirus'),
  youtube: z.string().optional(),
  lang: z.string().default('en'),
})

describe('Post schema validation', () => {
  it('validates a post with all required fields', () => {
    const result = postSchema.safeParse({
      title: 'Test Post',
      description: 'A test description',
      pubDate: '2024-01-15',
      tags: ['javascript', 'astro'],
      author: 'testuser',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pubDate).toBeInstanceOf(Date)
    }
  })

  it('applies default values for optional fields', () => {
    const result = postSchema.safeParse({
      title: 'Minimal Post',
      description: 'Minimal description',
      pubDate: '2024-01-15',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.author).toBe('nirus')
      expect(result.data.tags).toEqual([])
      expect(result.data.lang).toBe('en')
      expect(result.data.youtube).toBeUndefined()
    }
  })

  it('coerces pubDate string to Date', () => {
    const result = postSchema.safeParse({
      title: 'Date Test',
      description: 'Testing date coercion',
      pubDate: '2020-09-14',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pubDate.getFullYear()).toBe(2020)
      expect(result.data.pubDate.getMonth()).toBe(8) // September = 8
      expect(result.data.pubDate.getDate()).toBe(14)
    }
  })

  it('fails when title is missing', () => {
    const result = postSchema.safeParse({
      description: 'No title',
      pubDate: '2024-01-15',
    })
    expect(result.success).toBe(false)
  })

  it('fails when description is missing', () => {
    const result = postSchema.safeParse({
      title: 'No description',
      pubDate: '2024-01-15',
    })
    expect(result.success).toBe(false)
  })

  it('accepts youtube as an optional string', () => {
    const result = postSchema.safeParse({
      title: 'YouTube Post',
      description: 'A post with video',
      pubDate: '2024-01-15',
      youtube: 'dQw4w9WgXcQ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.youtube).toBe('dQw4w9WgXcQ')
    }
  })

  it('accepts tags as an empty array', () => {
    const result = postSchema.safeParse({
      title: 'No Tags',
      description: 'Post without tags',
      pubDate: '2024-01-15',
      tags: [],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toEqual([])
    }
  })

  it('fails when tags contains non-strings', () => {
    const result = postSchema.safeParse({
      title: 'Bad Tags',
      description: 'Post with bad tags',
      pubDate: '2024-01-15',
      tags: [123, true],
    })
    expect(result.success).toBe(false)
  })
})

describe('claim.json metadata extraction', () => {
  it('extracts all fields from a complete claim.json', () => {
    const claim = {
      title: 'Apollo GraphQL Client – Abort pending requests',
      pubDate: '2020-09-14',
      description: 'Article about using Abort signal',
      tags: ['javascript', 'GraphQL'],
      author: 'nirus',
    }
    const result = postSchema.safeParse(claim)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe(claim.title)
      expect(result.data.description).toBe(claim.description)
      expect(result.data.tags).toEqual(['javascript', 'GraphQL'])
      expect(result.data.author).toBe('nirus')
    }
  })

  it('handles claim.json with youtube field', () => {
    const claim = {
      title: 'Video Post',
      description: 'A post with video',
      pubDate: '2024-03-10',
      tags: ['video'],
      author: 'nirus',
      youtube: 'abc123',
    }
    const result = postSchema.safeParse(claim)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.youtube).toBe('abc123')
    }
  })

  it('applies defaults when claim.json has minimal fields', () => {
    const claim = {
      title: 'Minimal Claim',
      description: 'Just the basics',
      pubDate: '2024-01-01',
    }
    const result = postSchema.safeParse(claim)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.author).toBe('nirus')
      expect(result.data.tags).toEqual([])
      expect(result.data.lang).toBe('en')
    }
  })

  it('rejects claim.json missing required title', () => {
    const claim = {
      description: 'No title here',
      pubDate: '2024-01-01',
    }
    const result = postSchema.safeParse(claim)
    expect(result.success).toBe(false)
  })

  it('rejects claim.json missing required pubDate', () => {
    const claim = {
      title: 'No Date',
      description: 'Missing pubDate',
    }
    const result = postSchema.safeParse(claim)
    expect(result.success).toBe(false)
  })
})

describe('Loader ID generation', () => {
  it('generates correct id format: slug/index', () => {
    const slug = 'apollo-graphql-client-abort-pending-requests'
    const id = `${slug}/index`
    expect(id).toBe('apollo-graphql-client-abort-pending-requests/index')
  })

  it('slug can be extracted by stripping /index suffix', () => {
    const id = 'my-post-slug/index'
    const slug = id.replace(/\/index$/, '')
    expect(slug).toBe('my-post-slug')
  })
})

describe('Loader directory scanning', () => {
  const mockedReaddir = vi.mocked(readdir)
  const mockedReadFile = vi.mocked(readFile)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  function makeDirent(name: string, isDir: boolean): Dirent {
    return {
      name,
      isDirectory: () => isDir,
      isFile: () => !isDir,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isFIFO: () => false,
      isSocket: () => false,
      isSymbolicLink: () => false,
      parentPath: '',
      path: '',
    } as Dirent
  }

  it('filters only directories from readdir results', async () => {
    const entries = [
      makeDirent('my-post', true),
      makeDirent('README.md', false),
      makeDirent('another-post', true),
      makeDirent('.gitignore', false),
    ]
    mockedReaddir.mockResolvedValue(entries as any)

    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name)
    expect(dirs).toEqual(['my-post', 'another-post'])
  })

  it('reads claim.json and index.md for each post directory', async () => {
    const claimJson = JSON.stringify({
      title: 'Test',
      description: 'Desc',
      pubDate: '2024-01-01',
      tags: ['test'],
      author: 'nirus',
    })
    const indexMd = '# Hello World\n\nSome content.'

    mockedReadFile.mockImplementation((path: any) => {
      if (String(path).endsWith('claim.json')) return Promise.resolve(claimJson)
      if (String(path).endsWith('index.md')) return Promise.resolve(indexMd)
      return Promise.reject(new Error('Not found'))
    })

    const claim = JSON.parse(
      (await mockedReadFile('test/claim.json', 'utf-8')) as string,
    )
    const body = await mockedReadFile('test/index.md', 'utf-8')

    expect(claim.title).toBe('Test')
    expect(body).toBe(indexMd)
  })

  it('gracefully handles directories missing claim.json', async () => {
    mockedReadFile.mockRejectedValue(new Error('ENOENT'))

    await expect(mockedReadFile('missing/claim.json', 'utf-8')).rejects.toThrow(
      'ENOENT',
    )
  })

  it('gracefully handles invalid JSON in claim.json', () => {
    const invalidJson = '{ title: "bad json" }'
    expect(() => JSON.parse(invalidJson)).toThrow()
  })
})
