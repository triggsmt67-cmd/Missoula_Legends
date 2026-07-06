import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'caption',
    description: 'Curated community photos submitted to Missoula Legends. Only publish photos you have verified permission to display.',
    defaultColumns: ['photo', 'caption', 'photographerName', 'neighborhood', 'category'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/gallery')
        } catch (err) {
          console.error('Error in Gallery afterChange hook:', err)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/gallery')
        } catch (err) {
          console.error('Error in Gallery afterDelete hook:', err)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: 'Photo',
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
      label: 'Caption',
      admin: {
        description: 'A short, descriptive caption for the photo (1–2 sentences).',
      },
    },
    {
      name: 'photographerName',
      type: 'text',
      required: true,
      label: 'Photographer Name',
      admin: {
        description: 'The name of the person who took the photo.',
      },
    },
    {
      name: 'photographerInstagram',
      type: 'text',
      label: 'Photographer Instagram Handle',
      admin: {
        description: 'Optional. Include the @ symbol (e.g. @trevorriggs).',
      },
    },
    {
      name: 'neighborhood',
      type: 'select',
      required: true,
      label: 'Neighborhood',
      options: [
        { label: 'Downtown', value: 'downtown' },
        { label: 'Hip Strip', value: 'hip-strip' },
        { label: 'Slant Streets', value: 'slant-streets' },
        { label: 'University District', value: 'university-district' },
        { label: 'Northside', value: 'northside' },
        { label: 'Westside', value: 'westside' },
        { label: 'Rattlesnake', value: 'rattlesnake' },
        { label: 'Grant Creek', value: 'grant-creek' },
        { label: 'South Hills', value: 'south-hills' },
        { label: 'East Missoula', value: 'east-missoula' },
        { label: 'Lolo', value: 'lolo' },
        { label: 'Greater Missoula Area', value: 'greater-missoula' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Neighborhoods & Streets', value: 'neighborhoods' },
        { label: 'Local Business', value: 'business' },
        { label: 'Events & Community', value: 'events' },
        { label: 'Nature & Outdoors', value: 'nature' },
        { label: 'History & Archival', value: 'history' },
        { label: 'Food & Drink', value: 'food-drink' },
        { label: 'People of Missoula', value: 'people' },
      ],
    },
    {
      name: 'dateTaken',
      type: 'text',
      label: 'Date / Year Taken',
      admin: {
        description: 'Approximate year or date the photo was taken (e.g. "Summer 2024" or "June 2023").',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Photo',
      defaultValue: false,
      admin: {
        description: 'Check this to feature the photo prominently at the top of the gallery.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
