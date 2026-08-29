import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-time initialization endpoint for new Payload globals.
 * Touches each new sponsor global so a row is inserted with default values.
 * DELETE THIS FILE after the globals are confirmed working.
 */
export async function GET() {
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

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to initialize globals',
    }, { status: 500 })
  }
}
