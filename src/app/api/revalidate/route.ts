import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/request-security'

const staticPaths = new Set([
  '/', '/directory', '/stories', '/history', '/gallery', '/sitemap',
  '/mission', '/partner', '/support', '/claim',
])

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  // Preserve the existing authenticated automation contract as well as CMS sessions.
  const authorization = request.headers.get('authorization')
  const secret = process.env.REVALIDATE_SECRET
  let principal: string | undefined
  if (authorization) {
    if (secret && authorization === `Bearer ${secret}`) principal = 'automation'
  } else {
    const { getAuthenticatedPayloadUser } = await import('@/lib/payload-auth')
    const { user } = await getAuthenticatedPayloadUser()
    if (user) principal = `user:${user.id}`
  }
  if (!principal) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 })
  }

  const path = body && typeof body === 'object' && 'path' in body ? body.path : undefined
  if (typeof path !== 'string' || path.length > 256 ||
    (!staticPaths.has(path) && !/^\/(?:directory(?:\/category)?|articles|history)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path))) {
    return NextResponse.json({ success: false, message: 'Invalid public page path' }, { status: 400 })
  }

  const limit = checkRateLimit(`revalidate:${principal}`, 10, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfterSeconds) },
    })
  }

  revalidatePath(path)
  return NextResponse.json({ success: true, revalidated: path })
}
