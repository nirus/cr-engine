const { symlinkSync } = require('fs');
const { resolve } = require('path')

symlinkSync(resolve('../../src/astro-code-pub/[...page].astro'), resolve('../../src/pages/posts/[...page].astro'));