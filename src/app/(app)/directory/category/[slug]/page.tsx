import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DirectoryCard } from '@/components/DirectoryCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { decodeUrl, getBusinessSchemaType } from '@/lib/schema-utils'
import { isPayloadConfigured } from '@/lib/runtime-config'

export const revalidate = 14400

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
    desc: "Missoula's best local food and drink — breweries, restaurants, ice cream shops, coffee roasters, and distilleries featured in the Missoula Legends directory.",
  },
  shopping: {
    title: 'Shopping Local',
    desc: 'Independent bookshops, record stores, fly shops, artisan makers, and local boutiques in Missoula, Montana — curated by the Missoula Legends directory.',
  },
  lifestyle: {
    title: 'Lifestyle & Leisure',
    desc: 'Outdoor outfitters, fly fishing guides, fitness studios, and lifestyle businesses in Missoula — featured in the Missoula Legends directory.',
  },
  automotive: {
    title: 'Automotive Services',
    desc: 'Trusted auto shops, detailing services, and vehicle care centers in the Missoula valley — listed in the Missoula Legends directory.',
  },
  'professional-services': {
    title: 'Professional Services',
    desc: 'Local accountants, designers, contractors, and consultants serving the Missoula community — featured in the Missoula Legends directory.',
  },
  'health-wellness': {
    title: 'Health & Wellness',
    desc: 'Health providers, yoga studios, counseling practices, and fitness centers in Missoula, Montana — curated by Missoula Legends.',
  },
  'arts-culture': {
    title: 'Arts & Culture',
    desc: 'Art galleries, theaters, live music venues, ghost towns, and historical societies in Missoula — featured in the Missoula Legends directory.',
  },
  'home-lodging': {
    title: 'Home & Lodging',
    desc: 'Hotels, bed and breakfasts, interior designers, and home improvement companies in Missoula, Montana — listed by Missoula Legends.',
  },
  'septic-excavation': {
    title: 'Septic & Excavation',
    desc: 'Septic pumping, excavation, utility installation, and dirt work professionals serving the Missoula valley — featured in the Missoula Legends directory.',
  },
  'auto-repair': {
    title: 'Auto Repair',
    desc: 'Trusted mechanics, tire shops, diagnostics labs, and auto care specialists in Missoula, Montana — listed by Missoula Legends.',
  },
  'plumbing-hvac': {
    title: 'Plumbing & HVAC',
    desc: 'Heating, air conditioning, plumbing installation, and 24/7 emergency repair services by local Missoula professionals — featured by Missoula Legends.',
  },
  'electrical': {
    title: 'Electrical Services',
    desc: 'Licensed commercial and residential electricians serving Missoula homes and businesses — featured in the Missoula Legends directory.',
  },
  'towing': {
    title: 'Towing & Recovery',
    desc: 'Towing companies, roadside assistance, and vehicle recovery operators serving the Five Valleys of Missoula — listed by Missoula Legends.',
  },
  'welding-fabrication': {
    title: 'Welding & Fabrication',
    desc: 'Custom metal fabrication, welding repairs, structural steel, and machining shops in Missoula, Montana — featured by Missoula Legends.',
  },
}

export function generateStaticParams(): Array<{ slug: string }> {
  return Object.keys(CATEGORY_LABELS).map((slug) => ({ slug }))
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
      url: `https://www.missoulalegends.com/directory/category/${slug}`,
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

  let listings: any[] = []
  let relatedArticles: any[] = []

  if (isPayloadConfigured()) {
    try {
      const payload = await getPayload({ config })
      const res = await payload.find({
        collection: 'directory',
        depth: 1,
        overrideAccess: false,
        limit: 1000,
        where: {
          and: [
            {
              category: {
                equals: slug,
              },
            },
            {
              listingStatus: {
                not_equals: 'unlisted',
              },
            },
          ],
        },
      })
      listings = res.docs

      const listingIds = listings.map((l: any) => l.id)
      if (listingIds.length > 0) {
        const articlesRes = await payload.find({
          collection: 'articles',
          where: {
            relatedBusiness: {
              in: listingIds,
            },
          },
          limit: 3,
          depth: 1,
        })
        relatedArticles = articlesRes.docs
      }
    } catch (error: any) {
      console.warn('Unable to load category listings.', error.message)
    }
  }

  const baseUrl = 'https://www.missoulalegends.com'

  // Build JSON-LD array: BreadcrumbList always, ItemList only when listings > 0
  const jsonLd: object[] = []

  // ItemList — only emitted when there are actual listings
  if (listings.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${categoryLabel} in Missoula, Montana`,
      'description': `Local ${categoryLabel.toLowerCase()} businesses featured in the Missoula Legends directory.`,
      'numberOfItems': listings.length,
      'itemListElement': listings.map((listing: any, idx: number) => {
        const schemaType = getBusinessSchemaType(listing.category, listing.businessName)
        return {
          '@type': 'ListItem',
          'position': idx + 1,
          'name': listing.businessName,
          'url': `${baseUrl}/directory/${listing.slug}`,
          'item': {
            '@type': schemaType,
            'name': listing.businessName,
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Missoula',
              'addressRegion': 'MT',
              'addressCountry': 'US',
            },
          },
        }
      }),
    })
  }

  // BreadcrumbList — always present
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.missoulalegends.com',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Registry',
        'item': 'https://www.missoulalegends.com/directory',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': categoryLabel,
        'item': `https://www.missoulalegends.com/directory/category/${slug}`,
      },
    ],
  })

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
          <p className="text-base sm:text-lg text-smoked-olive dark:text-ivory-paper/78 font-normal leading-relaxed max-w-2xl mx-auto mt-4 font-serif">
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

          {/* Related Articles / Features Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-20 border-t border-warm-limestone/50 dark:border-warm-limestone/15 pt-16 text-left">
              <span className="font-mono text-aged-brass tracking-[0.25em] text-[10px] uppercase font-bold mb-4 block">
                Local Features & Story Deep-Dives
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-8">
                Stories from the {categoryLabel} Sector
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((art: any) => {
                  const artImgUrl = decodeUrl(art.heroImage?.sizes?.featureHero?.url) ||
                    decodeUrl(art.heroImage?.url) ||
                    '/media/missoula-hero-twilight.webp'
                  return (
                    <div 
                      key={art.id || art.slug} 
                      className="bg-white dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-sm overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 border-b border-warm-limestone/30">
                        <SafeImage
                          src={artImgUrl}
                          alt={art.heroImage?.alt || art.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                          fallbackSrc="/media/missoula-hero-twilight.webp"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <span className="font-mono text-[9px] text-aged-brass font-bold uppercase tracking-wider block mb-2">
                            {categoryLabel} Story
                          </span>
                          <Link href={`/articles/${art.slug}`}>
                            <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white leading-snug group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors hover:underline">
                              {art.title}
                            </h3>
                          </Link>
                        </div>
                        <div className="mt-6 pt-4 border-t border-warm-limestone/40 dark:border-warm-limestone/10 flex items-center justify-between">
                          <Link
                            href={`/articles/${art.slug}`}
                            className="text-xs font-mono font-bold uppercase tracking-widest text-deep-spruce dark:text-aged-brass hover:underline flex items-center gap-1"
                          >
                            Read Story &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Claim Listing Callout Box */}
          <div className="mt-16 bg-[#FAF7F2] dark:bg-slate-900/40 border-2 border-double border-warm-limestone/80 dark:border-warm-limestone/20 p-8 rounded-sm text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="max-w-[700px]">
              <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] uppercase font-bold block mb-2">
                Grow Your Business
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-spruce dark:text-white mb-2">
                Are you a local provider or tradesperson in the {categoryLabel} sector?
              </h3>
              <p className="text-xs sm:text-sm text-smoked-olive dark:text-ivory-paper/80 leading-relaxed font-normal">
                Missoula Legends is built to help local businesses connect with neighbors who appreciate quality. Adding your business is completely free and takes less than two minutes.
              </p>
            </div>
            <Link
              href="/claim"
              className="shrink-0 inline-flex items-center justify-center bg-deep-spruce hover:bg-oxblood-brown dark:bg-aged-brass dark:hover:bg-aged-brass/90 text-ivory-paper dark:text-soft-black font-mono text-xs uppercase tracking-widest font-bold px-6 py-4 rounded-sm transition-all active:scale-[0.98] shadow-md hover:shadow-lg w-full md:w-auto text-center"
            >
              Claim Your Free Listing
            </Link>
          </div>

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
