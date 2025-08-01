import { resolve, dirname, basename } from 'node:path'

/**
 * @credits - https://gist.github.com/codeguy/6684588
 * @param  {...any} args string to slugify
 * @returns slug url
 */
export const slugify = (...args) => {
  const value = args.join(' ')

  return value
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/\p{M}/gu, '') // remove combining diacritical marks using Unicode property
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-') // separator
}

/**
 * 'claim.json' file to the remark processor
 * @credits - https://github.com/withastro/astro/issues/397#issuecomment-1236231783
 * @returns Mutated frontmatter object
 */
export function claimMiddleware() {
  return (_, file) => {
    const inputFolder = dirname(file.history[0])
    if (inputFolder.includes('src/pages/posts')) {
      const fullPath = filename => resolve(`${inputFolder}/${filename}`)
      const toBeSlug = basename(inputFolder)
      const claimFile = fullPath('claim.json')
      const claimJSON = JSON.parse(fs.readFileSync(claimFile, 'utf8'))

      file.data.astro.frontmatter = {
        ...file.data.astro.frontmatter,
        author: 'nirus', // Hardcoding for now for default. Will be overridden if `author` is defined
        ...claimJSON,
        slug: toBeSlug,
        layout: '@layouts/BlogPostLayout.astro', // Hacks the 'tsconfig.json' to resolve the import
      }
    }
  }
}
