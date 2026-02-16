import { Settings } from '@config/site'

const { mainUrl } = Settings.site

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: Settings.brand.name,
    url: mainUrl,
    logo: `${mainUrl}${Settings.brand.logo}`,
    description: Settings.site.description,
    foundingDate: Settings.brand.foundingDate,
    sameAs: [Settings.cr.twitter],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: Settings.brand.name,
    url: mainUrl,
    description: Settings.site.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${mainUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function blogPostingJsonLd(post: {
  title: string
  description: string
  pubDate: string
  author?: string
  tags?: string[]
  slug: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate,
    author: {
      '@type': 'Person',
      name: post.author || Settings.brand.name,
    },
    publisher: {
      '@type': 'Organization',
      name: Settings.brand.name,
      logo: {
        '@type': 'ImageObject',
        url: `${mainUrl}${Settings.brand.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${mainUrl}/posts/${post.slug}/`,
    },
    ...(post.image ? { image: `${mainUrl}${post.image}` } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${mainUrl}${item.url}`,
    })),
  }
}

export function collectionPageJsonLd(page: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    description: page.description,
    url: `${mainUrl}${page.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: Settings.brand.name,
      url: mainUrl,
    },
  }
}
