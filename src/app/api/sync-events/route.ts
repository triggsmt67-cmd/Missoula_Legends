import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Helper to strip CDATA wrapping from XML strings
function cleanCdata(text: string): string {
  if (!text) return ''
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

// Extract content of a specific XML tag
function extractTagContent(itemXml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = itemXml.match(regex)
  if (match) {
    return cleanCdata(match[1])
  }
  return ''
}

// Custom lightweight regex-based RSS parser
function parseRssFeed(xmlText: string): any[] {
  const items: any[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1]
    const title = extractTagContent(itemXml, 'title')
    const link = extractTagContent(itemXml, 'link')
    const img = extractTagContent(itemXml, 'img')
    const guid = extractTagContent(itemXml, 'guid')
    const pubDate = extractTagContent(itemXml, 'pubDate')
    const description = extractTagContent(itemXml, 'description')
    items.push({ title, link, img, guid, pubDate, description })
  }
  return items
}

// Parse description string in format: "MM/DD/YYYY - TIME - Venue: VENUE_NAME"
function parseEventDetails(desc: string) {
  const parts = desc.split(' - ')
  let dateStr = ''
  let timeStr = ''
  let venueStr = ''

  if (parts.length >= 1) dateStr = parts[0].trim()
  if (parts.length >= 2) timeStr = parts[1].trim()
  if (parts.length >= 3) {
    const venuePart = parts[2].trim()
    if (venuePart.toLowerCase().startsWith('venue:')) {
      venueStr = venuePart.slice(6).trim()
    } else {
      venueStr = venuePart
    }
  }
  return { dateStr, timeStr, venueStr }
}

// Formats "MM/DD/YYYY" date into "Month Day, Year"
function formatEventDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10)
    const day = parseInt(parts[1], 10)
    const year = parts[2]
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    if (month >= 1 && month <= 12) {
      return `${months[month - 1]} ${day}, ${year}`
    }
  }
  return dateStr
}

// Fallback description generator in Missoula Legends brand voice
function getFallbackDescription(title: string, category: string, venue: string): string {
  const venueText = venue ? ` at ${venue}` : ''
  if (category === 'Music') {
    return `Experience the best of Missoula's local music scene with a live performance of ${title}${venueText}. A highlight of the Garden City's rich musical tradition.`
  } else if (category === 'Food & Beverage') {
    return `Savor the local flavors and community vibe of Missoula during ${title}${venueText}. An exceptional showcase of Western Montana's culinary craftsmanship.`
  } else {
    return `Celebrate community, heritage, and local culture at ${title}${venueText}. A featured Missoula gathering bringing people together in the heart of Western Montana.`
  }
}

// Calls Gemini API to generate an editorial-style blurb
async function generateAIEduDescription(title: string, category: string, dateStr: string, venueStr: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing, using local fallback description generator.')
    return getFallbackDescription(title, category, venueStr)
  }

  const prompt = `Write a unique, premium 1-to-2 sentence editorial description for the following local Missoula event:
Event Name: "${title}"
Category: "${category}"
Location/Venue: "${venueStr}"
Date: "${dateStr}"

Rules:
1. Write in the "Missoula Legends" brand voice: sophisticated, authentic, narrative-driven, and local-first.
2. Emphasize the unique vibe, local craftsmanship, culture, or sensory experience of the event.
3. Avoid generic calendar tropes or clichés (e.g. do NOT use "Join us", "This event features", "Come check out", "Don't miss", etc.).
4. Do not include markdown formatting, bullet points, or titles. Just output the clean sentences.
5. Maximize the chances of search and AI answer engines citing this description by keeping it rich and informative.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API request failed:', response.statusText, errText)
      return getFallbackDescription(title, category, venueStr)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (text) {
      return text
    }
  } catch (err) {
    console.error('Error in Gemini API call:', err)
  }

  return getFallbackDescription(title, category, venueStr)
}

// Downloads event image from GatherBoard S3 bucket and uploads it to Payload media collection
async function uploadEventImage(payload: any, imgUrl: string, eventTitle: string): Promise<string | null> {
  if (!imgUrl || !imgUrl.startsWith('http')) {
    return null
  }

  try {
    const response = await fetch(imgUrl)
    if (!response.ok) {
      console.warn(`Failed to fetch image from URL: ${imgUrl}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const parsedUrl = new URL(imgUrl)
    const pathname = parsedUrl.pathname
    const filename = pathname.split('/').pop() || 'event-image.png'
    const mimetype = response.headers.get('content-type') || 'image/jpeg'

    const doc = await payload.create({
      collection: 'media',
      data: {
        alt: `Cover photo for ${eventTitle} in Missoula`,
      },
      file: {
        data: buffer,
        name: filename,
        mimetype: mimetype,
        size: buffer.length,
      },
    })

    return doc.id as string
  } catch (err) {
    console.error(`Failed to upload event image from ${imgUrl}:`, err)
    return null
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const feeds = [
      {
        category: 'Music',
        url: 'https://www.missoulaevents.net/rss/music/',
      },
      {
        category: 'Food & Beverage',
        url: 'https://www.missoulaevents.net/rss/food-bev/',
      },
      {
        category: 'Special Events',
        url: 'https://www.missoulaevents.net/rss/special-events/',
      }
    ]

    const processedEvents = []

    for (const feed of feeds) {
      console.log(`Fetching feed for ${feed.category}: ${feed.url}`)
      const res = await fetch(feed.url, { cache: 'no-store' })
      if (!res.ok) {
        console.warn(`Failed to fetch feed: ${feed.url}`)
        continue
      }

      const xmlText = await res.text()
      const items = parseRssFeed(xmlText)

      if (items.length === 0) {
        console.warn(`No events found in feed: ${feed.category}`)
        continue
      }

      // Iterate to find the first event with a valid, downloadable image
      let chosenEvent = null
      let imageId: string | null = null

      for (const item of items) {
        if (item.img && item.img.startsWith('http')) {
          console.log(`Attempting image upload for event: "${item.title}" from ${item.img}`)
          imageId = await uploadEventImage(payload, item.img, item.title)
          if (imageId) {
            chosenEvent = item
            console.log(`Successfully uploaded image for event: "${item.title}" (Image ID: ${imageId})`)
            break
          }
        }
      }

      // Fallback: if no event had an image or if the uploads failed, use the first event in the feed
      if (!chosenEvent) {
        chosenEvent = items[0]
        console.log(`No events with valid/working images found. Falling back to the first event in feed: "${chosenEvent.title}"`)
      }

      const { dateStr, timeStr, venueStr } = parseEventDetails(chosenEvent.description)
      
      const formattedDate = formatEventDate(dateStr)
      // Formatted schedule: "DATE | TIME | VENUE" (matching design spec)
      const schedule = `${formattedDate} | ${timeStr} | ${venueStr}`

      console.log(`Processing event: "${chosenEvent.title}" for category "${feed.category}"`)
      
      // Generate AI blurb description
      const aiDescription = await generateAIEduDescription(
        chosenEvent.title,
        feed.category,
        formattedDate,
        venueStr
      )

      processedEvents.push({
        title: chosenEvent.title,
        schedule,
        description: aiDescription,
        featuredImage: imageId || undefined
      })
    }

    if (processedEvents.length > 0) {
      console.log(`Replacing events calendar with ${processedEvents.length} new entries...`)
      
      // Clear existing records
      await payload.delete({
        collection: 'events',
        where: {},
      })

      // Insert fresh records
      for (const event of processedEvents) {
        await payload.create({
          collection: 'events',
          data: event,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${processedEvents.length} events.`,
      events: processedEvents
    })

  } catch (error: any) {
    console.error('Server error during event synchronization:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
