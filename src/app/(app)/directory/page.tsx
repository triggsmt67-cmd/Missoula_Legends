import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { DirectoryCard } from '@/components/DirectoryCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedDirectory } from '../../../data/seedData.js'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
  automotive: 'Automotive',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
}

const NEIGHBORHOOD_LABELS: { [key: string]: string } = {
  downtown: 'Downtown',
  'hip-strip': 'Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  northside: 'Northside',
  westside: 'Westside',
  rattlesnake: 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'orchard-homes-target-range': 'Orchard Homes / Target Range',
  'rose-park': 'Rose Park',
  'miller-creek-linda-vista': 'Miller Creek / Linda Vista',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  'bonner-milltown': 'Bonner-Milltown',
  lolo: 'Lolo',
  wye: 'Wye',
}

const CATEGORY_DETAILS: { [key: string]: { title: string; desc: string } } = {
  'food-drink': {
    title: 'Food & Drink',
    desc: 'Explore the local dining scene, wood-fired roasters, neighborhood taverns, and craft tables of Missoula.',
  },
  shopping: {
    title: 'Shopping Local',
    desc: 'Browse independent bookshops, record stores, artisan makers, and local boutiques representing Missoula craft.',
  },
  lifestyle: {
    title: 'Lifestyle & Leisure',
    desc: 'Discover wellness centers, outdoor outfitters, local events, and cultural spots around Missoula.',
  },
  automotive: {
    title: 'Automotive Services',
    desc: 'Find trusted local auto repair shops, detailing services, and vehicle care centers in the Missoula valley.',
  },
  'professional-services': {
    title: 'Professional Services',
    desc: 'Connect with local accountants, designers, builders, and consultants servicing the Missoula community.',
  },
  'health-wellness': {
    title: 'Health & Wellness',
    desc: 'Locate local health providers, yoga studios, counseling, and fitness centers in Missoula.',
  },
  'arts-culture': {
    title: 'Arts & Culture',
    desc: 'Explore local art galleries, theater spaces, music venues, and historical societies in Missoula.',
  },
  'home-lodging': {
    title: 'Home & Lodging',
    desc: 'Find local hotels, bed & breakfasts, interior styling resources, and home improvement companies.',
  },
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function DirectoryHub(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const activeCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined

  let listings = []

  try {
    const payload = await getPayload({ config })
    const query: any = {
      collection: 'directory',
      depth: 1,
    }
    if (activeCategory) {
      query.where = {
        category: {
          equals: activeCategory,
        },
      }
    }
    const res = await payload.find(query)
    listings = res.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    let sourceListings = seedDirectory
    if (activeCategory) {
      sourceListings = seedDirectory.filter((item: any) => item.category === activeCategory)
    }
    listings = sourceListings.map((listing, idx) => ({
      id: `directory_${idx}`,
      businessName: listing.businessName,
      category: listing.category,
      neighborhood: listing.neighborhood,
      description: listing.description,
      featuredImage: {
        url: `/media/${listing.mediaKey}`,
        alt: listing.businessName,
      },
      contactInfo: listing.contactInfo,
    }))
  }

  // Get current heading metadata
  const currentBanner = activeCategory && CATEGORY_DETAILS[activeCategory] 
    ? CATEGORY_DETAILS[activeCategory]
    : {
        title: 'Local Listings',
        desc: 'Browse local establishments and neighborhood landmarks that represent the craft, flavor, and character of Missoula.',
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

      {/* Directory Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-28 text-center overflow-hidden mb-12">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
            ESTABLISHED REGISTRY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            {currentBanner.title}
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-4">
            {currentBanner.desc}
          </p>
        </div>
      </section>

      {/* Main Grid Content Area */}
      <main className="max-w-[1320px] mx-auto px-6 sm:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Horizontal Row Listings (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col w-full">
            
            {/* Mobile Category Horizontal Scroll (Visible only on mobile/tablet) */}
            <div className="lg:hidden mb-8 w-full">
              <span className="font-mono text-[10px] uppercase tracking-widest text-warm-stone font-bold block mb-3 text-left">
                Browse Categories
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
                <Link
                  href="/directory"
                  className={`text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-sm border whitespace-nowrap transition-all active:scale-[0.98] ${
                    !activeCategory 
                      ? 'bg-deep-spruce text-ivory-paper border-deep-spruce font-bold' 
                      : 'bg-white dark:bg-blue-black text-warm-stone border-warm-limestone/60 dark:border-warm-limestone/15'
                  }`}
                >
                  All Listings
                </Link>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/directory?category=${key}`}
                    className={`text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-sm border whitespace-nowrap transition-all active:scale-[0.98] ${
                      activeCategory === key 
                        ? 'bg-deep-spruce text-ivory-paper border-deep-spruce font-bold' 
                        : 'bg-white dark:bg-blue-black text-warm-stone border-warm-limestone/60 dark:border-warm-limestone/15'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {listings.length > 0 ? (
              listings.map((item: any) => {
                const categoryLabel = CATEGORY_LABELS[item.category] || item.category
                const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood

                return (
                  <DirectoryCard
                    key={item.id}
                    item={item}
                    categoryLabel={categoryLabel}
                    neighborhoodLabel={neighborhoodLabel}
                  />
                )
              })
            ) : (
              <div className="py-20 text-center text-warm-stone">
                <p className="text-lg font-normal mb-2">No listings found in this category.</p>
                <Link href="/directory" className="text-sm font-semibold text-oxblood-brown dark:text-aged-brass underline">
                  View all listings
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar (1/3 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-10 text-left">
            
            {/* Custom Missoula Showcase Card */}
            <div className="relative bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm overflow-hidden group">
              <div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-deep-spruce dark:text-white leading-tight">
                  The Garden City.
                </h3>
                <span className="font-serif italic text-aged-brass mt-2 text-lg block">
                  Five Valleys, Three Rivers
                </span>
                <p className="text-sm text-soft-black dark:text-warm-stone mt-4 leading-relaxed font-normal font-serif">
                  Nestled at the hub of five mountain valleys and the confluence of three rivers, Missoula was founded in 1860 as Hellgate Trading Post before being renamed Missoula Mills.
                </p>
                <p className="text-sm text-soft-black dark:text-warm-stone mt-3 leading-relaxed font-normal font-serif">
                  Historically shaped by timber mills and agriculture, today Missoula is the cultural capital of Montana, home to the University of Montana and a thriving community of independent writers, artists, and craftsmen.
                </p>
                <p className="text-sm text-soft-black dark:text-warm-stone mt-3 leading-relaxed font-normal font-serif">
                  From the ancient shores of <span className="text-oxblood-brown dark:text-aged-brass font-semibold">Glacial Lake Missoula</span> to the modern trails of Mount Sentinel, our town represents a unique union of rugged wilderness and rich heritage.
                </p>
              </div>
              
              <div className="w-full border-t border-warm-limestone/60 dark:border-warm-limestone/15 my-6"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-oxblood-brown text-ivory-paper rounded-sm flex items-center justify-center font-serif text-sm font-bold flex-shrink-0">
                  ML
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-deep-spruce dark:text-white font-bold">
                    MISSOULA LEGENDS
                  </h4>
                  <span className="text-[9px] font-mono uppercase text-warm-stone tracking-wider block mt-0.5">
                    Editorial Registry
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="bg-white dark:bg-slate-900/20 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-6">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Filter by Category
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/directory"
                  className={`text-xs font-mono uppercase tracking-wider font-bold hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors ${
                    !activeCategory ? 'text-oxblood-brown dark:text-aged-brass' : 'text-warm-stone'
                  }`}
                >
                  All Listings
                </Link>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/directory?category=${key}`}
                    className={`text-xs font-mono uppercase tracking-wider font-bold hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors ${
                      activeCategory === key ? 'text-oxblood-brown dark:text-aged-brass' : 'text-warm-stone'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

