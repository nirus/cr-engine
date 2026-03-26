const fs = require('fs')
const path = require('path')

const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts')
const ogDir = path.join(__dirname, '..', 'dist', 'og')

if (!fs.existsSync(postsDir)) process.exit(0)

fs.mkdirSync(ogDir, { recursive: true })

for (const slug of fs.readdirSync(postsDir)) {
  const postDir = path.join(postsDir, slug)
  if (!fs.statSync(postDir).isDirectory()) continue

  for (const ext of ['jpg', 'png']) {
    const src = path.join(postDir, `hero.${ext}`)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(ogDir, `${slug}.${ext}`))
      break
    }
  }
}
