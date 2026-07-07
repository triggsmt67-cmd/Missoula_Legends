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

export function getBusinessSchemaType(category: string, businessName?: string): string {
  if (category === 'food-drink') {
    const titleLower = (businessName || '').toLowerCase()
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

  switch (category) {
    case 'shopping': return 'Store'
    case 'automotive': return 'AutoRepair'
    case 'auto-repair': return 'AutoRepair'
    case 'towing': return 'TowingService'
    case 'plumbing-hvac': return 'PlumbingService'
    case 'electrical': return 'Electrician'
    case 'septic-excavation': return 'HomeAndConstructionBusiness'
    case 'welding-fabrication': return 'HomeAndConstructionBusiness'
    case 'professional-services': return 'ProfessionalService'
    case 'health-wellness': return 'HealthAndBeautyBusiness'
    case 'home-lodging': return 'LodgingBusiness'
    case 'arts-culture': return 'EntertainmentBusiness'
    default: return 'LocalBusiness'
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

/**
 * Assembles the full JSON-LD payload array for a business profile page.
 * Outputs:
 *   [0] — Primary business entity (dynamic @type, full address, geo, sameAs, subjectOf)
 *   [1] — BreadcrumbList
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
  const schemaType = getBusinessSchemaType(item.category, item.businessName)
  const sameAs = buildBusinessSameAs(item)

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
    'description': getPlainText(item.description) || undefined,
    'url': profileUrl,
    ...(logoUrl ? { 'logo': { '@type': 'ImageObject', 'url': logoUrl } } : {}),
    'image': absoluteImageUrl,
    'telephone': item.contactInfo?.phone
      ? `tel:${(item.contactInfo.phone as string).replace(/[^\d+]/g, '')}`
      : undefined,
    'address': item.contactInfo?.address
      ? {
          '@type': 'PostalAddress',
          'streetAddress': item.contactInfo.address,
          'addressLocality': 'Missoula',
          'addressRegion': 'MT',
          'addressCountry': 'US',
        }
      : undefined,
    'geo':
      latitude && longitude
        ? { '@type': 'GeoCoordinates', 'latitude': latitude, 'longitude': longitude }
        : undefined,
    'sameAs': sameAs,
    'category': categoryLabel,
    'areaServed': { '@type': 'AdministrativeArea', 'name': neighborhoodLabel },
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

  return [primaryEntity, breadcrumb]
}
