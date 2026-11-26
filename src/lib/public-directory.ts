type DirectoryRecord = {
  id?: string | number
  businessName?: string | null
  category?: string | null
  contactInfo?: { address?: string | null; phone?: string | null } | null
  description?: unknown
  featuredImage?: unknown
  neighborhood?: string | null
  shortDescription?: string | null
  slug?: string | null
}

type ImageRecord = {
  alt?: string | null
  url?: string | null
  sizes?: { thumbnail?: { url?: string | null } | null } | null
}

/** Only this public projection may cross into directory search client props. */
export function toPublicDirectoryListing(record: DirectoryRecord) {
  const image = record.featuredImage && typeof record.featuredImage === 'object'
    ? record.featuredImage as ImageRecord
    : undefined

  return {
    id: record.id,
    businessName: record.businessName || '',
    category: record.category || '',
    contactInfo: {
      address: record.contactInfo?.address || '',
      phone: record.contactInfo?.phone || '',
    },
    description: record.description,
    featuredImage: image ? {
      alt: image.alt || '',
      url: image.url || '',
      sizes: { thumbnail: { url: image.sizes?.thumbnail?.url || '' } },
    } : undefined,
    neighborhood: record.neighborhood || '',
    shortDescription: record.shortDescription || '',
    slug: record.slug || '',
  }
}
