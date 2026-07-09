import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSiteUrl, getStaticLastModified, isPayloadConfigured } from '@/lib/runtime-config'

type SitemapDoc = {
  slug?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  _status?: string | null
  listingStatus?: string | null
}

const DIRECTORY_CATEGORY_SLUGS = [
  'food-drink',
  'shopping',
  'lifestyle',
  'automotive',
  'professional-services',
  'health-wellness',
  'arts-culture',
  'home-lodging',
  'septic-excavation',
  'auto-repair',
  'plumbing-hvac',
  'electrical',
  'towing',
  'welding-fabrication',
]

function getStaticRoutes(baseUrl: string): MetadataRoute.Sitemap {
  const staticLastModified = getStaticLastModified()

  return [
    '',
    '/directory',
    '/gallery',
    '/mission',
    '/history',
    '/stories',
    '/content-use',
    '/privacy',
    '/terms',
    '/disclosure',
    '/sitemap',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}

// Slugs that are 301-redirected in next.config.ts — exclude from sitemap
const REDIRECTED_ARTICLE_SLUGS = new Set(['trevortruepath406com'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  if (!isPayloadConfigured()) {
    return getStaticRoutes(baseUrl)
  }

  try {
    const payload = await getPayload({ config })

    const articlesRes = await payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    const articleRoutes = (articlesRes.docs as SitemapDoc[])
      .filter((doc) => doc.slug && !REDIRECTED_ARTICLE_SLUGS.has(doc.slug))
      .map((doc) => ({
        url: `${baseUrl}/articles/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    const historyRes = await payload.find({
      collection: 'history',
      depth: 0,
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    const historyRoutes = (historyRes.docs as SitemapDoc[])
      .filter((doc) => doc.slug)
      .map((doc) => ({
        url: `${baseUrl}/history/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    const directoryRes = await payload.find({
      collection: 'directory',
      depth: 0,
      limit: 1000,
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            listingStatus: {
              not_equals: 'unlisted',
            },
          },
        ],
      },
    })

    const directoryRoutes = (directoryRes.docs as SitemapDoc[])
      .filter((doc) => doc.slug)
      .map((doc) => ({
        url: `${baseUrl}/directory/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    const categoryRoutes = DIRECTORY_CATEGORY_SLUGS.map((cat) => ({
      url: `${baseUrl}/directory/category/${cat}`,
      lastModified: getStaticLastModified(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [...getStaticRoutes(baseUrl), ...articleRoutes, ...historyRoutes, ...directoryRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error)
    return getStaticRoutes(baseUrl)
  }
}
