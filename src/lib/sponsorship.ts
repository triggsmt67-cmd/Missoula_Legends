import { getPayload } from 'payload'
import config from '@payload-config'
import 'server-only'
import { getPlainText } from '@/lib/schema-utils'

export type NormalizedSponsorData = {
  name: string
  monogram: string
  logoUrl?: string | null
  logoAlt?: string | null
  locationLabel: string
  categoryLabel: string
  ownershipLabel: string
  description: string
  ctaLabel: string
  destinationUrl: string
  supportMessage: string
}

export type NormalizedSponsorPlacement = {
  status: 'sponsored' | 'available' | 'disabled'
  placementKey: 'homepage-hero' | 'directory-category' | 'spotlight-program'
  recordCode: string
  categorySlug?: string | null
  sponsor?: NormalizedSponsorData | null
}

const CATEGORY_LABELS: Record<string, string> = {
  'food-drink': 'Food & Drink',
  'shopping': 'Local Goods & Shopping',
  'lifestyle': 'Lifestyle & Recreation',
  'automotive': 'Automotive',
  'auto-repair': 'Auto Repair & Service',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical Services',
  'towing': 'Towing & Recovery',
  'welding-fabrication': 'Welding & Fabrication',
}

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  'downtown': 'Downtown Missoula',
  'hip-strip': 'The Hip Strip',
  'slant-streets': 'Slant Streets',
  'university-district': 'University District',
  'northside': 'Northside',
  'westside': 'Westside',
  'rattlesnake': 'Rattlesnake',
  'grant-creek': 'Grant Creek',
  'orchard-homes-target-range': 'Orchard Homes',
  'rose-park': 'Rose Park',
  'miller-creek-linda-vista': 'Miller Creek',
  'south-hills': 'South Hills',
  'east-missoula': 'East Missoula',
  'bonner-milltown': 'Bonner-Milltown',
  'lolo': 'Lolo, MT',
  'wye': 'The Wye',
}

function getMonogram(name?: string | null): string {
  if (!name) return 'ML'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function generateDefaultRecordCode(placementKey: string, categorySlug?: string | null): string {
  if (placementKey === 'homepage-hero') return 'SP · 0001 · MISSOULA'
  if (placementKey === 'spotlight-program') return 'SP · SPOT · MISSOULA'
  if (placementKey === 'directory-category') {
    const code = categorySlug && categorySlug !== 'all' ? categorySlug.toUpperCase().slice(0, 4) : 'CAT'
    return `SP · ${code} · MISSOULA`
  }
  return 'SP · PARTNER · MISSOULA'
}

const developmentMockSponsor: NormalizedSponsorData = {
  name: 'Garden City Home Services',
  monogram: 'GC',
  logoUrl: null,
  logoAlt: 'Garden City Home Services',
  locationLabel: 'Serving Missoula',
  categoryLabel: 'Home & Trade Services',
  ownershipLabel: 'Locally Owned',
  description: 'Local people helping Missoula homeowners keep the places they love working well.',
  ctaLabel: 'Visit Community Partner',
  destinationUrl: 'https://example.com',
  supportMessage: 'This sponsorship supports free directory listings and independent local storytelling.',
}

/**
 * Server-side helper to retrieve the active normalized sponsor placement from Payload Globals
 */
export async function getActiveSponsorPlacement({
  placementKey,
  categorySlug,
}: {
  placementKey: 'homepage-hero' | 'directory-category' | 'spotlight-program'
  categorySlug?: string
}): Promise<NormalizedSponsorPlacement | null> {
  const isDev = process.env.NODE_ENV === 'development'
  const defaultCode = generateDefaultRecordCode(placementKey, categorySlug)

  const globalSlugMap = {
    'homepage-hero': 'hero-community-partner',
    'directory-category': 'category-sponsor-partner',
    'spotlight-program': 'spotlight-program-partner',
  } as const

  const globalSlug = globalSlugMap[placementKey]

  try {
    const payload = await getPayload({ config })
    const globalDoc = await payload.findGlobal({ slug: globalSlug, depth: 2 })

    if (globalDoc) {
      if (globalDoc.displayMode === 'disabled') {
        return null
      }

      // For category banners, check if it targets a specific category or 'all'
      if (placementKey === 'directory-category' && globalDoc.categorySlug && globalDoc.categorySlug !== 'all') {
        if (categorySlug && globalDoc.categorySlug !== categorySlug) {
          // If this global is targeted to a different specific category, show available for this category
          return {
            status: 'available',
            placementKey,
            recordCode: defaultCode,
            categorySlug,
            sponsor: null,
          }
        }
      }

      if (globalDoc.displayMode === 'available') {
        return {
          status: 'available',
          placementKey,
          recordCode: defaultCode,
          categorySlug,
          sponsor: null,
        }
      }

      if (globalDoc.displayMode === 'sponsored') {
        const now = new Date()

        // Check start and end dates
        if (globalDoc.startDate && new Date(globalDoc.startDate) > now) {
          return {
            status: 'available',
            placementKey,
            recordCode: defaultCode,
            categorySlug,
            sponsor: null,
          }
        }
        if (globalDoc.endDate && new Date(globalDoc.endDate) < now) {
          return {
            status: 'available',
            placementKey,
            recordCode: defaultCode,
            categorySlug,
            sponsor: null,
          }
        }

        // Unpack directory listing relation if present
        const listing =
          typeof globalDoc.directoryListing === 'object' && globalDoc.directoryListing !== null
            ? globalDoc.directoryListing
            : null

        const name = globalDoc.businessName || listing?.businessName || 'Community Partner'
        const monogram = globalDoc.monogram || getMonogram(name)

        const logoObj = globalDoc.logo || listing?.featuredImage || null
        const logoUrl = logoObj?.sizes?.thumbnail?.url || logoObj?.url || null
        const logoAlt = logoObj?.alt || `${name} logo`

        const locationLabel =
          globalDoc.locationLabel ||
          (listing?.neighborhood ? NEIGHBORHOOD_LABELS[listing.neighborhood] || listing.neighborhood : 'Missoula, MT')

        const categoryLabel =
          globalDoc.categoryLabel ||
          (listing?.category ? CATEGORY_LABELS[listing.category] || listing.category : 'Local Business')

        const ownershipLabel =
          globalDoc.ownershipLabel ||
          (listing?.seoMetadata?.ownerName ? `Founded by ${listing.seoMetadata.ownerName}` : 'Locally Owned')

        const description =
          getPlainText(globalDoc.description || listing?.description) ||
          'A local business helping keep Missoula informed and connected.'

        const defaultDestUrl =
          listing?.contactInfo?.website || (listing?.slug ? `/directory/${listing.slug}` : '#')

        const destinationUrl = globalDoc.ctaUrl || defaultDestUrl

        const ctaLabel =
          globalDoc.ctaLabel ||
          (destinationUrl.startsWith('http') ? 'Visit Community Partner' : 'Explore Profile')

        const supportMessage =
          globalDoc.supportMessage ||
          'This sponsorship supports free directory listings and independent local storytelling.'

        return {
          status: 'sponsored',
          placementKey,
          recordCode: defaultCode,
          categorySlug,
          sponsor: {
            name,
            monogram,
            logoUrl,
            logoAlt,
            locationLabel,
            categoryLabel,
            ownershipLabel,
            description,
            ctaLabel,
            destinationUrl,
            supportMessage,
          },
        }
      }
    }
  } catch {
    // Database connection failure or unseeded global during build
  }

  // Fallback behavior when database is offline or unconfigured
  if (isDev && placementKey === 'homepage-hero') {
    return {
      status: 'sponsored',
      placementKey: 'homepage-hero',
      recordCode: defaultCode,
      categorySlug,
      sponsor: developmentMockSponsor,
    }
  }

  return {
    status: 'available',
    placementKey,
    recordCode: defaultCode,
    categorySlug,
    sponsor: null,
  }
}
