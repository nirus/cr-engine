const { symlinkSync, writeFileSync, readFileSync, rm, rmSync } = require('fs');
const { resolve } = require('path')

rmSync('../../src/pages/posts/README.md', { force: true });
symlinkSync(resolve('../../src/astro-code-pub/[...page].astro'), resolve('../../src/pages/posts/[...page].astro'));