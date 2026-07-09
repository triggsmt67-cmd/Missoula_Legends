
import { getPayload } from 'payload'
import config from '@payload-config'
import { SafeImage } from '@/components/SafeImage'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'
import { decodeUrl, getPlainText } from '@/lib/schema-utils'
import { isPayloadConfigured } from '@/lib/runtime-config'

export const revalidate = 14400

export const metadata: Metadata = {
  title: 'Editorial Stories',
  description: 'Explore our collection of stories, community deep-dives, and local profiles from around Missoula.',
  alternates: { canonical: '/stories' },
}


export default async function StoriesPage() {
  let articles: any[] = []
  let curatorProfile: any = null

  if (isPayloadConfigured()) {
    try {
      const payload = await getPayload({ config })
      const [resArticles, profile] = await Promise.all([
        payload.find({
          collection: 'articles',
          depth: 1,
          sort: '-createdAt',
          limit: 100,
          where: {
            _status: { equals: 'published' },
          },
        }),
        payload.findGlobal({ slug: 'curator-profile', depth: 1 }).catch(() => null),
      ])
      articles = resArticles.docs
      curatorProfile = profile
    } catch (error: any) {
      console.warn('Unable to load editorial stories.', error.message)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Helper to extract a text snippet from RichText payload
  function get100WordSnippet(data: any): string {
    const plainText = getPlainText(data)
    const words = plainText.split(/\s+/)
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...'
    }
    return plainText
  }

  const baseUrl = 'https://www.missoulalegends.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/stories#webpage`,
    'name': 'Missoula Legends Editorial Stories',
    'url': `${baseUrl}/stories`,
    'description': 'Explore our collection of stories, community deep-dives, and local profiles from around Missoula.',
    'mainEntity': {
      '@type': 'ItemList',
      'name': 'Editorial Story Archive',
      'numberOfItems': articles.length,
      'itemListElement': articles.map((article: any, idx: number) => {
        const imgPath = decodeUrl(article.heroImage?.sizes?.thumbnail?.url) || decodeUrl(article.heroImage?.url)
        const imageSrc = imgPath
          ? (imgPath.startsWith('http') ? imgPath : `${baseUrl}${imgPath}`)
          : undefined
        const plainText = get100WordSnippet(article.content)
        return {
          '@type': 'ListItem',
          'position': idx + 1,
          'url': `${baseUrl}/articles/${article.slug}`,
          'item': {
            '@type': 'Article',
            'headline': article.title,
            'description': plainText,
            'image': imageSrc,
            'datePublished': article.createdAt || new Date().toISOString(),
            'author': {
              '@type': 'Person',
              'name': curatorProfile?.name || 'Trevor Riggs',
            },
            'url': `${baseUrl}/articles/${article.slug}`
          }
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
            
      {/* Header Navigation */}
      <Header />

      {/* Stories Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-28 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            THE VAULT
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            Editorial Stories
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-2xl mx-auto mt-4">
            Explore our collection of stories, historical deep-dives, and community profiles from around Missoula.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start text-left">
          
          {/* Left Column: Articles List (approx 2/3 width) */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between border-b border-warm-limestone dark:border-warm-limestone/20 pb-4 mb-10">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">All Stories</h2>
              <span className="font-mono text-xs text-warm-stone font-bold uppercase tracking-wider">{articles.length} Published</span>
            </div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {articles.map((article: any) => (
                <article key={article.id} className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start border-b border-warm-limestone/25 dark:border-warm-limestone/5 pb-12 last:border-b-0 last:pb-0">
                  {/* Framed Article Image */}
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="block relative w-full sm:w-[240px] md:w-[300px] aspect-[4/3] p-1.5 bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-sm shrink-0 shadow-sm"
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-none bg-[#faf8f5] dark:bg-slate-900">
                      {article.heroImage?.url ? (
                        <SafeImage
                          src={decodeUrl(article.heroImage.url)!}
                          alt={article.heroImage.alt || article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 240px, 300px"
                          className="object-cover image-zoom-hover"
                          fallbackSrc="/media/placeholder.jpg"
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
                      {formatDate(article.createdAt)}
                    </span>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-3 sm:mb-4 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors leading-tight">
                        <span className="hover-draw-underline">{article.title}</span>
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-base text-smoked-olive dark:text-ivory-paper/78 leading-relaxed font-normal line-clamp-3 mb-6">
                      {get100WordSnippet(article.content)}
                    </p>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="mt-auto self-start inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors"
                    >
                      Read Article &rarr;
                    </Link>
                  </div>
                </article>
              ))}

              {articles.length === 0 && (
                <div className="text-center py-20 text-warm-stone font-normal">
                  No stories found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar (approx 1/3 width) */}
          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-8">
            
            {/* Curator's Note Card */}
            <div className="relative bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm overflow-hidden group">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone dark:text-slate-550 mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Curator's Note
              </h3>
              <p className="text-sm text-soft-black dark:text-ivory-paper/78 font-serif font-normal leading-relaxed italic mb-6">
                "Welcome to our stories. This space is dedicated to sharing the tales of Missoula's most iconic places, people, and historic moments. As time goes on, this collection will grow to reflect the evolving soul of our city."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-warm-limestone/60 dark:border-warm-limestone/15">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-warm-limestone dark:border-warm-stone/20">
                  <SafeImage
                    src={
                      decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                      decodeUrl(curatorProfile?.photo?.url) ||
                      '/media/missoula-curator.jpg'
                    }
                    alt={curatorProfile?.name || 'Trevor Riggs'}
                    fill
                    sizes="40px"
                    className="object-cover object-center"
                    fallbackSrc="/media/missoula-curator.jpg"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-deep-spruce dark:text-white font-sans">{curatorProfile?.name || 'Trevor Riggs'}</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-aged-brass font-bold">{curatorProfile?.title ? curatorProfile.title.split('•')[0].trim() : 'Missoula Curator'}</div>
                </div>
              </div>
            </div>

            {/* Popular Topics Card */}
            <div className="bg-white dark:bg-slate-900/20 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Local History', 'Dining', 'Brewery', 'Arts & Culture', 'Outdoors', 'Downtown'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-ivory-paper dark:bg-slate-800/50 text-smoked-olive dark:text-slate-300 text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer border border-warm-limestone hover:border-aged-brass transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Join Newsletter Card */}
            <div className="bg-deep-spruce border border-warm-limestone/15 p-8 rounded-sm text-center text-ivory-paper shadow-lg">
              <div className="w-10 h-10 bg-aged-brass/10 border border-aged-brass/20 rounded-full flex items-center justify-center mx-auto mb-4 text-aged-brass">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Never Miss a Story</h3>
              <p className="text-xs text-warm-stone/85 font-normal leading-relaxed mb-6">
                Get the best of Missoula Legends delivered straight to your inbox every month.
              </p>
              <Link 
                href="/#newsletter" 
                className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-3.5 rounded-sm transition-all block text-center"
              >
                Subscribe Now
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
