import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DirectoryCard } from '@/components/DirectoryCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedDirectory } from '../../../../../data/seedData.js'

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
  'septic-excavation': 'Septic & Excavation',
  'auto-repair': 'Auto Repair',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical',
  'towing': 'Towing',
  'welding-fabrication': 'Welding & Fabrication',
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
  'septic-excavation': {
    title: 'Septic & Excavation',
    desc: 'Local excavation, septic pumping, utility installation, and dirt work professionals serving the Missoula valley.',
  },
  'auto-repair': {
    title: 'Auto Repair',
    desc: 'Trusted mechanics, tire shops, diagnostics, and auto care services in Missoula, Montana.',
  },
  'plumbing-hvac': {
    title: 'Plumbing & HVAC',
    desc: 'Heating, air conditioning, plumbing installations, and emergency repairs by local Missoula professionals.',
  },
  'electrical': {
    title: 'Electrical Services',
    desc: 'Licensed commercial and residential electricians serving Missoula homes and businesses.',
  },
  'towing': {
    title: 'Towing & Recovery',
    desc: 'Towing companies, roadside assistance, and vehicle recovery operators in the Five Valleys.',
  },
  'welding-fabrication': {
    title: 'Welding & Fabrication',
    desc: 'Custom metal fabrication, welding repairs, structural work, and machining shops in Missoula.',
  },
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  if (!CATEGORY_LABELS[slug]) {
    return {
      title: 'Category Not Found | Missoula Legends',
    }
  }

  const categoryTitle = CATEGORY_LABELS[slug]
  const banner = CATEGORY_DETAILS[slug] || { title: categoryTitle, desc: `Local businesses and craftsmen in the ${categoryTitle} category in Missoula, Montana.` }

  return {
    title: `${banner.title} Registry`,
    description: banner.desc,
    alternates: { canonical: `/directory/category/${slug}` },
    openGraph: {
      title: `${banner.title} Registry | Missoula Legends`,
      description: banner.desc,
      url: `https://missoulalegends.com/directory/category/${slug}`,
      siteName: 'Missoula Legends',
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  if (!CATEGORY_LABELS[slug]) {
    notFound()
  }

  const categoryLabel = CATEGORY_LABELS[slug]
  const banner = CATEGORY_DETAILS[slug] || {
    title: categoryLabel,
    desc: `Browse local establishments and neighborhood landmarks representing the ${categoryLabel} sector of Missoula.`,
  }

  let listings = []

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      depth: 1,
      overrideAccess: false,
      where: {
        category: {
          equals: slug,
        },
      },
    })
    listings = res.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    const sourceListings = seedDirectory.filter((item: any) => item.category === slug)
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
      status: listing.status || 'listed',
      slug: listing.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Header Navigation */}
      <Header />

      {/* Title Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-20 md:py-24 text-center overflow-hidden mb-8">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-mono text-warm-stone/80">
            <Link href="/directory" className="hover:text-aged-brass transition-colors">Registry</Link>
            <span>/</span>
            <span className="text-aged-brass font-bold">{categoryLabel}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-deep-spruce dark:text-white font-serif leading-none">
            {banner.title}
          </h1>
          <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-2xl mx-auto mt-4 font-serif">
            {banner.desc}
          </p>
        </div>
      </section>

      {/* Listings List */}
      <main className="max-w-[1200px] mx-auto px-6 py-10 md:py-16">
        <div className="flex flex-col w-full">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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
          ) : (
            <div className="py-20 text-center text-warm-stone w-full bg-white dark:bg-blue-black border border-warm-limestone/40 dark:border-warm-limestone/15 rounded-sm p-8 shadow-sm">
              <p className="text-lg font-serif italic mb-2">No listings found in this category.</p>
              <Link href="/directory" className="text-sm font-semibold text-oxblood-brown dark:text-aged-brass underline">
                View all listings
              </Link>
            </div>
          )}

          {/* Back to Registry link */}
          <div className="mt-16 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 text-left">
            <Link 
              href="/directory" 
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Registry
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
