import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MapComponent } from '@/components/MapComponent'
import { seedDirectory } from '../../../../data/seedData.js'
import { decodeUrl, getBusinessSchemaType } from '@/lib/schema-utils'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://missoulalegends.com'

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

const getSeedSlug = (businessName: string) => {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    
    if (res.docs.length > 0) {
      const item = res.docs[0] as any
      const categoryLabel = CATEGORY_LABELS[item.category] || item.category
      const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood
      const title = `${item.businessName} | ${neighborhoodLabel} Missoula Directory`
      const description = item.description 
        ? item.description.slice(0, 160)
        : `Find details, address, website, and reviews for ${item.businessName} in the ${neighborhoodLabel} neighborhood of Missoula, Montana.`
      
      const imageUrl = item.featuredImage?.url
        ? (item.featuredImage.url.startsWith('http') ? item.featuredImage.url : `${BASE_URL}${item.featuredImage.url}`)
        : `${BASE_URL}/media/missoula-hero-twilight.png`

      return {
        title,
        description,
        alternates: { canonical: `/directory/${slug}` },
        openGraph: {
          type: 'website',
          url: `${BASE_URL}/directory/${slug}`,
          title: `${item.businessName} - Missoula Legends`,
          description,
          images: [{ url: imageUrl, width: 1200, height: 630, alt: item.featuredImage?.alt || item.businessName }],
          siteName: 'Missoula Legends',
        },
        twitter: {
          card: 'summary_large_image',
          title: item.businessName,
          description,
          images: [imageUrl],
        },
      }
    }
  } catch (e) {
    // fallback below
  }
  
  // Fallback for seed data or DB failures
  const seedItem = seedDirectory.find((a: any) => getSeedSlug(a.businessName) === slug)
  if (seedItem) {
    const categoryLabel = CATEGORY_LABELS[seedItem.category] || seedItem.category
    const neighborhoodLabel = NEIGHBORHOOD_LABELS[seedItem.neighborhood] || seedItem.neighborhood
    const title = `${seedItem.businessName} | ${neighborhoodLabel} Missoula Directory`
    return {
      title,
      description: seedItem.description || `Browse ${seedItem.businessName} in Missoula, Montana.`,
      alternates: { canonical: `/directory/${slug}` },
    }
  }
  
  return {
    title: 'Business Profile | Missoula Legends',
    description: 'Local business details from the Missoula Legends registry.',
  }
}

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let item: any = null
  let neighboringBusinesses: any[] = []

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
    })

    if (res.docs.length > 0) {
      item = res.docs[0]

      const neighborsRes = await payload.find({
        collection: 'directory',
        depth: 1,
        overrideAccess: false,
        where: {
          and: [
            { neighborhood: { equals: item.neighborhood } },
            { slug: { not_equals: slug } }
          ]
        },
        limit: 3
      })
      neighboringBusinesses = neighborsRes.docs
    }
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    // Fallback to seed data if database fails
    const seedItem = seedDirectory.find(a => getSeedSlug(a.businessName) === slug)
    if (seedItem) {
      item = {
        ...seedItem,
        featuredImage: {
          url: `/media/${seedItem.mediaKey}`,
          alt: seedItem.businessName,
        },
        id: `seed_${slug}`,
      }

      const neighborsList = seedDirectory.filter(
        (biz: any) => biz.neighborhood === item.neighborhood && getSeedSlug(biz.businessName) !== slug
      )
      neighboringBusinesses = neighborsList.slice(0, 3).map((listing: any, idx: number) => ({
        id: `neighbor_${idx}`,
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
        slug: getSeedSlug(listing.businessName),
      }))
    }
  }

  if (!item) {
    notFound()
  }

  const categoryLabel = CATEGORY_LABELS[item.category] || item.category
  const neighborhoodLabel = NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood

  const itemImageUrl = decodeUrl(item.featuredImage?.sizes?.featureHero?.url) ||
    decodeUrl(item.featuredImage?.url) ||
    '/media/missoula-hero-twilight.png'
  const absoluteImageUrl = itemImageUrl.startsWith('http') ? itemImageUrl : `${BASE_URL}${itemImageUrl}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': getBusinessSchemaType(item.category),
      'name': item.businessName,
      'description': item.description || undefined,
      'image': absoluteImageUrl,
      'address': item.contactInfo?.address ? {
        '@type': 'PostalAddress',
        'streetAddress': item.contactInfo.address,
        'addressLocality': 'Missoula',
        'addressRegion': 'MT',
        'addressCountry': 'US'
      } : undefined,
      'telephone': item.contactInfo?.phone || undefined,
      'url': item.contactInfo?.website || undefined,
      'category': categoryLabel,
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': neighborhoodLabel
      }
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
          'name': 'Registry',
          'item': 'https://missoulalegends.com/directory',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': item.businessName,
          'item': `https://missoulalegends.com/directory/${slug}`,
        },
      ],
    }
  ]

  // Gracefully handle hours if it is somehow part of payload in the future, otherwise placeholder
  const businessHours = item.hours || null

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header Navigation */}
      <Header />

      {/* Profile Header Banner */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-16 md:py-24 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[950px] mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-mono text-warm-stone/80">
            <Link href="/directory" className="hover:text-aged-brass transition-colors">Registry</Link>
            <span>/</span>
            <span className="text-aged-brass font-bold">{categoryLabel}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-serif font-normal tracking-tight text-deep-spruce dark:text-ivory-paper leading-[1.15] max-w-[850px] mx-auto mb-4">
            {item.businessName}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold bg-[#FAF8F5]/80 dark:bg-blue-black/40 border border-warm-limestone/60 dark:border-warm-limestone/15 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              {categoryLabel}
            </span>
            <span className="font-mono text-deep-spruce dark:text-ivory-paper tracking-[0.1em] text-[10px] sm:text-xs uppercase font-bold bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
              {neighborhoodLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Business Story / Image (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col w-full text-left">
            {/* Featured Image - Matted Frame */}
            {item.featuredImage && (
              <div className="p-3 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md relative mb-10 w-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#faf8f5] dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10">
                  <Image
                    src={itemImageUrl}
                    alt={item.featuredImage.alt || item.businessName}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                    className="object-cover object-center scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
                  />
                </div>
              </div>
            )}

            {/* Description / Summary */}
            <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl max-w-none text-left">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-spruce dark:text-ivory-paper tracking-tight mb-6">
                About the Business
              </h2>
              {item.description ? (
                <p className="text-soft-black dark:text-warm-stone/95 leading-relaxed font-serif whitespace-pre-line text-lg md:text-xl">
                  {item.description}
                </p>
              ) : (
                <p className="text-warm-stone italic font-serif">
                  No editorial description has been published for this listing yet.
                </p>
              )}
            </div>

            {/* Claim/Update CTA Box */}
            <div className="mt-16 bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-left flex-1">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white leading-snug">
                  Claim or Update this Business Profile
                </h3>
                <p className="text-sm text-smoked-olive dark:text-warm-stone mt-2 max-w-xl leading-relaxed">
                  Are you the owner or manager of {item.businessName}? Keep your listing updated, submit changes to hours or contact details, or request removals at any time.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <Link
                  href={`/business-update?business=${encodeURIComponent(item.businessName)}`}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-ivory-paper bg-deep-spruce hover:bg-oxblood-brown dark:bg-[#203633] dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black border border-deep-spruce/20 dark:border-aged-brass/35 px-5 py-3 rounded-sm transition-all duration-300 w-full text-center shadow-sm hover:shadow"
                >
                  Request Update &rarr;
                </Link>
              </div>
            </div>

            {/* Back to Directory Link */}
            <div className="mt-12 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15">
              <Link 
                href="/directory" 
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Registry
              </Link>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar / Directory details (1/3 width) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-8 text-left">
            
            {/* Quick Contact & Details */}
            <div className="bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone flex items-center gap-2 pb-3 border-b border-warm-limestone/30 dark:border-warm-limestone/10">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Contact Details
              </h3>

              <div className="flex flex-col gap-4 text-sm font-serif">
                {/* Website */}
                {item.contactInfo?.website && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Website</span>
                    <a
                      href={item.contactInfo.website.startsWith('http') ? item.contactInfo.website : `https://${item.contactInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-deep-spruce dark:text-aged-brass hover:text-oxblood-brown dark:hover:text-aged-brass/80 transition-colors font-semibold underline truncate block"
                    >
                      {item.contactInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}

                {/* Phone */}
                {item.contactInfo?.phone && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Phone Number</span>
                    <a
                      href={`tel:${item.contactInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-soft-black dark:text-ivory-paper hover:text-aged-brass transition-colors font-mono font-semibold"
                    >
                      {item.contactInfo.phone}
                    </a>
                  </div>
                )}

                {/* Instagram */}
                {item.contactInfo?.instagram && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Instagram</span>
                    <a
                      href={`https://instagram.com/${item.contactInfo.instagram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-soft-black dark:text-ivory-paper hover:text-aged-brass transition-colors font-mono font-semibold"
                    >
                      {item.contactInfo.instagram.startsWith('@') ? item.contactInfo.instagram : `@${item.contactInfo.instagram}`}
                    </a>
                  </div>
                )}

                {/* Address */}
                {item.contactInfo?.address && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Address</span>
                    <p className="text-soft-black dark:text-ivory-paper font-normal leading-snug">
                      {item.contactInfo.address}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.contactInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold uppercase tracking-widest text-[#2c4c47] dark:text-aged-brass hover:text-oxblood-brown dark:hover:text-aged-brass/80 transition-colors inline-flex items-center gap-1 mt-2 underline"
                    >
                      Open in Google Maps &rarr;
                    </a>
                  </div>
                )}

                {/* Hours */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Hours</span>
                  <p className="text-soft-black dark:text-ivory-paper font-normal leading-snug italic">
                    {businessHours || 'Contact business directly for current hours.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map component */}
            {item.contactInfo?.address && (
              <div className="flex flex-col gap-3">
                <MapComponent address={item.contactInfo.address} businessName={item.businessName} />
              </div>
            )}
          </aside>

        </div>
      </main>

      {/* Neighboring Legends Section */}
      {neighboringBusinesses && neighboringBusinesses.length > 0 && (
        <section className="bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border-t border-b border-warm-limestone/40 dark:border-warm-limestone/15 py-16 text-left">
          <div className="max-w-[1200px] mx-auto px-6">
            <span className="font-mono text-aged-brass tracking-[0.25em] text-[10px] uppercase font-bold mb-4 block">
              Explore the Neighborhood
            </span>
            <h2 className="text-3xl font-serif font-bold text-deep-spruce dark:text-white mb-8">
              Neighboring Legends in {neighborhoodLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {neighboringBusinesses.map((neighbor: any) => {
                const neighborImg = decodeUrl(neighbor.featuredImage?.sizes?.thumbnail?.url) ||
                  decodeUrl(neighbor.featuredImage?.url) ||
                  '/media/missoula-hero-twilight.png'
                const neighborCat = CATEGORY_LABELS[neighbor.category] || neighbor.category
                return (
                  <div 
                    key={neighbor.id} 
                    className="bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm p-5 shadow-sm hover:shadow transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      {neighbor.featuredImage && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10 mb-4">
                          <img
                            src={neighborImg}
                            alt={neighbor.featuredImage.alt || neighbor.businessName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <span className="font-mono text-[9px] text-aged-brass font-bold uppercase tracking-wider block mb-1">
                        {neighborCat}
                      </span>
                      <Link href={`/directory/${neighbor.slug}`}>
                        <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white leading-snug hover:underline">
                          {neighbor.businessName}
                        </h3>
                      </Link>
                      <p className="text-xs text-smoked-olive dark:text-warm-stone/85 mt-2 line-clamp-3 font-serif">
                        {neighbor.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-warm-limestone/40 dark:border-warm-limestone/10 flex items-center justify-between">
                      <Link
                        href={`/directory/${neighbor.slug}`}
                        className="text-xs font-mono font-bold uppercase tracking-wider text-deep-spruce dark:text-aged-brass hover:underline"
                      >
                        View Profile &rarr;
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}
