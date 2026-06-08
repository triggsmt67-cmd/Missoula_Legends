import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export default async function HistoryArchivesPage() {
  let stories: any[] = []
  let curatorProfile: any = null

  try {
    const payload = await getPayload({ config })
    const resStories = await payload.find({
      collection: 'history',
      depth: 1,
      sort: '-createdAt',
      limit: 100,
    })
    stories = resStories.docs

    try {
      curatorProfile = await payload.findGlobal({ slug: 'curator-profile', depth: 1 })
    } catch (e) {
      // Global may not exist yet
    }
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
        content: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'First opened in 1921 by William "Billy" Simons and named for his wife, light opera singer Wilma Simons, the Wilma Theatre is an iconic centerpiece of downtown Missoula. Designed as a grand eight-story "skyscraper" along the banks of the Clark Fork River, it housed a magnificent theater, offices, apartments, and a swimming pool in the basement. Over the decades, it has transitioned from vaudeville and silent films to a premier concert venue and the main screening site of the Missoula Film Festival. To this day, its glowing neon marquee acts as a warm beacon of arts and culture for the entire Garden City.',
                  }
                ]
              }
            ]
          }
        },
        createdAt: new Date().toISOString(),
      },
    ]
  }

  // Helper to extract a text snippet from RichText payload or fall back to excerpt
  function getSnippet(story: any): string {
    if (story.excerpt) return story.excerpt
    const data = story.content
    if (!data) return ''
    
    let text = ''
    if (typeof data === 'string') {
      text = data
    } else {
      try {
        const traverse = (node: any) => {
          if (!node) return
          if (node.text && typeof node.text === 'string') {
            text += node.text + ' '
          }
          if (Array.isArray(node.children)) {
            node.children.forEach(traverse)
          }
        }
        
        if (data.root) traverse(data.root)
        else if (Array.isArray(data.children)) data.children.forEach(traverse)
      } catch (e) {
        return ''
      }
    }

    const words = text.trim().split(/\s+/)
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...'
    }
    return text.trim()
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
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

      {/* Title Section */}
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
            Historical Archives
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-4">
            Explore our registry of historic landmarks, architectural monuments, and stories from Missoula's heritage.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start text-left">
          
          {/* Left Column: Stories List */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between border-b border-warm-limestone dark:border-warm-limestone/20 pb-4 mb-10">
              <h2 className="text-2xl font-serif font-bold text-deep-spruce dark:text-white">All Legends</h2>
              <span className="font-mono text-xs text-warm-stone font-bold uppercase tracking-wider">{stories.length} Registered</span>
            </div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {stories.map((story: any) => (
                <article key={story.id} className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start border-b border-warm-limestone/25 dark:border-warm-limestone/5 pb-12 last:border-b-0 last:pb-0">
                  {/* Framed Image */}
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
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1 py-1">
                    <span className="font-mono text-[10px] sm:text-xs text-aged-brass font-bold uppercase tracking-widest mb-2 sm:mb-3 block">
                      {story.year} • {story.location}
                    </span>
                    <Link href={`/history/${story.slug}`}>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-3 sm:mb-4 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors leading-tight">
                        <span className="hover-draw-underline">{story.title}</span>
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-base text-smoked-olive dark:text-warm-stone leading-relaxed font-normal line-clamp-3 mb-6">
                      {getSnippet(story)}
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
                  No history stories found in the archives.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-8">
            
            {/* Curator's Note Card */}
            <div className="relative bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm overflow-hidden group">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone dark:text-slate-550 mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                History Curator
              </h3>
              <p className="text-sm text-soft-black dark:text-warm-stone font-serif font-normal leading-relaxed italic mb-6">
                "Preserving Missoula's architectural heritage and stories is a community-wide responsibility. By logging these historical monuments, we connect our present with the foundations of the Garden City."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-warm-limestone/60 dark:border-warm-limestone/15">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-warm-limestone dark:border-warm-stone/20">
                  <Image
                    src={
                      decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                      decodeUrl(curatorProfile?.photo?.url) ||
                      '/media/missoula-curator.jpg'
                    }
                    alt={curatorProfile?.name || 'Trevor Riggs'}
                    fill
                    sizes="40px"
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-deep-spruce dark:text-white font-sans">{curatorProfile?.name || 'Trevor Riggs'}</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-aged-brass font-bold">{curatorProfile?.title ? curatorProfile.title.split('•')[0].trim() : 'Missoula Curator'}</div>
                </div>
              </div>
            </div>

            {/* Popular Historical Topics */}
            <div className="bg-white dark:bg-slate-900/20 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Historic Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['1920s', 'Downtown', 'Clark Fork', 'Theatre', 'Architecture', 'Monuments', 'Railroad'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-ivory-paper dark:bg-slate-800/50 text-smoked-olive dark:text-slate-300 text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer border border-warm-limestone hover:border-aged-brass transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post a Story CTA */}
            <div className="bg-deep-spruce border border-warm-limestone/15 p-8 rounded-sm text-center text-ivory-paper shadow-lg">
              <div className="w-10 h-10 bg-aged-brass/10 border border-aged-brass/20 rounded-full flex items-center justify-center mx-auto mb-4 text-aged-brass">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Add to the Registry</h3>
              <p className="text-xs text-warm-stone/85 font-normal leading-relaxed mb-6">
                Do you know of an old building, a historical landmark, or a classic tale that needs to be documented? Post it here.
              </p>
              <Link 
                href="/history/post" 
                className="w-full bg-deep-spruce hover:bg-oxblood-brown text-ivory-paper font-mono uppercase text-xs tracking-widest font-bold py-3.5 rounded-sm transition-all block text-center border border-aged-brass/35"
              >
                Post a Story
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  )
}
