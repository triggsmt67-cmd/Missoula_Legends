import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'schedule',
      type: 'text',
      required: true,
      label: 'Date / Schedule',
      admin: {
        placeholder: 'e.g. SATURDAYS | 8:00 AM - 1:00 PM',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External Event Link',
      admin: {
        placeholder: 'e.g. https://www.missoulaevents.net/event/12345',
      },
    },
  ],
}
