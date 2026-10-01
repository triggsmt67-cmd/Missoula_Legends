import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 })
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }
  const path = body && typeof body === 'object' && 'path' in body ? body.path : undefined
  if (typeof path !== 'string' || path.length > 1024 ||
      !/^\/(?:$|directory(?:\/category)?(?:\/[a-z0-9-]+)?|articles\/[a-z0-9-]+|history(?:\/[a-z0-9-]+)?|stories|gallery|sitemap)$/.test(path)) {
    return NextResponse.json({ error: 'Invalid public page path.' }, { status: 400 })
  }
  revalidatePath(path)
  return NextResponse.json({ success: true, revalidated: path })
}
