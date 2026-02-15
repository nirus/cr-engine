import { dirname } from 'node:path'
import { rehypeFigure } from './reHypeFigure.mjs'

/**
 *  Adds <figure /> with <figcaption /> tag to the images referenced in markdown files
 */
export function transformCustomTag() {
  return (tree, file) => {
    const inputFolder = dirname(file.history[0])
    if (
      inputFolder.includes('src/pages/posts') ||
      inputFolder.includes('src/content/posts')
    ) {
      const figurine = rehypeFigure({ className: 'cr-figure' })
      figurine(tree)
    }
  }
}
