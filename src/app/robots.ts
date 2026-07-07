import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.missoulalegends.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/intake/'],
      },
      // Explicitly allow search engine bots
      {
        userAgent: ['Googlebot', 'Bingbot', 'Adidxbot', 'Applebot'],
        allow: '/',
      },
      // Explicitly allow AI Search bots and scrapers to understand and find the site
      {
        userAgent: [
          'Google-Extended',      // Google Gemini
          'GPTBot',               // OpenAI GPTBot
          'ChatGPT-User',         // ChatGPT Custom Browsing
          'ClaudeBot',            // Anthropic ClaudeBot
          'Claude-Web',           // Anthropic Claude Web
          'PerplexityBot',        // Perplexity AI
          'Applebot-extended',    // Apple Intelligence
          'cohere-training-data', // Cohere AI
        ],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
