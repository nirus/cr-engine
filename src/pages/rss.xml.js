import rss from '@astrojs/rss'
import { Settings } from '@config/site'

export const get = () =>
  rss({
    title: Settings.site.title,
    description: Settings.site.tagline,
    site: import.meta.env.SITE,
    items: import.meta.glob('./posts/**/*.md'),
  })
