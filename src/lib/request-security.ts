const rateLimitStore = new Map<string, number[]>()

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function cleanText(value: unknown, maxLength = 1000): string {
  return String(value ?? '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, maxLength)
}

export function cleanEmail(value: unknown): string {
  return cleanText(value, 320).toLowerCase()
}

export function cleanMultilineText(value: unknown, maxLength = 5000): string {
  return cleanText(value, maxLength).replace(/\r\n/g, '\n')
}

export function formatHtmlText(value: unknown, maxLength = 5000): string {
  return escapeHtml(cleanMultilineText(value, maxLength)).replace(/\n/g, '<br />')
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const windowStart = now - windowMs
  const recentHits = (rateLimitStore.get(key) || []).filter((timestamp) => timestamp > windowStart)

  if (recentHits.length >= limit) {
    const oldestRecentHit = recentHits[0] || now
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldestRecentHit + windowMs - now) / 1000)
    )

    rateLimitStore.set(key, recentHits)

    return { allowed: false, retryAfterSeconds }
  }

  recentHits.push(now)
  rateLimitStore.set(key, recentHits)

  return { allowed: true, retryAfterSeconds: 0 }
}
