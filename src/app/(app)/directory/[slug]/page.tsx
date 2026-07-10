import { getPayload } from 'payload'
import config from '@payload-config'
import { SafeImage } from '@/components/SafeImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { FeaturedImage } from '@/components/FeaturedImage'
import { Header } from '@/components/Header'
import { MapComponent } from '@/components/MapComponent'
import { decodeUrl, getBusinessSchemaType, getPlainText, parseOpeningHours, buildBusinessJsonLd, formatE164Phone, parseAddress, buildFAQPageJsonLd, getBusinessAdditionalType } from '@/lib/schema-utils'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { RichText } from '@/components/RichText'
import { ReadMoreDescription } from '@/components/ReadMoreDescription'
import { isPayloadConfigured } from '@/lib/runtime-config'

export const revalidate = 14400

const BASE_URL = 'https://www.missoulalegends.com'

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
  'tradesmen': 'Tradesmen',
}

/**
 * Extracts a display-friendly handle from a social media URL or returns the raw value.
 * e.g. "https://www.instagram.com/freedomenergymt/" → "@freedomenergymt"
 * e.g. "@freedomenergymt" → "@freedomenergymt"
 * e.g. "https://www.facebook.com/105865628165610" → "Facebook" (numeric IDs aren't readable)
 */
function formatSocialHandle(url: string, platform: 'instagram' | 'facebook' | 'linkedin'): { display: string; href: string } {
  const raw = url.trim()

  // Already a full URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const parsed = new URL(raw)
      const segments = parsed.pathname.split('/').filter(Boolean)
      const handle = segments[segments.length - 1] || ''

      // For Facebook/LinkedIn, numeric IDs aren't useful as display text
      if (platform === 'facebook') {
        return { display: /^\d+$/.test(handle) ? 'Facebook' : `@${handle}`, href: raw }
      }
      if (platform === 'linkedin') {
        return { display: /^\d+$/.test(handle) ? 'LinkedIn' : handle, href: raw }
      }
      // Instagram
      return { display: handle ? `@${handle}` : '@', href: raw }
    } catch {
      return { display: raw, href: raw }
    }
  }

  // Just a handle like "@freedomenergymt" or "freedomenergymt"
  const handle = raw.replace(/^@/, '')
  const domains = { instagram: 'https://instagram.com', facebook: 'https://facebook.com', linkedin: 'https://linkedin.com/in' }
  return { display: `@${handle}`, href: `${domains[platform]}/${handle}` }
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

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (isPayloadConfigured()) {
    try {
      const payload = await getPayload({ config })
      const res = await payload.find({
        collection: 'directory',
        depth: 0,
        limit: 1000,
        where: {
          listingStatus: {
            not_equals: 'unlisted',
          },
        },
      })

      return res.docs
        .map((doc: any) => doc.slug)
        .filter((slug: unknown): slug is string => typeof slug === 'string' && slug.length > 0)
        .map((slug) => ({ slug }))
    } catch (error) {
      console.warn('Unable to pre-render directory paths.', error)
    }
  }

  return []
}


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  if (!isPayloadConfigured()) {
    return {
      title: 'Business Profile',
      description: 'Local business details from the Missoula Legends registry.',
    }
  }
  
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
      if (item.listingStatus !== 'unlisted') {
        const neighborhoodLabel = item.neighborhood ? (NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood) : null
        const title = neighborhoodLabel
          ? `${item.businessName} | ${neighborhoodLabel} Missoula Directory`
          : `${item.businessName} | Missoula Directory`
        // FIX 4 — Use shortDescription for meta, fallback to truncated description
        let description: string
        if (item.shortDescription && typeof item.shortDescription === 'string' && item.shortDescription.trim()) {
          description = item.shortDescription.trim().slice(0, 160)
        } else {
          const plainText = getPlainText(item.description)
          if (plainText) {
            description = plainText.slice(0, 160)
            console.warn(
              `[meta] "${item.businessName}" missing shortDescription — falling back to truncated article lede for meta description.`
            )
          } else {
            description = neighborhoodLabel
              ? `Find details, address, website, and reviews for ${item.businessName} in the ${neighborhoodLabel} neighborhood of Missoula, Montana.`
              : `Find details, address, website, and reviews for ${item.businessName} in Missoula, Montana.`
          }
        }
        
        const imageUrl = item.featuredImage?.url
          ? (item.featuredImage.url.startsWith('http') ? item.featuredImage.url : `${BASE_URL}${item.featuredImage.url}`)
          : `${BASE_URL}/media/missoula-hero-twilight.webp`

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
    }
  } catch (e) {
    // fall through to generic metadata below
  }

  return {
    title: 'Business Profile',
    description: 'Local business details from the Missoula Legends registry.',
  }
}

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let item: any = null
  let neighboringBusinesses: any[] = []
  let relatedArticle: any = null
  if (!isPayloadConfigured()) {
    notFound()
  }

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
      const fetchedItem = res.docs[0] as any
      if (fetchedItem.listingStatus !== 'unlisted') {
        item = fetchedItem

        // Fetch related article (story) if exists
        const articleRes = await payload.find({
          collection: 'articles',
          where: {
            relatedBusiness: {
              equals: item.id,
            },
          },
          depth: 1,
          limit: 1,
        })
        if (articleRes.docs.length > 0) {
          relatedArticle = articleRes.docs[0]
        }

        const neighborsRes = await payload.find({
          collection: 'directory',
          depth: 1,
          overrideAccess: false,
          where: {
            and: [
              { neighborhood: { equals: item.neighborhood } },
              { slug: { not_equals: slug } },
              { listingStatus: { not_equals: 'unlisted' } }
            ]
          },
          limit: 3
        })
        neighboringBusinesses = neighborsRes.docs
      }
    }
  } catch (error: any) {
    if (isPayloadConfigured()) {
      console.warn('Unable to load business profile.', error.message)
    }
  }

  if (!item) {
    notFound()
  }

  const categoryLabel = CATEGORY_LABELS[item.category] || item.category
  const neighborhoodLabel = item.neighborhood ? (NEIGHBORHOOD_LABELS[item.neighborhood] || item.neighborhood) : null

  const itemImageUrl = decodeUrl(item.featuredImage?.sizes?.featureHero?.url) ||
    decodeUrl(item.featuredImage?.url) ||
    '/media/missoula-hero-twilight.webp'
  const absoluteImageUrl = itemImageUrl.startsWith('http') ? itemImageUrl : `${BASE_URL}${itemImageUrl}`
  const profileUrl = `${BASE_URL}/directory/${slug}`

  const latitude = item.seoMetadata?.latitude ? parseFloat(item.seoMetadata.latitude) : undefined
  const longitude = item.seoMetadata?.longitude ? parseFloat(item.seoMetadata.longitude) : undefined

  const jsonLd = buildBusinessJsonLd({
    item,
    profileUrl,
    categoryLabel,
    neighborhoodLabel,
    absoluteImageUrl,
    relatedArticle,
    latitude,
    longitude,
  })

  // Gracefully handle hours if it is somehow part of payload in the future, otherwise placeholder
  const businessHours = item.hours || null

  // Define Sidebar blocks as variables to avoid code duplication between mobile/desktop layouts
  const contactDetailsBlock = (
    <div className="bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-6 sm:p-8 rounded-sm shadow-sm flex flex-col gap-6">
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
              href={`tel:${item.contactInfo.phone.replace(/[^\d+]/g, '')}`}
              className="text-soft-black dark:text-ivory-paper hover:text-aged-brass transition-colors font-mono font-semibold"
            >
              {item.contactInfo.phone}
            </a>
          </div>
        )}

        {/* Instagram */}
        {item.contactInfo?.instagram && (() => {
          const ig = formatSocialHandle(item.contactInfo.instagram, 'instagram')
          return (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone block mb-1">Instagram</span>
              <a
                href={ig.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-soft-black dark:text-ivory-paper hover:text-aged-brass transition-colors font-mono font-semibold"
              >
                {ig.display}
              </a>
            </div>
          )
        })()}

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
          {businessHours ? (
            <div className="space-y-1">
              <p className="text-soft-black dark:text-ivory-paper font-medium leading-snug">
                {businessHours}
              </p>
              <p className="text-[11px] text-warm-stone dark:text-warm-stone/80 leading-normal italic">
                * Hours may vary. Contact business directly to confirm.
              </p>
            </div>
          ) : (
            <p className="text-soft-black dark:text-ivory-paper font-normal leading-snug italic">
              Contact business directly for current hours.
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const quickFactsBlock = item.quickFacts && item.quickFacts.length > 0 ? (
    <div className="bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-6 sm:p-8 rounded-sm shadow-sm flex flex-col gap-6">
      <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone flex items-center gap-2 pb-3 border-b border-warm-limestone/30 dark:border-warm-limestone/10">
        <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
        Quick Facts
      </h3>
      <ul className="flex flex-col gap-4 text-sm font-serif">
        {item.quickFacts.map((factObj: any, idx: number) => (
          <li key={idx} className="flex gap-2.5 items-start">
            <span className="text-aged-brass font-bold leading-none mt-1">✓</span>
            <span className="text-soft-black dark:text-ivory-paper font-normal leading-snug">
              {factObj.fact}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ) : null

  const mapBlock = item.contactInfo?.address ? (
    <div className="flex flex-col gap-3">
      <MapComponent address={item.contactInfo.address} businessName={item.businessName} />
    </div>
  ) : null

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
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b border-warm-limestone/40 dark:border-warm-limestone/10 py-12 md:py-16 text-center overflow-hidden">
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
            <Link href={`/directory/category/${item.category}`} className="hover:text-aged-brass transition-colors">{categoryLabel}</Link>
            <span>/</span>
            <span className="text-aged-brass font-bold">{item.businessName}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-serif font-normal tracking-tight text-deep-spruce dark:text-ivory-paper leading-[1.15] max-w-[850px] mx-auto mb-4">
            {item.businessName}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] sm:text-xs uppercase font-bold bg-[#FAF8F5]/80 dark:bg-blue-black/40 border border-warm-limestone/60 dark:border-warm-limestone/15 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              {categoryLabel}
            </span>
            {neighborhoodLabel && (
            <span className="font-mono text-deep-spruce dark:text-ivory-paper tracking-[0.1em] text-[10px] sm:text-xs uppercase font-bold bg-warm-limestone/40 dark:bg-slate-900/40 px-3.5 py-1.5 rounded-full">
              {neighborhoodLabel}
            </span>
            )}
          </div>

          {/* Neighborhood Context — editorial anchor shown when storytelling area differs from street address */}
          {item.neighborhoodContext && (
            <p className="text-xs sm:text-sm font-mono text-smoked-olive dark:text-ivory-paper/60 tracking-wide italic mt-3">
              {item.neighborhoodContext}
            </p>
          )}

          {/* Why It's Listed - High Impact Above the Fold */}
          {item.whyItsListed && (
            <div className="max-w-[750px] mx-auto mt-8 bg-white/40 dark:bg-slate-900/25 border-l-4 border-aged-brass p-5 rounded-r text-left shadow-sm backdrop-blur-sm">
              <h3 className="font-mono text-[9px] uppercase tracking-widest font-bold text-aged-brass mb-2 flex items-center gap-1.5">
                <span>★</span> Why It's Listed
              </h3>
              <p className="font-serif italic text-base sm:text-lg leading-relaxed text-soft-black dark:text-ivory-paper/90">
                &ldquo;{item.whyItsListed}&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1200px] mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Business Story / Image (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col w-full text-left">
            {/* Featured Image - Matted Frame */}
              <div className="p-3 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md relative mb-8 w-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#faf8f5] dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10">
                  <FeaturedImage
                    src={itemImageUrl}
                    alt={item.featuredImage?.alt || item.businessName}
                    businessName={item.businessName}
                    category={item.category}
                  />
                </div>
              </div>

            {/* Description / Summary */}
            <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl max-w-none text-left">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-spruce dark:text-ivory-paper tracking-tight mb-6">
                About the Business
              </h2>
              {item.description ? (
                (() => {
                  const plainText = getPlainText(item.description)
                  const wordCount = plainText.split(/\s+/).filter(Boolean).length
                  const isExpandable = wordCount > 300

                  const renderedContent = typeof item.description === 'string' ? (
                    item.description.trim().startsWith('{"root"') ? (
                      (() => {
                        try {
                          const parsed = JSON.parse(item.description)
                          return (
                            <RichText
                              data={parsed}
                              className="text-soft-black dark:text-ivory-paper/85 font-serif text-lg md:text-xl
                                [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-deep-spruce [&_h2]:dark:text-ivory-paper [&_h2]:mt-8 [&_h2]:mb-4
                                [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-deep-spruce [&_h3]:dark:text-ivory-paper [&_h3]:mt-6 [&_h3]:mb-3
                                [&_p]:text-lg [&_p]:md:text-xl [&_p]:leading-relaxed [&_p]:font-serif [&_p]:text-soft-black [&_p]:dark:text-ivory-paper/85 [&_p]:mb-6
                                [&_blockquote]:border-l-4 [&_blockquote]:border-aged-brass/70 [&_blockquote]:pl-6 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-smoked-olive [&_blockquote]:dark:text-ivory-paper/80 [&_blockquote]:bg-warm-limestone/5 [&_blockquote]:dark:bg-slate-900/10 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r
                                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
                                [&_li]:text-soft-black [&_li]:dark:text-ivory-paper/85 [&_li]:leading-relaxed
                                [&_hr]:border-t [&_hr]:border-warm-limestone/40 [&_hr]:dark:border-warm-limestone/15 [&_hr]:my-8"
                            />
                          )
                        } catch (e) {
                          return <MarkdownRenderer text={item.description} />
                        }
                      })()
                    ) : (
                      <MarkdownRenderer text={item.description} />
                    )
                  ) : (
                    <RichText
                      data={item.description}
                      className="text-soft-black dark:text-ivory-paper/85 font-serif text-lg md:text-xl
                        [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-deep-spruce [&_h2]:dark:text-ivory-paper [&_h2]:mt-8 [&_h2]:mb-4
                        [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-deep-spruce [&_h3]:dark:text-ivory-paper [&_h3]:mt-6 [&_h3]:mb-3
                        [&_p]:text-lg [&_p]:md:text-xl [&_p]:leading-relaxed [&_p]:font-serif [&_p]:text-soft-black [&_p]:dark:text-ivory-paper/85 [&_p]:mb-6
                        [&_blockquote]:border-l-4 [&_blockquote]:border-aged-brass/70 [&_blockquote]:pl-6 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-smoked-olive [&_blockquote]:dark:text-ivory-paper/80 [&_blockquote]:bg-warm-limestone/5 [&_blockquote]:dark:bg-slate-900/10 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
                        [&_li]:text-soft-black [&_li]:dark:text-ivory-paper/85 [&_li]:leading-relaxed
                        [&_hr]:border-t [&_hr]:border-warm-limestone/40 [&_hr]:dark:border-warm-limestone/15 [&_hr]:my-8"
                    />
                  )

                  return isExpandable ? (
                    <ReadMoreDescription>{renderedContent}</ReadMoreDescription>
                  ) : (
                    renderedContent
                  )
                })()
              ) : (
                <p className="text-warm-stone italic font-serif">
                  No editorial description has been published for this listing yet.
                </p>
              )}
            </div>

            {/* Mobile-only Sidebar Blocks (underneath About the Business) */}
            <div className="lg:hidden mt-10 flex flex-col gap-8 w-full">
              {contactDetailsBlock}
              {quickFactsBlock}
              {mapBlock}
            </div>

            {/* Services Offered */}
            {item.services && item.services.length > 0 && (
              <div className="mt-12 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 text-left">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-spruce dark:text-ivory-paper tracking-tight mb-6">
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {item.services.map((svc: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 bg-white dark:bg-blue-black/20 border border-warm-limestone/40 dark:border-warm-limestone/10 p-3.5 rounded shadow-sm hover:shadow-md hover:border-aged-brass/35 transition-all duration-300"
                    >
                      <span className="flex-shrink-0 h-2 w-2 rounded-full bg-aged-brass" />
                      <span className="font-serif text-base text-soft-black dark:text-warm-stone/95">
                        {svc.service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {item.faqs && item.faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 text-left">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-spruce dark:text-ivory-paper tracking-tight mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-4">
                  {item.faqs.map((faq: any, idx: number) => (
                    <details
                      key={idx}
                      className="group bg-white dark:bg-blue-black/20 border border-warm-limestone/40 dark:border-warm-limestone/10 rounded shadow-sm hover:shadow-md hover:border-aged-brass/35 transition-all duration-300"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 list-none">
                        <span className="font-serif text-base font-semibold text-deep-spruce dark:text-ivory-paper leading-snug">
                          {faq.question}
                        </span>
                        <span className="flex-shrink-0 h-5 w-5 rounded-full border border-aged-brass/50 text-aged-brass flex items-center justify-center text-xs font-bold transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pt-1">
                        <p className="font-serif text-base text-smoked-olive dark:text-ivory-paper/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Related Story Preview */}
            {relatedArticle && (
              <div className="mt-16 pt-8 border-t border-warm-limestone/40 dark:border-warm-limestone/15 text-left">
                <span className="font-mono text-aged-brass tracking-[0.2em] text-[10px] uppercase font-bold mb-3 block">
                  Featured Story
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-spruce dark:text-ivory-paper tracking-tight mb-6">
                  The Legend's Story
                </h2>
                
                <div className="bg-white dark:bg-blue-black/20 border border-warm-limestone/60 dark:border-warm-limestone/15 p-6 rounded shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-center">
                  {relatedArticle.heroImage && (
                    <div className="relative w-full md:w-1/3 aspect-[4/3] rounded overflow-hidden flex-shrink-0 border border-warm-limestone/30 dark:border-warm-limestone/10 bg-[#FAF8F5] dark:bg-slate-900">
                      <SafeImage
                        src={decodeUrl(relatedArticle.heroImage?.sizes?.thumbnail?.url) || decodeUrl(relatedArticle.heroImage?.url) || '/media/missoula-hero-twilight.webp'}
                        alt={relatedArticle.heroImage?.alt || relatedArticle.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 250px"
                        fallbackSrc="/media/missoula-hero-twilight.webp"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col items-start">
                    <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white leading-snug mb-3">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-smoked-olive dark:text-warm-stone/90 font-serif leading-relaxed mb-4">
                      {(() => {
                        const plainText = getPlainText(relatedArticle.content) || ''
                        return plainText.length > 220 ? plainText.slice(0, 220) + '...' : plainText
                      })()}
                    </p>
                    <Link
                      href={`/articles/${relatedArticle.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#2c4c47] dark:text-aged-brass hover:text-oxblood-brown dark:hover:text-aged-brass/80 transition-colors underline"
                    >
                      Read the Full Story &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Claim/Update CTA Box */}
            <div className="mt-16 bg-gradient-to-br from-[#faf8f4] to-[#f5f2e9] dark:from-slate-900/40 dark:to-slate-950/40 border border-warm-limestone/65 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-left flex-1">
                <h3 className="font-serif text-xl font-bold text-deep-spruce dark:text-white leading-snug">
                  Claim or Update this Business Profile
                </h3>
                <p className="text-sm text-smoked-olive dark:text-ivory-paper/78 mt-2 max-w-xl leading-relaxed">
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

          {/* Right Column: Sticky Sidebar / Directory details (1/3 width) - Desktop only */}
          <aside className="hidden lg:flex lg:col-span-4 lg:sticky lg:top-28 flex-col gap-8 text-left w-full">
            {contactDetailsBlock}
            {quickFactsBlock}
            {mapBlock}
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
              Neighboring Legends{neighborhoodLabel ? ` in ${neighborhoodLabel}` : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {neighboringBusinesses.map((neighbor: any) => {
                const neighborImg = decodeUrl(neighbor.featuredImage?.sizes?.thumbnail?.url) ||
                  decodeUrl(neighbor.featuredImage?.url) ||
                  ''
                const neighborCat = CATEGORY_LABELS[neighbor.category] || neighbor.category
                return (
                  <div 
                    key={neighbor.id} 
                    className="bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm p-5 shadow-sm hover:shadow transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10 mb-4">
                        <FeaturedImage
                          src={neighborImg}
                          alt={neighbor.featuredImage?.alt || neighbor.businessName}
                          businessName={neighbor.businessName}
                          category={neighbor.category}
                          priority={false}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-mono text-[9px] text-aged-brass font-bold uppercase tracking-wider block mb-1">
                        {neighborCat}
                      </span>
                      <Link href={`/directory/${neighbor.slug}`}>
                        <h3 className="font-serif text-lg font-bold text-deep-spruce dark:text-white leading-snug hover:underline">
                          {neighbor.businessName}
                        </h3>
                      </Link>
                      <p className="text-xs text-smoked-olive dark:text-ivory-paper/76 mt-2 line-clamp-3 font-serif">
                        {getPlainText(neighbor.description)}
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
