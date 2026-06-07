import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { DirectoryCard } from '@/components/DirectoryCard'
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-300 transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-base sm:text-xl tracking-tight hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
            MISSOULA <span className="hidden min-[380px]:inline font-mono text-slate-400 dark:text-slate-550 font-normal">LEGENDS</span>
          </Link>
          <nav className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-6 text-[11px] min-[380px]:text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/archives" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline hidden sm:inline-block">
              Archives
            </Link>
            <Link href="/directory" className="text-emerald-800 dark:text-emerald-400 font-semibold transition-colors">
              Explore Directory
            </Link>
            <Link
              href="/#featured"
              className="bg-emerald-800 text-white px-2.5 py-1.5 min-[380px]:px-3.5 min-[380px]:py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-emerald-900 active:scale-[0.98] transition-all font-medium shadow-sm hover:shadow"
            >
              Get Featured
            </Link>
          </nav>
        </div>
      </header>

      {/* Premium Directory Title Banner with background image & overlay */}
      <section className="relative w-full overflow-hidden py-20 md:py-28 bg-slate-950 text-white animate-fade-in mb-12">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-80">
          <Image
            src="/media/missoula-hero-twilight.png"
            alt="Missoula Twilight Scenic View"
            fill
            priority
            className="object-cover object-center scale-102"
          />
          {/* Gradients to merge */}
          <div className="absolute inset-0 bg-slate-950/15 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-sans leading-none">
              {currentBanner.title}
            </h1>
            <p className="text-slate-200 dark:text-slate-300 text-lg md:text-xl font-light leading-relaxed mt-4 max-w-[55ch]">
              {currentBanner.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Horizontal Row Listings (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Mobile Category Horizontal Scroll (Visible only on mobile/tablet) */}
            <div className="lg:hidden mb-8 w-full">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block mb-3">
                Browse Categories
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6">
                <Link
                  href="/directory"
                  className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border whitespace-nowrap transition-all active:scale-[0.98] ${
                    !activeCategory 
                      ? 'bg-emerald-800 text-white border-emerald-800 font-semibold' 
                      : 'bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  All
                </Link>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/directory?category=${key}`}
                    className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border whitespace-nowrap transition-all active:scale-[0.98] ${
                      activeCategory === key 
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold' 
                        : 'bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
              <div className="py-20 text-center text-slate-400 dark:text-slate-600">
                <p className="text-lg font-light mb-2">No listings found in this category.</p>
                <Link href="/directory" className="text-sm font-semibold text-emerald-800 dark:text-emerald-450 underline">
                  View all listings
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar (1/3 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-10">
            
            {/* Custom Missoula Showcase Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-8 rounded-[2rem] flex flex-col justify-between hover-magnetic group">
              <div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
                  The Garden City.
                </h3>
                <span className="font-serif italic text-amber-800 dark:text-amber-500 mt-2 text-lg block">
                  Five Valleys, Three Rivers
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-light">
                  Nestled at the hub of five mountain valleys and the confluence of three rivers, Missoula was founded in 1860 as Hellgate Trading Post before being renamed Missoula Mills.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-light">
                  Historically shaped by timber mills and agriculture, today Missoula is the cultural capital of Montana, home to the University of Montana and a thriving community of independent writers, artists, and craftsmen.
                </p>
                <p className="text-sm text-slate-550 dark:text-slate-450 mt-3 leading-relaxed font-light">
                  From the ancient shores of <span className="text-amber-800 dark:text-amber-500 font-semibold">Glacial Lake Missoula</span> to the modern trails of Mount Sentinel, our town represents a unique union of rugged wilderness and rich heritage.
                </p>
              </div>
              
              <div className="w-full border-t border-slate-100 dark:border-slate-800/80 my-6"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-900 text-white rounded-full flex items-center justify-center font-serif text-sm font-bold flex-shrink-0">
                  ML
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-slate-950 dark:text-white font-bold">
                    MISSOULA LEGENDS
                  </h4>
                  <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Editorial & Historical Registry
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-6 rounded-[2rem] flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                Filter by Category
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/directory"
                  className={`text-sm font-medium hover:text-emerald-800 dark:hover:text-emerald-450 transition-colors ${
                    !activeCategory ? 'text-emerald-800 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All Listings
                </Link>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/directory?category=${key}`}
                    className={`text-sm font-medium hover:text-emerald-800 dark:hover:text-emerald-450 transition-colors ${
                      activeCategory === key ? 'text-emerald-800 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
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
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
            &copy; {new Date().getFullYear()} Missoula Legends. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 dark:text-slate-500 font-light">
            <Link href="/directory" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
              Directory
            </Link>
            <Link href="/" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
              Editorial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
