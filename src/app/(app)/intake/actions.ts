'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

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
    const payload = await getPayload({ config })

    // Create the directory entry directly.
    // By running this on the server without passing `req.user`, it bypasses access control,
    // allowing Trevor to use this form without needing to be logged in to Payload on his iPad.
    await payload.create({
      collection: 'directory',
      data: {
        businessName: formData.businessName,
        category: formData.category as any,
        neighborhood: formData.neighborhood as any,
        description: formData.description,
        contactInfo: {
          phone: formData.phone,
          website: formData.website,
          instagram: formData.instagram,
          address: formData.address,
        },
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting intake form:', error)
    return { success: false, error: error.message || 'An unknown error occurred while saving the business.' }
  }
}

export async function getDirectoryListings() {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'directory',
      limit: 100,
      depth: 0,
      overrideAccess: true,
      sort: 'businessName',
    })
    return { success: true, listings: res.docs }
  } catch (error: any) {
    console.error('Error fetching listings for intake:', error)
    return { success: false, error: error.message || 'Failed to fetch directory listings.' }
  }
}

export async function deleteBusiness(id: string) {
  try {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'directory',
      id,
      overrideAccess: true,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting business:', error)
    return { success: false, error: error.message || 'Failed to delete business.' }
  }
}

