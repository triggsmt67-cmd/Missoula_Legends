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
  access: {
    read: () => true,
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
  ],
}
