import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/runtime-config'

export default function robots(): MetadataRoute.Robots {
  // One group applies the same public/private boundary to all compliant crawlers.
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api', '/admin', '/intake'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
