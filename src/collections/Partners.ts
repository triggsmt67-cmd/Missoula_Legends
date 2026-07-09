import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'logo', 'order'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        permissionStatus: { not_equals: 'pending' }
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/')
        } catch (err) {
          console.error('Error in Partners afterChange hook:', err)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/')
        } catch (err) {
          console.error('Error in Partners afterDelete hook:', err)
        }
        return doc
      },
    ],
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
    {
      name: 'permissionStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Verification', value: 'pending' },
        { label: 'Approved / Owner-Submitted', value: 'approved' },
        { label: 'Licensed', value: 'licensed' },
        { label: 'Public Domain / Fair Use', value: 'public' },
      ],
      label: 'Permission Status',
    },
  ],
}
