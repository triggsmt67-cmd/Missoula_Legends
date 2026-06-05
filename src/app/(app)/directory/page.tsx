import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { seedDirectory } from '../../../data/seedData.js'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
}

const NEIGHBORHOOD_LABELS: { [key: string]: string } = {
  downtown: 'Downtown',
  'hip-strip': 'Hip Strip',
  'slant-streets': 'Slant Streets',
  northside: 'Northside',
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
            const imageSrc =
              item.featuredImage?.sizes?.thumbnail?.url || item.featuredImage?.url || '/media/placeholder.jpg'
            const categoryLabel = CATEGORY_LABELS[item.category] || item.category
            const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/20 border border-slate-250/40 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] p-7 rounded-[2rem] flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.025)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)] transition-all duration-300 animate-fade-in"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] mb-6 shadow-sm border border-slate-200/10 dark:border-slate-800/20">
                    <Image
                      src={imageSrc}
                      alt={item.featuredImage?.alt || item.businessName}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
                      {categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200/30 dark:border-slate-700/30">
                      {neighborhoodLabel}
                    </span>
                  </div>

                  {/* Business Details */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white tracking-tight leading-tight mb-3">
                    {item.businessName}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    {item.description}
                  </p>
                </div>

                {/* Contact & Link Bottom Section */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-4 flex flex-col gap-3">
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-light flex flex-col gap-1.5 font-mono uppercase tracking-wider">
                    {item.contactInfo?.address && (
                      <div className="flex gap-2">
                        <span className="text-slate-300 dark:text-slate-700">LOC:</span>
                        <span className="text-slate-600 dark:text-slate-350 truncate max-w-[250px]">{item.contactInfo.address}</span>
                      </div>
                    )}
                    {item.contactInfo?.phone && (
                      <div className="flex gap-2">
                        <span className="text-slate-300 dark:text-slate-700">PH:</span>
                        <span className="text-slate-600 dark:text-slate-350">{item.contactInfo.phone}</span>
                      </div>
                    )}
                  </div>
                  {item.contactInfo?.website && (
                    <div className="pt-2 flex justify-between items-center">
                      <a
                        href={item.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 underline underline-offset-4 active:scale-[0.98] transition-all"
                      >
                        Visit Website &rarr;
                      </a>
                      {item.contactInfo.instagram && (
                        <a
                          href={`https://instagram.com/${item.contactInfo.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          {item.contactInfo.instagram}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
