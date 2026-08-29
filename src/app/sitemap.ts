import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.missoulalegends.com'
  
  // Base static pages
  const staticRoutes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/directory', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/stories', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/history', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/history/stories', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/mission', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/claim', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/nominate', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/spotlight', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/content-use', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/disclosure', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/sitemap', changeFrequency: 'weekly' as const, priority: 0.2 },
  ]

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
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

    // Fetch all directory listings
    const directoryRes = await payload.find({
      collection: 'directory',
      depth: 0,
      limit: 1000,
    })

    const directoryRoutes = directoryRes.docs
      .filter((doc: any) => doc.slug)
      .map((doc: any) => ({
        url: `${baseUrl}/directory/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    // Define standard categories
    const categories = [
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

    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/directory/category/${cat}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [...routes, ...articleRoutes, ...historyRoutes, ...directoryRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error)
    return routes // Fallback to static routes if db/payload connection fails
  }
}
