import type { Where } from 'payload'

export const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
  automotive: 'Automotive',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'auto-repair': 'Auto Repair',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical',
  'towing': 'Towing',
  'welding-fabrication': 'Welding & Fabrication',
  'tradesmen': 'Tradesmen',
}

const CATEGORY_MAPPING: { [key: string]: string } = {
  'septic-excavation': 'tradesmen',
  'plumbing-hvac': 'tradesmen',
  'electrical': 'tradesmen',
  'welding-fabrication': 'tradesmen',
  'auto-repair': 'automotive',
  'towing': 'automotive',
}

export const getFilterCategory = (slug: string) => CATEGORY_MAPPING[slug] || slug



export function categoryListingWhere(slug: string): Where {
  return { and: [
    { _status: { equals: 'published' } },
    { listingStatus: { not_equals: 'unlisted' } },
    slug === 'automotive' ? { category: { in: ['automotive', 'auto-repair', 'towing'] } } :
    slug === 'tradesmen' ? { category: { in: ['tradesmen', 'septic-excavation', 'plumbing-hvac', 'electrical', 'welding-fabrication'] } } :
    { category: { equals: slug } },
  ] }
}
