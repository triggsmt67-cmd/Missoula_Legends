import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getPlainText } from '@/lib/schema-utils'
import type { Metadata } from 'next'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'

export const revalidate = 14400

const BASE_URL = 'https://missoulalegends.com'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'history',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    
    if (res.docs.length > 0) {
      const story = res.docs[0] as any
      const plainText = getPlainText(story.content)
      const description = plainText.slice(0, 160).trimEnd() + (plainText.length > 160 ? '...' : '')
      const imageUrl = story.heroImage?.url
        ? (story.heroImage.url.startsWith('http') ? story.heroImage.url : `${BASE_URL}${story.heroImage.url}`)
        : `${BASE_URL}/media/missoula-hero-twilight.png`
      
      return {
        title: `${story.title} | Missoula Legends`,
        description,
        alternates: { canonical: `/history/${slug}` },
        openGraph: {
          type: 'article',
          url: `${BASE_URL}/history/${slug}`,
          title: story.title,
          description,
          images: [{ url: imageUrl, width: 1200, height: 630, alt: story.heroImage?.alt || story.title }],
          siteName: 'Missoula Legends',
        },
        twitter: {
          card: 'summary_large_image',
          title: story.title,
          description,
          images: [imageUrl],
        },
      }
    }
  } catch (e) {
    // fallback below
  }
  
  // Fallback for seed data or DB failures
  if (slug === 'the-wilma-theatre-palace-of-cinema') {
    return {
      title: "The Wilma Theatre: Missoula's Palace of Cinema | Missoula Legends",
      description: "Since 1921, the Wilma Theatre has stood as a monument to arts and culture in downtown Missoula, hosting grand cinema screenings and live performances along the Clark Fork River.",
      alternates: { canonical: `/history/${slug}` },
    }
  }
  
  return {
    title: 'History Story | Missoula Legends',
    description: 'Read the historical vault stories of Missoula, Montana.',
    alternates: { canonical: `/history/${slug}` },
  }
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export default async function HistoryStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let story: any = null

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'history',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
      limit: 1,
    })
    story = res.docs[0] || null
  } catch (error: any) {
    console.warn('Database connection failed, falling back to mock history details:', error.message)
    if (slug === 'the-wilma-theatre-palace-of-cinema') {
      story = {
        title: "The Wilma Theatre: Missoula's Palace of Cinema",
        year: '1921',
        location: '131 S Higgins Ave, Missoula, MT',
        excerpt: 'Since 1921, the Wilma Theatre has stood as a monument to arts and culture in downtown Missoula, hosting grand cinema screenings and live performances along the Clark Fork River.',
        heroImage: {
          url: '/media/missoula-history-site.jpg',
          alt: 'Historic Wilma Theater Facade and Marquee',
        },
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'First opened in 1921 by William "Billy" Simons and named for his wife, light opera singer Wilma Simons, the Wilma Theatre is an iconic centerpiece of downtown Missoula. Designed as a grand eight-story "skyscraper" along the banks of the Clark Fork River, it housed a magnificent theater, offices, apartments, and a swimming pool in the basement. Over the decades, it has transitioned from vaudeville and silent films to a premier concert venue and the main screening site of the Missoula Film Festival. To this day, its glowing neon marquee acts as a warm beacon of arts and culture for the entire Garden City.',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      }
    }
  }

  if (!story) {
    notFound()
  }

  const imageUrl = decodeUrl(story.heroImage?.sizes?.featureHero?.url) || decodeUrl(story.heroImage?.url) || '/media/placeholder.jpg'

  const baseUrl = 'https://missoulalegends.com'
  const pageUrl = `${baseUrl}/history/${slug}`
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
  const storyBody = getPlainText(story.content)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HistoricalLandmark',
      '@id': `${pageUrl}#landmark`,
      'name': story.title,
      'description': story.excerpt,
      'image': absoluteImageUrl,
      'foundingDate': story.year || undefined,
      'address': story.location ? {
        '@type': 'PostalAddress',
        'streetAddress': story.location,
        'addressLocality': 'Missoula',
        'addressRegion': 'MT',
        'addressCountry': 'US'
      } : undefined,
      'url': pageUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': story.title,
      'image': absoluteImageUrl,
      'datePublished': story.createdAt || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': 'Trevor Riggs',
        'jobTitle': 'Missoula Legends Curator',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Missoula Legends',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://missoulalegends.com/media/missoula-historical-map-panoramic.png',
        },
      },
      'description': story.excerpt,
      'articleBody': storyBody,
      'about': {
        '@id': `${pageUrl}#landmark`
      },
      'mainEntityOfPage': pageUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://missoulalegends.com',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'History',
          'item': 'https://missoulalegends.com/history',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': story.title,
          'item': `https://missoulalegends.com/history/${slug}`,
        },
      ],
    }
  ]

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header Navigation */}
      <Header />

      {/* Story Hero Header Section */}
      <section className="relative w-full bg-gradient-to-b from-[#fbf9f4] to-[#f5f2e8] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-16 md:py-24 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            {story.year} • {story.location}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-deep-spruce dark:text-white font-normal leading-[1.1] tracking-tight max-w-4xl text-center">
            {story.title}
          </h1>
          <div className="w-16 border-t-2 border-aged-brass/50 my-6"></div>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-2xl mx-auto italic">
            "{story.excerpt}"
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Longform content */}
          <div className="lg:col-span-8 flex flex-col text-left">
            {/* Framed Image */}
            <div className="p-3 bg-[#fcfaf7] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2.5rem] shadow-lg mb-12 w-full">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem]">
                <Image
                  src={imageUrl}
                  alt={story.heroImage?.alt || story.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Rich Text Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-soft-black dark:text-ivory-paper font-serif leading-relaxed text-base sm:text-lg">
              {story.content ? (
                <RichText data={story.content} />
              ) : (
                <p>No content available for this story.</p>
              )}
            </div>

            {/* Back Button */}
            <div className="border-t border-warm-limestone/50 dark:border-warm-limestone/10 mt-16 pt-8">
              <Link 
                href="/history" 
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors"
              >
                &larr; Back to History Registry
              </Link>
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-10 text-left lg:border-l lg:border-warm-limestone/50 lg:dark:border-warm-limestone/10 lg:pl-12">
            
            {/* Story Details Card */}
            <div className="bg-[#faf8f4] dark:bg-[#17231D]/10 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Registry Details
              </h3>
              <div className="flex flex-col gap-4 text-xs font-mono">
                <div>
                  <span className="text-warm-stone uppercase block mb-1">Landmark</span>
                  <span className="text-sm font-sans font-bold text-deep-spruce dark:text-white">{story.location}</span>
                </div>
                <div className="border-t border-warm-limestone/40 dark:border-warm-limestone/10 pt-4">
                  <span className="text-warm-stone uppercase block mb-1">Inaugural Era</span>
                  <span className="text-sm font-sans font-bold text-deep-spruce dark:text-white">{story.year}</span>
                </div>
                <div className="border-t border-warm-limestone/40 dark:border-warm-limestone/10 pt-4">
                  <span className="text-warm-stone uppercase block mb-1">Registry Category</span>
                  <span className="text-sm font-sans font-bold text-deep-spruce dark:text-white">Historical Legend</span>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-deep-spruce text-ivory-paper p-8 rounded-sm text-center shadow-lg">
              <h4 className="font-serif text-lg font-semibold mb-3">Add to the Registry</h4>
              <p className="text-xs text-warm-stone/85 leading-relaxed mb-6">
                Help us discover and document more historical structures and narratives from our local communities.
              </p>
              <Link
                href="/history/post"
                className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-3.5 rounded-sm transition-all block text-center border border-aged-brass/35"
              >
                Submit a Landmark
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
