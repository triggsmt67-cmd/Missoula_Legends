import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from 'drizzle-orm'

/**
 * One-time migration endpoint to add version_contact_info_zip_code to _directory_v.
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
    const db = (payload.db as any).drizzle

    // Check if column already exists in versions table
    const checkResult = await db.execute(
      sql`SELECT column_name FROM information_schema.columns WHERE table_name = '_directory_v' AND column_name = 'version_contact_info_zip_code'`
    )

    if (checkResult.rows && checkResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Column version_contact_info_zip_code already exists in _directory_v. No migration needed.',
      })
    }

    // Add the column to versions table
    await db.execute(
      sql`ALTER TABLE "_directory_v" ADD COLUMN "version_contact_info_zip_code" varchar`
    )

    return NextResponse.json({
      success: true,
      message: 'Successfully added version_contact_info_zip_code column to _directory_v table.',
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
