const DEFAULT_SITE_URL = 'https://www.missoulalegends.com'
const DEFAULT_SITE_LAST_MODIFIED = '2026-06-27T00:00:00.000Z'

function hasValue(value?: string): boolean {
  return Boolean(value && value.trim())
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configuredUrl) return DEFAULT_SITE_URL

  return configuredUrl.endsWith('/') ? configuredUrl.slice(0, -1) : configuredUrl
}

export function getStaticLastModified(): Date {
  return new Date(process.env.SITE_LAST_MODIFIED || DEFAULT_SITE_LAST_MODIFIED)
}

export function isPayloadConfigured(): boolean {
  return (
    hasValue(process.env.PAYLOAD_SECRET) &&
    (hasValue(process.env.DATABASE_URI) || hasValue(process.env.POSTGRES_URL))
  )
}
