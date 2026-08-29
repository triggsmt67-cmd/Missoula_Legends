import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

/**
 * One-time initialization endpoint for new Payload globals.
 * Payload's `push: true` creates DB columns on cold start, but the
 * global *documents* still need a first write.  This route touches
 * each new global so a row is inserted with its default values.
 *
 * DELETE THIS FILE after the globals are confirmed working in the
 * admin panel.
 */
export async function GET(request: Request) {
  // Lightweight auth: require a secret query param
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const globalSlugs = [
      'hero-community-partner',
      'category-sponsor-partner',
      'spotlight-program-partner',
    ] as const

    const results: Record<string, string> = {}

    for (const slug of globalSlugs) {
      try {
        // Try reading the global first
        const existing = await payload.findGlobal({ slug, depth: 0 })
        if (existing) {
          results[slug] = 'already exists'
          continue
        }
      } catch {
        // Global document doesn't exist yet — this is expected
      }

      try {
        // Force-initialize the global with default values
        await payload.updateGlobal({
          slug,
          data: {
            displayMode: 'available',
          } as any,
          depth: 0,
        })
        results[slug] = 'initialized'
      } catch (err: any) {
        results[slug] = `error: ${err?.message || err}`
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to initialize globals',
    }, { status: 500 })
  }
}
