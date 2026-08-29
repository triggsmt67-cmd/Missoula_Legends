'use server'

import 'server-only'

import { requirePayloadUser } from '@/lib/payload-auth'

const ALLOWED_CATEGORIES = new Set([
  'food-drink', 'shopping', 'lifestyle', 'automotive', 'professional-services',
  'health-wellness', 'arts-culture', 'home-lodging', 'septic-excavation',
  'auto-repair', 'plumbing-hvac', 'electrical', 'towing', 'welding-fabrication',
])

const ALLOWED_NEIGHBORHOODS = new Set([
  'downtown', 'hip-strip', 'slant-streets', 'university-district', 'northside',
  'westside', 'rattlesnake', 'grant-creek', 'orchard-homes-target-range',
  'rose-park', 'miller-creek-linda-vista', 'south-hills', 'east-missoula',
  'bonner-milltown', 'lolo', 'wye',
])

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function submitIntakeForm(formData: {
  businessName: string
  category: string
  neighborhood: string
  description: string
  phone: string
  website: string
  instagram: string
  address: string
}) {
  try {
    const { payload, user } = await requirePayloadUser()
    const businessName = clean(formData.businessName, 160)
    const category = clean(formData.category, 64)
    const neighborhood = clean(formData.neighborhood, 80)
    const address = clean(formData.address, 240)

    if (!businessName || !address || !ALLOWED_CATEGORIES.has(category) || !ALLOWED_NEIGHBORHOODS.has(neighborhood)) {
      return { success: false, error: 'Please provide valid required business information.' }
    }

    await payload.create({
      collection: 'directory',
      overrideAccess: false,
      user,
      data: {
        businessName,
        category: category as any,
        neighborhood: neighborhood as any,
        description: clean(formData.description, 5000),
        contactInfo: {
          phone: clean(formData.phone, 80),
          website: clean(formData.website, 500),
          instagram: clean(formData.instagram, 120),
          address,
        },
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting intake form:', error)
    return { success: false, error: 'Unable to save the business.' }
  }
}

export async function getDirectoryListings() {
  try {
    const { payload, user } = await requirePayloadUser()
    const res = await payload.find({
      collection: 'directory',
      limit: 100,
      depth: 0,
      overrideAccess: false,
      user,
      sort: 'businessName',
      select: {
        businessName: true,
        category: true,
        neighborhood: true,
      },
    })
    return { success: true, listings: res.docs }
  } catch (error: any) {
    console.error('Error fetching listings for intake:', error)
    return { success: false, error: 'Failed to fetch directory listings.' }
  }
}

export async function deleteBusiness(id: string) {
  try {
    const { payload, user } = await requirePayloadUser()
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return { success: false, error: 'Invalid listing identifier.' }
    }
    await payload.delete({
      collection: 'directory',
      id,
      overrideAccess: false,
      user,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting business:', error)
    return { success: false, error: 'Failed to delete business.' }
  }
}
