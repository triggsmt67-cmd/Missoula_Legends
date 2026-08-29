import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-time migration endpoint that creates the three sponsor global
 * tables in PostgreSQL and initializes them with default values.
 *
 * Payload's `push: true` only runs in development (NODE_ENV !== 'production'),
 * so these tables were never created on Vercel. This endpoint manually
 * creates them using raw SQL, then initializes the global documents.
 *
 * DELETE THIS FILE after the globals are confirmed working.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = (payload.db as any)

    // Access the underlying Drizzle instance to run raw SQL
    const drizzle = db.drizzle

    const createTableStatements = [
      `CREATE TABLE IF NOT EXISTS "hero_community_partner" (
        "id" serial PRIMARY KEY NOT NULL,
        "display_mode" varchar,
        "directory_listing_id" integer,
        "start_date" timestamp(3) with time zone,
        "end_date" timestamp(3) with time zone,
        "business_name" varchar,
        "monogram" varchar,
        "logo_id" integer,
        "location_label" varchar,
        "category_label" varchar,
        "ownership_label" varchar,
        "description" varchar,
        "cta_label" varchar,
        "cta_url" varchar,
        "support_message" varchar,
        "internal_notes" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "category_sponsor_partner" (
        "id" serial PRIMARY KEY NOT NULL,
        "display_mode" varchar,
        "category_slug" varchar,
        "directory_listing_id" integer,
        "start_date" timestamp(3) with time zone,
        "end_date" timestamp(3) with time zone,
        "business_name" varchar,
        "monogram" varchar,
        "logo_id" integer,
        "location_label" varchar,
        "category_label" varchar,
        "ownership_label" varchar,
        "description" varchar,
        "cta_label" varchar,
        "cta_url" varchar,
        "support_message" varchar,
        "internal_notes" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "spotlight_program_partner" (
        "id" serial PRIMARY KEY NOT NULL,
        "display_mode" varchar,
        "directory_listing_id" integer,
        "start_date" timestamp(3) with time zone,
        "end_date" timestamp(3) with time zone,
        "business_name" varchar,
        "monogram" varchar,
        "logo_id" integer,
        "location_label" varchar,
        "category_label" varchar,
        "ownership_label" varchar,
        "description" varchar,
        "cta_label" varchar,
        "cta_url" varchar,
        "support_message" varchar,
        "internal_notes" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      )`,
    ]

    const tableResults: Record<string, string> = {}

    // Step 1: Create tables
    for (const sql of createTableStatements) {
      const tableName = sql.match(/"(\w+)"/)?.[1] || 'unknown'
      try {
        await drizzle.execute({ sql, params: [] })
        tableResults[tableName] = 'table created (or already exists)'
      } catch (err: any) {
        tableResults[tableName] = `table error: ${err?.message || err}`
      }
    }

    // Step 2: Initialize global documents with default values
    const globalSlugs = [
      'hero-community-partner',
      'category-sponsor-partner',
      'spotlight-program-partner',
    ] as const

    const initResults: Record<string, string> = {}

    for (const slug of globalSlugs) {
      try {
        await payload.updateGlobal({
          slug,
          data: { displayMode: 'available' } as any,
          depth: 0,
        })
        initResults[slug] = 'initialized'
      } catch (err: any) {
        initResults[slug] = `init error: ${err?.message || err}`
      }
    }

    return NextResponse.json({
      success: true,
      tables: tableResults,
      globals: initResults,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed',
      stack: err?.stack?.split('\n').slice(0, 5),
    }, { status: 500 })
  }
}
