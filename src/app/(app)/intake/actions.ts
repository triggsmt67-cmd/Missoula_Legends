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
