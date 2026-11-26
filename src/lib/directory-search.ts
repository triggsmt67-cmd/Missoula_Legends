import { getPlainText } from '@/lib/schema-utils'
import { NEIGHBORHOOD_LABELS } from '@/lib/neighborhoods'

type SearchableListing = {
  businessName?: string
  category?: string
  description?: unknown
  neighborhood?: string
}

import { CATEGORY_LABELS, getFilterCategory } from '@/lib/directory-categories'
export { CATEGORY_LABELS, getFilterCategory } from '@/lib/directory-categories'

/** Use the same results and ordering for rendered listings and their initial JSON-LD. */
export function filterDirectoryListings<T extends SearchableListing>(listings: T[], selectedCategory?: string | null, searchQuery = ''): T[] {
  const query = searchQuery.trim().toLowerCase()
  return listings.filter(item => {
    const category = item.category || ''
    if (selectedCategory && getFilterCategory(category) !== selectedCategory) return false
    if (!query) return true
    const neighborhood = item.neighborhood || ''
    return [item.businessName || '', getPlainText(item.description),
      NEIGHBORHOOD_LABELS[neighborhood] || neighborhood,
      CATEGORY_LABELS[category] || category,
      CATEGORY_LABELS[getFilterCategory(category)] || '']
      .some(value => value.toLowerCase().includes(query))
  }).sort((a, b) => {
    const categoryA = getFilterCategory(a.category || '')
    const categoryB = getFilterCategory(b.category || '')
    const byCategory = (CATEGORY_LABELS[categoryA] || categoryA).localeCompare(CATEGORY_LABELS[categoryB] || categoryB)
    return byCategory || (a.businessName || '').localeCompare(b.businessName || '')
  })
}
