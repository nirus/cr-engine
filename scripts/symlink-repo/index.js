/**
 * Small script to link the files cross platform.
 * This could have been done in a bash script. But keeping it 
 * in a node script if needed to add more files in future. IT'S EASY for me!!
 */
const { symlinkSync } = require('fs');
const { resolve } = require('path')

/**
 * Add the 'files' that you want to symlink to 'src/pages/posts' folder from 'src/posts-astro-code'.
 * In future it can be wildcard based on the requirement using glob matching
 * For now lets settle with this.
 */

const files = ['[...page].astro'];

files.forEach((file) => {
    symlinkSync(resolve(`../../src/posts-astro-code/${file}`), resolve(`../../src/pages/posts/${file}`));
});