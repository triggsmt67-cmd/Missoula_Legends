export function stripMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/^#+\s+/gm, '') // headings
    .replace(/^\s*[-*+]\s+/gm, '') // lists
    .replace(/^\s*>\s*/gm, '') // blockquotes
    .replace(/---/g, '') // horizontal rules
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/__(.*?)__/g, '$1') // bold
    .replace(/_(.*?)_/g, '$1') // italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // links
    .replace(/`([^`]+)`/g, '$1') // code inline
    .replace(/\n+/g, ' ') // newlines to spaces
    .replace(/\s+/g, ' ') // normalize spaces
    .trim()
}

export function getPlainText(data: any): string {
  if (!data) return ''
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('{"root"') || trimmed.startsWith('{"children"')) {
      try {
        const parsed = JSON.parse(trimmed)
        return getPlainText(parsed)
      } catch (e) {
        // Fallback to stripMarkdown if parse fails
      }
    }
    return stripMarkdown(data)
  }
  
  try {
    let text = ''
    const traverse = (node: any) => {
      if (!node) return
      if (node.text && typeof node.text === 'string') {
        text += node.text
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
    }
    
    if (data.root) {
      traverse(data.root)
    } else if (Array.isArray(data.children)) {
      data.children.forEach(traverse)
    }
    return stripMarkdown(text.trim())
  } catch (e) {
    console.error('Error extracting plain text from richText:', e)
    return ''
  }
}

const MEDIA_MAP: Record<string, string> = {
  'black-coffee.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/black-coffee.jpg',
  'rockin-rudys.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/rockin-rudys.jpg',
  'montgomery-distillery.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/montgomery-distillery-1.jpg',
  'montgomery-distillery-1.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/montgomery-distillery-1.jpg',
  'fact-and-fiction.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/fact-and-fiction.jpg',
  'burns-street-bistro.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/burns-street-bistro-1.jpg',
  'burns-street-bistro-1.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/burns-street-bistro-1.jpg',
  'missoula-curator.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-curator.jpg',
  'missoula-history-site.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-history-site-1.jpg',
  'missoula-history-site-1.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-history-site-1.jpg',
  'logo-rockin-rudys.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-rockin-rudys-1.png',
  'logo-rockin-rudys-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-rockin-rudys-1.png',
  'logo-roxy-theater.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-roxy-theater-1.png',
  'logo-roxy-theater-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-roxy-theater-1.png',
  'logo-big-dipper.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-big-dipper-1.png',
  'logo-big-dipper-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-big-dipper-1.png',
  'logo-le-petit-outre.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-le-petit-outre-1.png',
  'logo-le-petit-outre-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-le-petit-outre-1.png',
  'logo-runners-edge.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-runners-edge-1.png',
  'logo-runners-edge-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-runners-edge-1.png',
  'logo-radius-gallery.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-radius-gallery-1.png',
  'logo-radius-gallery-1.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/logo-radius-gallery-1.png',
  'Welder-Technician-Tools-935x572.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/Welder-Technician-Tools-935x572-1.jpg',
  'Welder-Technician-Tools-935x572-1.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/Welder-Technician-Tools-935x572-1.jpg',
  'placeholder.jpg': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-hero-twilight.png',
  'missoula-hero-twilight.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-hero-twilight.png',
  'missoula-hero-workbench.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-hero-workbench.png',
  'missoula-historical-map-panoramic.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-historical-map-panoramic.png',
  'missoula-pillar-people.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-pillar-people.png',
  'missoula-pillar-registry.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-pillar-registry.png',
  'missoula-pillar-steaks.png': 'https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com/missoula-pillar-steaks.png',
}

export function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const decoded = decodeURIComponent(url)
    const baseName = decoded.substring(decoded.lastIndexOf('/') + 1)
    const blobUrl = MEDIA_MAP[baseName]
    if (blobUrl) {
      return blobUrl
    }
    // Don't decode external URLs — return the original encoded URL
    // Only decode local /media/ paths for filesystem compatibility
    if (url.startsWith('http')) return url
    return decoded
  } catch (e) {
    const baseName = url.substring(url.lastIndexOf('/') + 1)
    const blobUrl = MEDIA_MAP[baseName]
    if (blobUrl) {
      return blobUrl
    }
    return url
  }
}

// ---------------------------------------------------------------------------
// FIX 1 — E.164 telephone formatting
// ---------------------------------------------------------------------------

/**
 * Formats a phone string to E.164 (+1XXXXXXXXXX).
 * Strips non-digits, removes leading US country digit, validates 10-digit national.
 * Returns undefined and logs a warning if the number is malformed.
 */
export function formatE164Phone(phone: string, businessName?: string): string | undefined {
  const digits = phone.replace(/[^\d]/g, '')
  const national = digits.startsWith('1') && digits.length === 11
    ? digits.slice(1)
    : digits
  if (national.length === 10) {
    return `+1${national}`
  }
  console.warn(
    `[schema-utils] Malformed phone for "${businessName || 'unknown'}": "${phone}" → ${digits} (${national.length} national digits, expected 10). Omitting telephone.`
  )
  return undefined
}

// ---------------------------------------------------------------------------
// FIX 2 — PostalAddress parsing
// ---------------------------------------------------------------------------

export interface ParsedAddress {
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

/**
 * Parses a combined US address string like "275 N Russell St, Missoula, MT 59801"
 * into its schema.org PostalAddress components.
 * Suite/unit designators ("Ste 200", "Unit B") remain in streetAddress.
 *
 * On parse failure:
 *   - Development: throws an error (halts build)
 *   - Production: logs an error and returns whatever components did parse
 */
export function parseAddress(address: string, businessName?: string): ParsedAddress | undefined {
  if (!address || !address.trim()) return undefined

  const trimmed = address.trim()

  // Pattern: "Street, City, ST ZIP" or "Street, City, ST"
  const match = trimmed.match(
    /^(.+?),\s*([A-Za-z\s.]+?),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/
  )

  if (match) {
    const result: ParsedAddress = {
      streetAddress: match[1].trim(),
      addressLocality: match[2].trim(),
      addressRegion: match[3].trim(),
      postalCode: (match[4] || '').trim(),
      addressCountry: 'US',
    }
    if (!result.postalCode) {
      console.warn(
        `[schema-utils] Address for "${businessName || 'unknown'}" parsed but missing postalCode: "${address}"`
      )
    }
    return result
  }

  // Parse failure — determine if this looks like a standard address that should have parsed
  const errorMsg = `[schema-utils] FAILED to parse address for "${businessName || 'unknown'}": "${address}"`
  const looksStandard = (trimmed.match(/,/g) || []).length >= 2

  if (looksStandard) {
    // Standard-looking address that failed to parse — likely a data issue
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMsg)
    }
    console.error(errorMsg)
  } else {
    // Non-standard address (directions, rural descriptions, etc.) — warn only
    console.warn(
      `[schema-utils] Non-standard address for "${businessName || 'unknown'}": "${address}" — emitting as streetAddress only.`
    )
  }

  // Attempt partial extraction from whatever components we can find
  const parts = trimmed.split(',')
  const partial: ParsedAddress = {
    streetAddress: looksStandard ? (parts[0]?.trim() || trimmed) : trimmed,
    addressLocality: looksStandard ? (parts[1]?.trim() || '') : '',
    addressRegion: 'MT',
    postalCode: '',
    addressCountry: 'US',
  }
  // Try to find a zip code anywhere in the string
  const zipMatch = trimmed.match(/(\d{5})(?:-\d{4})?/)
  if (zipMatch) partial.postalCode = zipMatch[1]
  // Try to find state abbreviation
  const stateMatch = trimmed.match(/\b([A-Z]{2})\b/)
  if (stateMatch) partial.addressRegion = stateMatch[1]

  return partial
}

// ---------------------------------------------------------------------------
// FIX 3 — Business schema type mapping with additionalType support
// ---------------------------------------------------------------------------

/** Lookup table: category slug → schema.org @type */
const CATEGORY_SCHEMA_MAP: Record<string, string> = {
  'food-drink': 'Restaurant', // refined below by business name
  'shopping': 'Store',
  'lifestyle': 'LocalBusiness', // fallback — gets additionalType
  'automotive': 'AutoRepair',
  'auto-repair': 'AutoRepair',
  'towing': 'TowingService',
  'plumbing-hvac': 'PlumbingService',
  'electrical': 'Electrician',
  'septic-excavation': 'HomeAndConstructionBusiness',
  'welding-fabrication': 'HomeAndConstructionBusiness',
  'professional-services': 'ProfessionalService',
  'health-wellness': 'HealthAndBeautyBusiness',
  'home-lodging': 'LodgingBusiness',
  'arts-culture': 'EntertainmentBusiness',
}

/**
 * additionalType URLs for categories that fall back to generic LocalBusiness.
 * These preserve type specificity when no exact schema.org subtype exists.
 */
const CATEGORY_ADDITIONAL_TYPE: Record<string, string> = {
  'lifestyle': 'https://schema.org/SportsActivityLocation',
}

export function getBusinessSchemaType(category: string, businessName?: string): string {
  const titleLower = (businessName || '').toLowerCase()

  if (category === 'food-drink') {
    if (titleLower.includes('ice cream') || titleLower.includes('gelato') || titleLower.includes('frozen yogurt')) {
      return 'IceCreamShop'
    }
    if (titleLower.includes('coffee') || titleLower.includes('roasters') || titleLower.includes('espresso') || titleLower.includes('cafe')) {
      return 'CafeOrCoffeeShop'
    }
    if (titleLower.includes('bakery') || titleLower.includes('baking') || titleLower.includes('patisserie')) {
      return 'Bakery'
    }
    if (
      titleLower.includes('brewery') ||
      titleLower.includes('distillery') ||
      titleLower.includes('pub') ||
      titleLower.includes('bar') ||
      titleLower.includes('taproom') ||
      titleLower.includes('saloon')
    ) {
      return 'BarOrPub'
    }
    return 'Restaurant'
  }

  // Name-based overrides for non-food categories
  if (titleLower.includes('outfitter') || titleLower.includes('sporting good') || titleLower.includes('outdoor gear')) {
    return 'SportingGoodsStore'
  }

  return CATEGORY_SCHEMA_MAP[category] || 'LocalBusiness'
}

/**
 * Returns the additionalType URL for categories that fall back to LocalBusiness,
 * or undefined if the @type is already a specific subtype.
 */
export function getBusinessAdditionalType(category: string): string | undefined {
  return CATEGORY_ADDITIONAL_TYPE[category]
}

/**
 * Logs the full category→@type mapping for build-time audit (CORRECTION 3c).
 * Called once during JSON-LD generation.
 */
let _categoryMappingLogged = false
export function logCategoryMapping(): void {
  if (_categoryMappingLogged) return
  _categoryMappingLogged = true
  console.log('[schema-utils] === Category → Schema.org @type Mapping ===')
  for (const [cat, type] of Object.entries(CATEGORY_SCHEMA_MAP)) {
    const additional = CATEGORY_ADDITIONAL_TYPE[cat]
    const suffix = additional ? ` (additionalType: ${additional})` : ''
    console.log(`  ${cat.padEnd(25)} → ${type}${suffix}`)
  }
}

export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export function parseOpeningHours(hoursStr?: string): OpeningHoursSpec[] | OpeningHoursSpec | undefined {
  if (!hoursStr) return undefined
  
  try {
    const specs: OpeningHoursSpec[] = []
    const parts = hoursStr.split(/[,;]/)
    
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayAbbrs = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    
    for (const part of parts) {
      const normalized = part.toLowerCase().replace(/\s+/g, '')
      if (!normalized) continue
      
      // Match day range (e.g. mon-fri, monday-friday, mon) and time range (8:00am-5:00pm)
      // Allows optional colon after days
      const match = normalized.match(/^(?:(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)(?:[-–](monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun))?:?)?(\d{1,2})(?::(\d{2}))?(am|pm)[-–](\d{1,2})(?::(\d{2}))?(am|pm)$/)
      
      if (match) {
        const startDayInput = match[1]
        const endDayInput = match[2]
        const startHour = parseInt(match[3])
        const startMin = match[4] || '00'
        const startAmpm = match[5]
        const endHour = parseInt(match[6])
        const endMin = match[7] || '00'
        const endAmpm = match[8]

        let dayOfWeek: string[] = []
        
        if (startDayInput) {
          const resolveDayIndex = (dayStr: string) => {
            let idx = dayAbbrs.indexOf(dayStr.slice(0, 3))
            if (idx === -1) idx = dayNames.indexOf(dayStr)
            return idx
          }
          
          const startIdx = resolveDayIndex(startDayInput)
          if (startIdx !== -1) {
            if (endDayInput) {
              const endIdx = resolveDayIndex(endDayInput)
              if (endIdx !== -1) {
                let curr = startIdx
                while (curr !== (endIdx + 1) % 7) {
                  dayOfWeek.push(dayNames[curr].charAt(0).toUpperCase() + dayNames[curr].slice(1))
                  curr = (curr + 1) % 7
                  if (curr === startIdx) break
                }
              }
            } else {
              dayOfWeek.push(dayNames[startIdx].charAt(0).toUpperCase() + dayNames[startIdx].slice(1))
            }
          }
        }
        
        if (dayOfWeek.length === 0) {
          dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }

        const formatTime = (hour: number, min: string, ampm: string) => {
          let h = hour
          if (ampm === 'pm' && h < 12) h += 12
          if (ampm === 'am' && h === 12) h = 0
          return `${h.toString().padStart(2, '0')}:${min}`
        }

        specs.push({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek,
          opens: formatTime(startHour, startMin, startAmpm),
          closes: formatTime(endHour, endMin, endAmpm),
        })
      }
    }
    
    if (specs.length === 1) return specs[0]
    if (specs.length > 1) return specs
  } catch (e) {
    console.warn('Error parsing opening hours:', e)
  }
  return undefined
}

// ---------------------------------------------------------------------------
// AEO JSON-LD Builders
// ---------------------------------------------------------------------------

const BASE_URL = 'https://www.missoulalegends.com'

/**
 * Builds the `sameAs` array for a directory listing.
 * Includes the business website, normalized Instagram URL, and Google Maps CID
 * URL when present in the payload.
 */
export function buildBusinessSameAs(item: any): string[] | undefined {
  const links = new Set<string>()

  if (item.contactInfo?.website) {
    const site = item.contactInfo.website as string
    links.add(site.startsWith('http') ? site : `https://${site}`)
  }

  const instagram = item.contactInfo?.instagram
  if (typeof instagram === 'string' && instagram.trim()) {
    const normalized = instagram.startsWith('http')
      ? instagram
      : `https://www.instagram.com/${instagram.replace(/^@/, '')}`
    links.add(normalized)
  }

  const cid = item.seoMetadata?.googleMapsCid
  if (typeof cid === 'string' && /^\d+$/.test(cid.trim())) {
    links.add(`https://www.google.com/maps?cid=${cid.trim()}`)
  }

  const result = Array.from(links).filter(Boolean)
  return result.length > 0 ? result : undefined
}

// ---------------------------------------------------------------------------
// FIX 5 — FAQPage schema builder
// ---------------------------------------------------------------------------

/**
 * Strips HTML tags from a string, then strips markdown, returning plain text.
 */
function stripHtmlAndMarkdown(text: string): string {
  if (!text) return ''
  // Strip HTML tags first
  const noHtml = text.replace(/<[^>]*>/g, '')
  return stripMarkdown(noHtml)
}

/**
 * Builds a FAQPage JSON-LD object from an array of FAQ items.
 * Returns null if no valid FAQs exist. Answer text is plain text (no HTML/markdown).
 */
export function buildFAQPageJsonLd(faqs: Array<{ question: string; answer: string }> | undefined | null): object | null {
  if (!faqs || faqs.length === 0) return null

  const validFaqs = faqs.filter(faq => faq.question?.trim() && faq.answer?.trim())
  if (validFaqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': validFaqs.map(faq => {
      // Defensive: strip embedded answer text from question field
      // (handles CMS data where Q/A blocks were stored combined)
      let questionText = faq.question.trim()
      const answerBleedIdx = questionText.search(/\s+A:\s/)
      if (answerBleedIdx > 0) {
        questionText = questionText.slice(0, answerBleedIdx).trim()
      }
      return {
        '@type': 'Question',
        'name': questionText,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': stripHtmlAndMarkdown(faq.answer),
        },
      }
    }),
  }
}

// ---------------------------------------------------------------------------
// FIX 4 — Short description fallback tracker
// ---------------------------------------------------------------------------

let _shortDescFallbackCount = 0
let _shortDescFallbackNames: string[] = []

/** Log a summary of profiles missing shortDescription (CORRECTION 4b). */
export function logShortDescriptionFallbackSummary(): void {
  if (_shortDescFallbackCount > 0) {
    console.warn(
      `[schema-utils] ${_shortDescFallbackCount} profile(s) missing shortDescription — schema/meta falling back to article lede: ${_shortDescFallbackNames.join(', ')}`
    )
  }
}

/**
 * Assembles the full JSON-LD payload array for a business profile page.
 * Outputs:
 *   [0] — Primary business entity (dynamic @type, full address, geo, sameAs, subjectOf)
 *   [1] — BreadcrumbList
 *   [2] — FAQPage (if FAQs exist)
 */
export function buildBusinessJsonLd({
  item,
  profileUrl,
  categoryLabel,
  neighborhoodLabel,
  absoluteImageUrl,
  relatedArticle,
  latitude,
  longitude,
}: {
  item: any
  profileUrl: string
  categoryLabel: string
  neighborhoodLabel: string
  absoluteImageUrl: string
  relatedArticle: any | null
  latitude: number | undefined
  longitude: number | undefined
}): object[] {
  // Log category mapping once for build-time audit (CORRECTION 3c)
  logCategoryMapping()

  const schemaType = getBusinessSchemaType(item.category, item.businessName)
  const additionalType = getBusinessAdditionalType(item.category)
  const sameAs = buildBusinessSameAs(item)

  // FIX 1 — E.164 telephone
  const telephone = item.contactInfo?.phone
    ? formatE164Phone(item.contactInfo.phone, item.businessName)
    : undefined

  // FIX 2 — Parsed PostalAddress
  let addressObj: object | undefined = undefined
  if (item.contactInfo?.address) {
    const parsed = parseAddress(item.contactInfo.address, item.businessName)
    if (parsed) {
      addressObj = {
        '@type': 'PostalAddress',
        'streetAddress': parsed.streetAddress,
        ...(parsed.addressLocality ? { 'addressLocality': parsed.addressLocality } : {}),
        'addressRegion': parsed.addressRegion,
        ...(parsed.postalCode ? { 'postalCode': parsed.postalCode } : {}),
        'addressCountry': parsed.addressCountry,
      }
    }
  }

  // FIX 4 — Short description preferred, fallback with warning
  let description: string | undefined
  if (item.shortDescription && typeof item.shortDescription === 'string' && item.shortDescription.trim()) {
    description = item.shortDescription.trim()
  } else {
    const fullText = getPlainText(item.description)
    description = fullText ? fullText.slice(0, 300) : undefined
    if (description) {
      _shortDescFallbackCount++
      _shortDescFallbackNames.push(item.businessName || 'unknown')
      console.warn(
        `[schema-utils] "${item.businessName}" missing shortDescription — falling back to truncated article lede for schema/meta.`
      )
    }
  }

  // subjectOf: full ItemPage object when a related editorial article exists
  let subjectOf: object | undefined = undefined
  if (relatedArticle?.slug) {
    const articleUrl = `${BASE_URL}/articles/${relatedArticle.slug}`
    subjectOf = {
      '@type': 'ItemPage',
      '@id': profileUrl,
      'url': profileUrl,
      'name': relatedArticle.title
        ? `${relatedArticle.title} | Missoula Legends`
        : 'Editorial Feature Story',
      'about': {
        '@type': schemaType,
        'name': item.businessName,
      },
      'mainEntity': {
        '@type': schemaType,
        '@id': `${profileUrl}#business`,
      },
      'sameAs': articleUrl,
    }
  }

  const logoUrl = item.logo?.url
    ? (item.logo.url.startsWith('http') ? item.logo.url : `${BASE_URL}${item.logo.url}`)
    : undefined

  const primaryEntity: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${profileUrl}#business`,
    'name': item.businessName,
    'description': description,
    'url': profileUrl,
    ...(logoUrl ? { 'logo': { '@type': 'ImageObject', 'url': logoUrl } } : {}),
    'image': absoluteImageUrl,
    'telephone': telephone,
    'address': addressObj,
    'geo':
      latitude && longitude
        ? { '@type': 'GeoCoordinates', 'latitude': latitude, 'longitude': longitude }
        : undefined,
    'sameAs': sameAs,
    // FIX 3 — additionalType for fallback categories, no more 'category' property
    ...(additionalType ? { 'additionalType': additionalType } : {}),
    ...(neighborhoodLabel ? { 'areaServed': { '@type': 'AdministrativeArea', 'name': neighborhoodLabel } } : {}),
    'employee': item.seoMetadata?.ownerName
      ? {
          '@type': 'Person',
          'name': item.seoMetadata.ownerName,
          'jobTitle': item.seoMetadata.ownerTitle || 'Owner',
        }
      : undefined,
    'openingHoursSpecification': parseOpeningHours(item.hours) || undefined,
    'mainEntityOfPage': { '@type': 'WebPage', '@id': profileUrl },
    'subjectOf': subjectOf,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Registry', 'item': `${BASE_URL}/directory` },
      { '@type': 'ListItem', 'position': 3, 'name': categoryLabel, 'item': `${BASE_URL}/directory/category/${item.category}` },
      { '@type': 'ListItem', 'position': 4, 'name': item.businessName, 'item': profileUrl },
    ],
  }

  // FIX 5 — FAQPage schema
  const faqSchema = buildFAQPageJsonLd(item.faqs)

  const result: object[] = [primaryEntity, breadcrumb]
  if (faqSchema) result.push(faqSchema)

  return result
}
