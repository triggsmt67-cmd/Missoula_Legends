import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 500,
        height: 375,
        crop: 'center',
      },
      {
        name: 'featureHero',
        width: 1400,
        height: 700,
        crop: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
}
