export const EDITOR_URL = 'https://www.missoulalegends.com/#curator'

export function buildAuthorSchema(name = 'Trevor Riggs', jobTitle = 'Missoula Legends Curator') {
  return { '@type': 'Person', '@id': EDITOR_URL, name, jobTitle, url: EDITOR_URL }
}

export function buildPublisherSchema() {
  return {
    '@type': 'Organization',
    '@id': 'https://www.missoulalegends.com/#organization',
    name: 'Missoula Legends',
    url: 'https://www.missoulalegends.com/',
    logo: { '@type': 'ImageObject', url: 'https://www.missoulalegends.com/logo.webp' },
  }
}

/** Unknown publication dates stay unknown rather than changing on each render. */
export function schemaDate(value?: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
