import { resolve, dirname, basename } from 'path';
import { existsSync } from 'fs';

/**
 * @credits - https://gist.github.com/codeguy/6684588
 * @param  {...any} args string to slugify
 * @returns slug url
 */
export const slugify = (...args) => {
    const value = args.join(' ')

    return value
        .normalize('NFD') // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
        .replace(/\s+/g, '-') // separator
}

/**
 * @credits: https://github.com/withastro/astro/issues/397#issuecomment-1236231783
 * 'claim.json' file to the remark processor
 * @returns Mutated frontmatter object
 */
export function claimMiddleware() {
    return function (tree, file) {

        const inputFolder = dirname(file.history[0]);
        if (inputFolder.includes('src/pages/posts')) {
            const fullPath = (filename) => resolve(`${inputFolder}/${filename}`);
            const toBeSlug = basename(inputFolder);
            const claimFile = fullPath('claim.json');
            const claimJSON = JSON.parse(fs.readFileSync(claimFile, 'utf8'));

            /** Precedence is .jpg file */
            const whichHeroFile = (existsSync(fullPath('hero.jpg')) && 'jpg') || (existsSync(fullPath('hero.png')) && 'png');

            file.data.astro.frontmatter = {
                ...file.data.astro.frontmatter,
                ...claimJSON,
                ...(whichHeroFile ? { hero: `hero.${whichHeroFile}` } : {}),
                slug: toBeSlug,
                layout: '@layouts/BlogPostLayout.astro' // Hacks the 'tsconfig.json' to resolve the import
            }
        }
    }
}