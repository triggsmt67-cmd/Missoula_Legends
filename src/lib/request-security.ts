import 'server-only'

type RateBucket = { count: number; resetAt: number }

const rateBuckets = new Map<string, RateBucket>()

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return process.env.NODE_ENV !== 'production'

  try {
    return origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export function hasAcceptableBodySize(request: Request, maximumBytes = 25_000) {
  const contentLength = Number(request.headers.get('content-length') || '0')
  return Number.isFinite(contentLength) && contentLength >= 0 && contentLength <= maximumBytes
}

export function getRequestIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const existing = rateBuckets.get(key)

  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  existing.count += 1
  return existing.count > limit
}

export function escapeHtml(value: unknown, maximumLength = 5_000) {
  return String(value ?? '')
    .trim()
    .slice(0, maximumLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function cleanHeaderValue(value: unknown, maximumLength = 160) {
  return String(value ?? '').replace(/[\r\n\0]/g, ' ').trim().slice(0, maximumLength)
}

export function getValidEmail(value: unknown) {
  const email = cleanHeaderValue(value, 254)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined
}
