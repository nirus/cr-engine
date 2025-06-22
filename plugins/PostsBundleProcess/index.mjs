/**
 * This middleware fixes the images during the dev and final build
 * fixing the image paths inside /posts folder.
 * Also copies all the images from 'src/pages/posts/**' to build folder
 * see 'yarn build:preview' command
 */
import { resolve, relative } from 'node:path'
import { globby } from 'globby'
import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/** Allowed image files */
const allowedImgExt = ['jpg', 'png', 'svg']

export default function () {
  return {
    name: 'PostPageImageServe',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const resolvedPath = resolve('src/pages')
          const paths = await globby([
            `${resolvedPath}/posts/**/*.{${allowedImgExt.join(',')}}`,
            `!${resolvedPath}/posts/**/hero.{jpg,png}`,
          ])
          const destinationFolder = resolve(fileURLToPath(dir))

          for (const sourceFile of paths) {
            const relativePathExtract = relative(resolvedPath, sourceFile)
            const destinationFile = resolve(
              `${destinationFolder}/${relativePathExtract}`,
            )
            await copyFile(sourceFile, destinationFile)
          }
        } catch (error) {
          console.log(
            'Error while copying the assets from "src/pages/posts" to the build folder',
          )
          throw error
        }
      },
    },
  }
}
