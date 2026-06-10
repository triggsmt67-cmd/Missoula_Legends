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

export const History: CollectionConfig = {
  slug: 'history',
  admin: {
    useAsTitle: 'title',
    description: 'Historical stories and landmarks from around Missoula.',
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
      required: true,
    },
    {
      name: 'year',
      type: 'text',
      label: 'Era / Year',
      admin: {
        description: 'e.g. "1921" or "Late 1800s"',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location / Landmark',
      admin: {
        description: 'e.g. "Higgins Ave & Front St"',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      required: true,
      admin: {
        description: 'Brief 1-2 sentence description shown in lists and sidebar.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Story Content',
    },
  ],
}
