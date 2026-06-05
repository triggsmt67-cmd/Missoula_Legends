import type { CollectionConfig } from 'payload'

export const Directory: CollectionConfig = {
  slug: 'directory',
  admin: {
    useAsTitle: 'businessName',
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Food & Drink', value: 'food-drink' },
        { label: 'Shopping', value: 'shopping' },
        { label: 'Lifestyle', value: 'lifestyle' },
      ],
    },
    {
      name: 'neighborhood',
      type: 'select',
      required: true,
      options: [
        { label: 'Downtown', value: 'downtown' },
        { label: 'Hip Strip', value: 'hip-strip' },
        { label: 'Slant Streets', value: 'slant-streets' },
        { label: 'Northside', value: 'northside' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'website',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
