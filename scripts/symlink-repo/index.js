/**
 * Small script to link the files cross platform.
 * This could have been done in a bash script. But keeping it 
 * in a node script if needed to add more files in future. IT'S EASY for me!!
 */
const { symlinkSync } = require('fs');
const { resolve } = require('path')

symlinkSync(resolve('../../src/astro-code-pub/[...page].astro'), resolve('../../src/pages/posts/[...page].astro'));