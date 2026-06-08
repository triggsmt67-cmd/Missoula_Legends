import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'logo', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Business Name',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: 'Logo Image',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: {
        placeholder: 'e.g. 1, 2, 3 (ascending order)',
      },
    },
  ],
}
