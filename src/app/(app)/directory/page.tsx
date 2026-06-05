import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
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

export default async function DirectoryHub() {
  let listings = []

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      depth: 1,
    })
    listings = res.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    // Map seed data to database document shape for local rendering and build-time safety
    listings = seedDirectory.map((listing, idx) => ({
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-300 transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
            MISSOULA <span className="font-mono text-slate-400 dark:text-slate-500 font-normal">LEGENDS</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/directory" className="text-emerald-800 dark:text-emerald-400 font-semibold transition-colors">
              Explore Directory
            </Link>
            <Link
              href="/#featured"
              className="bg-emerald-800 text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 active:scale-[0.98] transition-all font-medium shadow-sm hover:shadow"
            >
              Get Featured
            </Link>
          </nav>
        </div>
      </header>

      {/* Directory Title Banner */}
      <section className="max-w-[1400px] mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 border-b border-slate-200/50 dark:border-slate-850/40 animate-fade-in">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-550 block mb-3">
            Registry Index
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
            Local Listings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-light leading-relaxed mt-4 max-w-[50ch]">
            Browse local establishments and neighborhood landmarks that represent the craft, flavor, and character of Missoula.
          </p>
        </div>
      </section>

      {/* Grid List Section */}
      <main className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {listings.map((item: any) => {
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
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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
