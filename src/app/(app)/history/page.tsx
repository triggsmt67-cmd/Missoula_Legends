import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Historical Vault | Missoula Legends',
  description: 'Explore the stories of the old buildings, landmarks, and early days of Missoula, Montana.',
  alternates: { canonical: '/history' },
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export default async function HistoryPage() {
  let stories = []

  try {
    const payload = await getPayload({ config })
    const resStories = await payload.find({
      collection: 'history',
      depth: 1,
      sort: '-createdAt',
      limit: 100,
    })
    stories = resStories.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to mock history data:', error.message)
    stories = [
      {
        id: 'history_1',
        title: "The Wilma Theatre: Missoula's Palace of Cinema",
        slug: 'the-wilma-theatre-palace-of-cinema',
        year: '1921',
        location: '131 S Higgins Ave, Missoula, MT',
        excerpt: 'Since 1921, the Wilma Theatre has stood as a monument to arts and culture in downtown Missoula, hosting grand cinema screenings and live performances along the Clark Fork River.',
        heroImage: {
          url: '/media/missoula-history-site.jpg',
          alt: 'Historic Wilma Theater Facade and Marquee',
        },
        createdAt: new Date().toISOString(),
      },
    ]
  }

  const baseUrl = 'https://missoulalegends.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Historical Legends Vault',
    'description': "A registry of Missoula's historic architecture, legacy tales, and local monuments that shaped the Garden City.",
    'itemListElement': stories.map((story: any, idx: number) => {
      const imgPath = decodeUrl(story.heroImage?.sizes?.featureHero?.url) || decodeUrl(story.heroImage?.url)
      const imageSrc = imgPath
        ? (imgPath.startsWith('http') ? imgPath : `${baseUrl}${imgPath}`)
        : undefined
      
      return {
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
          '@type': 'HistoricalLandmark',
          'name': story.title,
          'description': story.excerpt,
          'image': imageSrc,
          'address': story.location ? {
            '@type': 'PostalAddress',
            'streetAddress': story.location,
            'addressLocality': 'Missoula',
            'addressRegion': 'MT',
            'addressCountry': 'US'
          } : undefined,
          'url': `${baseUrl}/history/${story.slug}`
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-[2px] bg-aged-brass z-50 transition-all duration-75"
        style={{ width: '0%' }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', () => {
              const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
              const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
              const progressEl = document.getElementById('scroll-progress');
              if (progressEl) progressEl.style.width = scrolled + '%';
            });
          `
        }}
      />

      {/* Header Navigation */}
      <Header />

      {/* Stories Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-28 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            HISTORIC VAULT
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Historical Legends
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-4">
            A registry of Missoula's historic architecture, legacy tales, and local monuments that shaped the Garden City.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start text-left">
          
          {/* Left Column: Stories List */}
          <div className="flex-grow w-full">
            <div className="flex items-center justify-between border-b border-warm-limestone dark:border-warm-limestone/20 pb-4 mb-10">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">Seeded Registry</h2>
              <span className="font-mono text-xs text-warm-stone font-bold uppercase tracking-wider">{stories.length} Registered</span>
            </div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {stories.map((story: any) => (
                <article key={story.id} className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start border-b border-warm-limestone/25 dark:border-warm-limestone/5 pb-12 last:border-b-0 last:pb-0">
                  {/* Framed Article Image */}
                  <Link 
                    href={`/history/${story.slug}`} 
                    className="block relative w-full sm:w-[240px] md:w-[300px] aspect-[4/3] p-1.5 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-sm shrink-0 shadow-sm"
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-none bg-[#faf8f5] dark:bg-slate-900">
                      {story.heroImage?.url ? (
                        <Image
                          src={decodeUrl(story.heroImage.url)!}
                          alt={story.heroImage.alt || story.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 240px, 300px"
                          className="object-cover image-zoom-hover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-warm-stone text-xs font-mono">
                          NO IMAGE
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Article Content */}
                  <div className="flex flex-col flex-1 py-1">
                    <span className="font-mono text-[10px] sm:text-xs text-aged-brass font-bold uppercase tracking-widest mb-2 sm:mb-3 block">
                      {story.year} • {story.location}
                    </span>
                    <Link href={`/history/${story.slug}`}>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-3 sm:mb-4 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors leading-tight">
                        <span className="hover-draw-underline">{story.title}</span>
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-base text-smoked-olive dark:text-warm-stone leading-relaxed font-normal mb-6">
                      {story.excerpt}
                    </p>
                    <Link
                      href={`/history/${story.slug}`}
                      className="mt-auto self-start inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors"
                    >
                      Read Story &rarr;
                    </Link>
                  </div>
                </article>
              ))}

              {stories.length === 0 && (
                <div className="text-center py-20 text-warm-stone font-normal">
                  No historical stories found in the registry.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-8">
            {/* Post a Story CTA */}
            <div className="bg-white dark:bg-slate-900/20 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm text-center">
              <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white mb-4">
                Share Missoula History
              </h3>
              <p className="text-xs text-warm-stone mb-6 leading-relaxed">
                Do you know of an old building, a historical landmark, or a classic tale that needs to be documented? Post it here.
              </p>
              <Link 
                href="/history/post" 
                className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-3.5 rounded-lg transition-all block text-center shadow-sm"
              >
                Post a Story
              </Link>
            </div>

            {/* Mission Note */}
            <div className="relative bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm overflow-hidden">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Preservation Mission
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-serif italic">
                "We believe the character of Missoula is etched in its brickwork and riverbends. By logging these historical landmarks, we preserve the roots that anchor our local community."
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
