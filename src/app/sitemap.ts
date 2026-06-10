import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://missoulalegends.com'
  
  // Base static pages
  const routes = [
    '',
    '/directory',
    '/gallery',
    '/mission',
    '/history',
    '/history/stories',
    '/stories',
    '/nominate',
    '/content-use',
    '/privacy',
    '/terms',
    '/disclosure',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    const payload = await getPayload({ config })
    
    // Fetch all articles
    const articlesRes = await payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1000,
    })
    
    const articleRoutes = articlesRes.docs.map((doc: any) => ({
      url: `${baseUrl}/articles/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Fetch all history stories
    const historyRes = await payload.find({
      collection: 'history',
      depth: 0,
      limit: 1000,
    })
    
    const historyRoutes = historyRes.docs.map((doc: any) => ({
      url: `${baseUrl}/history/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...routes, ...articleRoutes, ...historyRoutes]
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error)
    return routes // Fallback to static routes if db/payload connection fails
  }
}
