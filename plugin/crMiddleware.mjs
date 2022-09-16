import { resolve, dirname } from 'path'
/**
 * @credits: https://github.com/withastro/astro/issues/397#issuecomment-1236231783
 * claim file to the remark processor
 * @returns Mutated frontmatter object
 */
export function codeRocksMiddleWare() {
    return function (tree, file) {
        const inputFolder = dirname(file.history[0]);
        const claimFile = resolve(inputFolder + '/claim.json');
        const claimJSON = JSON.parse(fs.readFileSync(claimFile, 'utf8'))

        file.data.astro.frontmatter = {
            ...file.data.astro.frontmatter,
            ...claimJSON,
            layout: '@layouts/BlogPostLayout.astro'
        }
    }
}