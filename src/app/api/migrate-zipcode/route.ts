import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One-time migration endpoint to add the contact_info_zip_code column.
 * Protected by the same sync secret. DELETE THIS FILE after running once.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-notion-sync-secret')
  const expected = process.env.NOTION_SYNC_SECRET

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const db = (payload.db as any)

    // Check if column already exists
    const checkResult = await db.drizzle.execute({
      sql: `SELECT column_name FROM information_schema.columns WHERE table_name = 'directory' AND column_name = 'contact_info_zip_code'`,
    })

    if (checkResult.rows && checkResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Column contact_info_zip_code already exists. No migration needed.',
      })
    }

    // Add the column
    await db.drizzle.execute({
      sql: `ALTER TABLE "directory" ADD COLUMN "contact_info_zip_code" varchar`,
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully added contact_info_zip_code column to directory table.',
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
