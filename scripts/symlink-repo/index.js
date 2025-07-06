/**
 * Small script to link the files cross platform.
 * This could have been done in a bash script. But keeping it
 * in a node script if needed to add more files in future. IT'S EASY for me!!
 */
const { symlinkSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')

/**
 * Add the 'files' that you want to symlink to 'src/pages/posts' folder from 'src/posts-page-wrapper'.
 * In future it can be wildcard based on the requirement using glob matching
 * For now lets settle with this.
 */

const files = ['[...page].astro']

for (const file of files) {
  if (!existsSync(resolve(`../../src/pages/posts/${file}`))) {
    symlinkSync(
      resolve(`../../src/posts-page-wrapper/${file}`),
      resolve(`../../src/pages/posts/${file}`),
    )
    console.log(`Symlinked: ${file}`)
  } else {
    console.warn(`Symlink to "${file}" already exists. Skipping!`)
  }
}
