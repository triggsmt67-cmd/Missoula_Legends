import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-time migration endpoint. Creates missing sponsor global tables
 * using the raw pg pool, then initializes the documents.
 * DELETE THIS FILE after confirmed working.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    // Get the raw pg pool from the adapter
    const pool = db.pool

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

    // Step 1: Create tables using raw pg pool
    for (const sql of createTableStatements) {
      const tableName = sql.match(/"(\w+)"/)?.[1] || 'unknown'
      try {
        await pool.query(sql)
        tableResults[tableName] = 'created'
      } catch (err: any) {
        tableResults[tableName] = `error: ${err?.message || err}`
      }
    }

    // Step 2: Initialize global documents
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
        initResults[slug] = `error: ${err?.message || err}`
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
    }, { status: 500 })
  }
}
