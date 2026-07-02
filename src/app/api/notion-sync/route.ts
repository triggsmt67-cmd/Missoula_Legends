import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

// Strict mapping tables for selects/enums
const categoryMap: Record<string, string> = {
  'food & drink': 'food-drink',
  'food and drink': 'food-drink',
  'food-drink': 'food-drink',
  'shopping': 'shopping',
  'lifestyle': 'lifestyle',
  'automotive': 'automotive',
  'professional services': 'professional-services',
  'professional-services': 'professional-services',
  'health & wellness': 'health-wellness',
  'health and wellness': 'health-wellness',
  'health-wellness': 'health-wellness',
  'arts & culture': 'arts-culture',
  'arts and culture': 'arts-culture',
  'arts-culture': 'arts-culture',
  'home & lodging': 'home-lodging',
  'home and lodging': 'home-lodging',
  'home-lodging': 'home-lodging',
  'septic & excavation': 'septic-excavation',
  'septic and excavation': 'septic-excavation',
  'septic-excavation': 'septic-excavation',
  'auto repair': 'auto-repair',
  'auto-repair': 'auto-repair',
  'plumbing & hvac': 'plumbing-hvac',
  'plumbing and hvac': 'plumbing-hvac',
  'plumbing-hvac': 'plumbing-hvac',
  'electrical': 'electrical',
  'towing': 'towing',
  'welding & fabrication': 'welding-fabrication',
  'welding and fabrication': 'welding-fabrication',
  'welding-fabrication': 'welding-fabrication',
}

const statusMap: Record<string, 'research' | 'draft-ready' | 'in-edit' | 'published'> = {
  'research': 'research',
  'draft ready': 'draft-ready',
  'draft-ready': 'draft-ready',
  'in edit': 'in-edit',
  'in-edit': 'in-edit',
  'published': 'published',
}

const cityMap: Record<string, 'missoula' | 'great-falls' | 'billings' | 'helena' | 'bozeman' | 'kalispell' | 'lolo' | 'other'> = {
  'missoula': 'missoula',
  'great falls': 'great-falls',
  'great-falls': 'great-falls',
  'billings': 'billings',
  'helena': 'helena',
  'bozeman': 'bozeman',
  'kalispell': 'kalispell',
  'lolo': 'lolo',
  'other': 'other',
}

const gradeMap: Record<string, 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F' | 'Pending'> = {
  'a': 'A',
  'a-': 'A-',
  'b+': 'B+',
  'b': 'B',
  'b-': 'B-',
  'c+': 'C+',
  'c': 'C',
  'c-': 'C-',
  'd': 'D',
  'f': 'F',
  'pending': 'Pending',
}

/**
 * Defensive extraction helper to handle standard string property payloads
 * as well as standard nested Notion property structures (rich_text, title, select, etc.).
 */
function extractNotionValue(prop: any): string {
  if (!prop) return ''
  if (typeof prop === 'string') return prop
  if (typeof prop === 'number') return String(prop)
  if (typeof prop === 'boolean') return String(prop)

  // Notion API property types
  if (prop.type === 'title' && Array.isArray(prop.title)) {
    return prop.title.map((t: any) => t.plain_text || t.text?.content || '').join('').trim()
  }
  if (prop.type === 'rich_text' && Array.isArray(prop.rich_text)) {
    return prop.rich_text.map((t: any) => t.plain_text || t.text?.content || '').join('').trim()
  }
  if (prop.type === 'select' && prop.select) {
    return prop.select.name || ''
  }
  if (prop.type === 'phone_number') {
    return prop.phone_number || ''
  }
  if (prop.type === 'url') {
    return prop.url || ''
  }
  if (prop.type === 'email') {
    return prop.email || ''
  }
  if (prop.type === 'date' && prop.date) {
    return prop.date.start || ''
  }
  if (prop.type === 'number') {
    return prop.number !== null ? String(prop.number) : ''
  }
  if (prop.type === 'checkbox') {
    return String(prop.checkbox)
  }

  // Handle arrays or sub-objects
  if (Array.isArray(prop)) {
    return prop.map(item => extractNotionValue(item)).join('').trim()
  }
  if (prop.plain_text) return prop.plain_text
  if (prop.name) return prop.name
  if (prop.content) return prop.content

  return ''
}

/**
 * Parses a string list (comma, semicolon, or newline separated) or JSON array into schema-compliant facts.
 */
function parseQuickFacts(val: any): { fact: string }[] {
  if (!val) return []
  const textVal = typeof val === 'string' ? val : extractNotionValue(val)
  if (!textVal) return []

  const trimmed = textVal.trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({ fact: String(item).trim() })).filter(f => f.fact)
      }
    } catch (e) {}
  }

  const splitChar = textVal.includes('\n') ? '\n' : textVal.includes(';') ? ';' : ','
  return textVal
    .split(splitChar)
    .map((item: string) => ({ fact: item.replace(/^[-*•]\s*/, '').trim() }))
    .filter(f => f.fact)
}

/**
 * Parses a string list (comma, semicolon, or newline separated) or JSON array into schema-compliant services.
 */
function parseServices(val: any): { service: string }[] {
  if (!val) return []
  const textVal = typeof val === 'string' ? val : extractNotionValue(val)
  if (!textVal) return []

  const trimmed = textVal.trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({ service: String(item).trim() })).filter(s => s.service)
      }
    } catch (e) {}
  }

  const splitChar = textVal.includes('\n') ? '\n' : textVal.includes(';') ? ';' : ','
  return textVal
    .split(splitChar)
    .map((item: string) => ({ service: item.replace(/^[-*•]\s*/, '').trim() }))
    .filter(s => s.service)
}

/**
 * Parses structured text blocks (Q: ... A: ...) or JSON arrays into schema-compliant FAQs.
 */
function parseFAQs(val: any): { question: string; answer: string }[] {
  if (!val) return []
  const textVal = typeof val === 'string' ? val : extractNotionValue(val)
  if (!textVal) return []

  const trimmed = textVal.trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .map((item: any) => ({
            question: String(item.question || item.q || '').trim(),
            answer: String(item.answer || item.a || '').trim(),
          }))
          .filter(f => f.question && f.answer)
      }
    } catch (e) {}
  }

  const faqsList: { question: string; answer: string }[] = []
  const blocks = trimmed.split(/(?:^|\n)(?=Q:|Question:)/i)
  for (const block of blocks) {
    const qMatch = block.match(/(?:Q:|Question:)\s*([\s\S]*?)(?=\n(?:A:|Answer:)|$)/i)
    const aMatch = block.match(/(?:A:|Answer:)\s*([\s\S]*)/i)
    if (qMatch && aMatch) {
      faqsList.push({
        question: qMatch[1].trim(),
        answer: aMatch[1].trim(),
      })
    }
  }
  if (faqsList.length > 0) {
    return faqsList
  }

  return []
}

/**
 * Formats standard Notion date values to valid ISO format.
 */
function parseDate(val: any): string | undefined {
  if (!val) return undefined
  const textVal = typeof val === 'string' ? val : extractNotionValue(val)
  if (!textVal) return undefined

  const d = new Date(textVal)
  if (isNaN(d.getTime())) return undefined
  return d.toISOString()
}

export async function POST(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const authHeader = req.headers.get('authorization')
    const syncSecret = process.env.NOTION_SYNC_SECRET

    const clientSecret = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.headers.get('x-notion-sync-secret') || new URL(req.url).searchParams.get('secret')

    const isAuthorized = Boolean(syncSecret) && clientSecret === syncSecret

    if (!isDev && !syncSecret) {
      console.error('NOTION_SYNC_SECRET is not configured in local environment variables')
      return NextResponse.json(
        { success: false, error: 'Notion sync is not configured.' },
        { status: 503 }
      )
    }

    if (!isDev && !isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Support flat webhook objects, Notion Integration structures, or nested properties blocks
    const properties = body.properties || body.data?.properties || body.entity?.properties || body

    const getVal = (key: string): string => {
      const prop = properties[key]
      return extractNotionValue(prop).trim()
    }

    // 1. Text / RichText / Title properties
    const businessName = getVal('Business Name')
    const description = getVal('Short Description')
    const whyItsListed = getVal('Why It Matters') // Mapped to whyItsListed in CMS
    const phone = getVal('Phone')
    const address = getVal('Address')
    const state = getVal('State')
    const email = getVal('Email')
    const website = getVal('Website')
    const hours = getVal('Hours')
    const facebook = getVal('Facebook')
    const instagram = getVal('Instagram')
    const linkedin = getVal('LinkedIn')
    const openQuestions = getVal('Open Questions')
    const googleCid = getVal('Google CID')
    const logo = getVal('Logo')

    // 2. Date property
    const dateResearchedRaw = getVal('Date Researched')
    const dateResearched = parseDate(dateResearchedRaw)

    // 3. Strict Select / Enum properties
    const categoryRaw = getVal('Category')
    const statusRaw = getVal('Status')
    const cityRaw = getVal('City')
    const gradeRaw = getVal('Marketing Footprint Grade')

    // Validate Core Properties
    if (!businessName) {
      console.warn("Validation failed: Missing required core property: 'Business Name'")
      return NextResponse.json(
        { success: false, error: "Missing required core property: 'Business Name'" },
        { status: 400 }
      )
    }

    // Map Category (strictly required in schema)
    const category = categoryMap[categoryRaw.toLowerCase()]
    if (!category) {
      const errMsg = categoryRaw 
        ? `Invalid Category: '${categoryRaw}'. Expected valid CMS enum value.`
        : "Missing required property: 'Category'"
      console.warn(`Validation failed: ${errMsg}`)
      return NextResponse.json(
        { 
          success: false, 
          error: errMsg
        },
        { status: 400 }
      )
    }

    // Map and validate other select fields if they exist in payload
    const status = statusRaw ? statusMap[statusRaw.toLowerCase()] : undefined
    if (statusRaw && !status) {
      console.warn(`Validation failed: Invalid Status: '${statusRaw}'`)
      return NextResponse.json(
        { success: false, error: `Invalid Status: '${statusRaw}'. Expected: Research, Draft Ready, In Edit, or Published.` },
        { status: 400 }
      )
    }

    const city = cityRaw ? cityMap[cityRaw.toLowerCase()] : undefined
    if (cityRaw && !city) {
      console.warn(`Validation failed: Invalid City: '${cityRaw}'`)
      return NextResponse.json(
        { success: false, error: `Invalid City: '${cityRaw}'. Expected Missoula, Great Falls, Billings, Helena, Bozeman, Kalispell, Lolo, or Other.` },
        { status: 400 }
      )
    }

    const marketingFootprintGrade = gradeRaw ? gradeMap[gradeRaw.toLowerCase()] : undefined
    if (gradeRaw && !marketingFootprintGrade) {
      console.warn(`Validation failed: Invalid Marketing Footprint Grade: '${gradeRaw}'`)
      return NextResponse.json(
        { success: false, error: `Invalid Marketing Footprint Grade: '${gradeRaw}'.` },
        { status: 400 }
      )
    }

    // Google Maps CID validation
    if (googleCid && !/^\d+$/.test(googleCid)) {
      console.warn(`Validation failed: Google CID must consist of numbers only: '${googleCid}'`)
      return NextResponse.json(
        { success: false, error: "Google CID must consist of numbers only." },
        { status: 400 }
      )
    }

    // Date Researched validation
    if (dateResearchedRaw && !dateResearched) {
      console.warn(`Validation failed: Invalid date format for 'Date Researched': '${dateResearchedRaw}'`)
      return NextResponse.json(
        { success: false, error: `Invalid date format for 'Date Researched': ${dateResearchedRaw}` },
        { status: 400 }
      )
    }

    // 4. Parse Structured Arrays (Quick Facts, Services, FAQs)
    const quickFacts = parseQuickFacts(properties['Quick Facts'])
    const services = parseServices(properties['Services'])
    const faqs = parseFAQs(properties['FAQs'])

    // 5. Dynamic Slug Generation
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // 6. Connect to CMS and execute Upsert
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'directory',
      where: {
        slug: { equals: slug }
      },
      limit: 1
    })

    const payloadData: any = {
      businessName,
      category,
      description: description || undefined,
      whyItsListed: whyItsListed || undefined,
      hours: hours || undefined,
      quickFacts,
      services,
      faqs,
      contactInfo: {
        phone: phone || undefined,
        website: website || undefined,
        instagram: instagram || undefined,
        address: address || undefined,
        email: email || undefined,
        facebook: facebook || undefined,
        linkedin: linkedin || undefined,
        state: state || undefined,
      },
      seoMetadata: {
        googleMapsCid: googleCid || undefined,
      },
      notionStatus: status || undefined,
      city: city || undefined,
      marketingFootprintGrade: marketingFootprintGrade || undefined,
      openQuestions: openQuestions || undefined,
      dateResearched: dateResearched || undefined,
      logo: logo || undefined,
      slug,
    }

    let result
    let operation: 'create' | 'update'

    if (existing.docs.length > 0) {
      operation = 'update'
      result = await payload.update({
        collection: 'directory',
        id: existing.docs[0].id,
        data: payloadData
      })
    } else {
      operation = 'create'
      result = await payload.create({
        collection: 'directory',
        data: payloadData
      })
    }

    // 7. On-demand static path revalidation
    try {
      revalidatePath('/')
      revalidatePath(`/directory/${slug}`)
      console.log(`Revalidated static cache for homepage and /directory/${slug}`)
    } catch (revalErr: any) {
      console.warn(`Failed to revalidate cache paths: ${revalErr.message}`)
    }

    return NextResponse.json({
      success: true,
      operation,
      id: result.id,
      slug: result.slug,
      message: `Successfully ${operation}d directory profile for "${businessName}".`
    }, { status: 200 })

  } catch (error: any) {
    console.error('Server error during Notion webhook synchronization:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unexpected platform error occurred.'
    }, { status: 500 })
  }
}
