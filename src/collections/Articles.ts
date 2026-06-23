import type { CollectionConfig, FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-/]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data, operation }) => {
    if (typeof value === 'string' && value) {
      return format(value)
    }

    if (operation === 'create' || !value) {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]
      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'galleryImages',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Gallery / Interior Photos',
      admin: {
        description: 'Select photos (typically 3) to display as an editorial grid at the bottom of the article.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Article',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Check this to feature this article at the top of the homepage. Checking this will un-feature any previously featured articles.',
      },
      hooks: {
        beforeChange: [
          async ({ value, req, operation, originalDoc }) => {
            // If this article is being set to featured (and it wasn't already, or it's a new article)
            if (value === true) {
              // Unset 'featured' on all other articles
              await req.payload.update({
                collection: 'articles',
                where: {
                  id: { not_equals: originalDoc?.id || 'new' },
                  featured: { equals: true },
                },
                data: {
                  featured: false,
                },
              })
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'relatedBusiness',
      type: 'relationship',
      relationTo: 'directory',
      hasMany: true,
      admin: {
        allowEdit: true,
      },
    },
    {
      name: 'sidebar',
      type: 'group',
      admin: {
        description: 'Optional custom sidebar box. Defaults will be used if left blank.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Sidebar Title',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Sidebar Text',
        },
        {
          name: 'linkText',
          type: 'text',
          label: 'Link Text',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'Link URL',
        },
      ],
    },
  ],
}
