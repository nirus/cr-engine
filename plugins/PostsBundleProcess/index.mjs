/**
 * This middleware fixes the images during the dev and final build
 * fixing the image paths inside /posts folder. 
 * Also copies all the images from 'src/pages/posts/**' to build folder
 * see 'yarn build:preview' command
 */
import { extname, basename, resolve, relative } from 'path';
import { readFile } from 'fs';
import { globby } from 'globby';
import { copyFile, } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Allowed image files */
const allowedImgExtn = ['jpg', 'png', 'svg'];

export default function () {
    return {
        name: 'PostPageImageServe',
        hooks: {
            /**Maps the image path during the 'yarn start' dev setup */
            'astro:server:setup': ({ server }) => {
                server.middlewares.use(
                    function middleware(req, res, next) {
                        const extn = extname(req.url).replace('.', '');
                        const isNotHeroFile = basename(req.url) !== 'hero.jpg' || basename(req.url) !== 'hero.png';
                        if (req.method === 'GET' && req.url.includes('/posts/') && allowedImgExtn.includes(extn) && isNotHeroFile) {
                            const contentType = `image/${extn}`;
                            readFile(resolve('src/pages' + req.url), (err, content) => {
                                res.writeHead(err ? 404 : 200, {
                                    "Content-Type": contentType
                                }).end(err ? undefined : content);
                            });
                        } else {
                            next();
                        }
                    }
                );
            },
            "astro:build:done": async ({ dir }) => {
                try {
                    const resolvedPath = resolve('src/pages');
                    const paths = await globby([resolvedPath + `/posts/**/*.{${allowedImgExtn.join(',')}}`, `!${resolvedPath}/posts/**/hero.{jpg,png}`]);
                    const destinationFolder = resolve(fileURLToPath(dir));

                    for (const sourceFile of paths) {
                        const relativePathExtract = relative(resolvedPath, sourceFile)
                        const destinationFile = resolve(`${destinationFolder}/${relativePathExtract}`)
                        await copyFile(sourceFile, destinationFile);
                    }
                } catch (error) {
                    console.log('Error while copying the assets from "src/pages/posts" to the build folder');
                    throw error;
                }

            }
        }
    }
}