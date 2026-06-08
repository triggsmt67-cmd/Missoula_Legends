'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function submitHistoryStory(formData: {
  title: string
  year: string
  location: string
  excerpt: string
  content: string
}) {
  try {
    const payload = await getPayload({ config })

    // Find the default media image (missoula-history-site.jpg) if it exists
    const resMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: 'missoula-history-site.jpg',
        },
      },
      limit: 1,
    })
    const defaultMediaId = resMedia.docs[0]?.id

    if (!defaultMediaId) {
      throw new Error('Fallback media asset missoula-history-site.jpg was not found in the database. Please seed the database first.')
    }

    // Auto-generate slug from title
    const slug = formData.title
      .replace(/ /g, '-')
      .replace(/[^\w-/]+/g, '')
      .toLowerCase()

    await payload.create({
      collection: 'history',
      data: {
        title: formData.title,
        slug,
        year: formData.year || 'Historic',
        location: formData.location || 'Missoula, MT',
        excerpt: formData.excerpt,
        heroImage: defaultMediaId, // Fallback to our seeded Wilma image
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: formData.content,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting history story:', error)
    return { success: false, error: error.message || 'An unknown error occurred while saving the story.' }
  }
}
