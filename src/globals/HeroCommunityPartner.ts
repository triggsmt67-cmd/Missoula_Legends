import type { GlobalConfig } from 'payload'

const sponsoredOnly = (data: Record<string, unknown>) => data.displayMode === 'sponsored'

export const HeroCommunityPartner: GlobalConfig = {
  slug: 'hero-community-partner',
  label: 'Hero Community Partner',
  admin: {
    description:
      'Manage the single, clearly labeled community-partner record in the homepage hero. Choose Available when the position is not sold.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        const { revalidatePath } = await import('next/cache')
        revalidatePath('/')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'displayMode',
      type: 'select',
      required: true,
      defaultValue: 'available',
      label: 'Card State',
      options: [
        { label: 'Available for a Community Partner', value: 'available' },
        { label: 'Sponsored Community Partner', value: 'sponsored' },
      ],
      admin: {
        description:
          'Available shows a tasteful house message. Sponsored shows the partner information below.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          label: 'Partner Business Name',
          maxLength: 70,
          admin: { condition: sponsoredOnly, width: '70%' },
        },
        {
          name: 'monogram',
          type: 'text',
          label: 'Monogram',
          maxLength: 3,
          admin: {
            condition: sponsoredOnly,
            description: 'One to three letters, such as GC.',
            width: '30%',
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Optional Partner Logo',
      admin: {
        condition: sponsoredOnly,
        description:
          'Optional. Use a simple one-color logo when possible; otherwise the monogram is shown.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'locationLabel',
          type: 'text',
          label: 'Location',
          defaultValue: 'Serving Missoula',
          maxLength: 40,
          admin: { condition: sponsoredOnly, width: '50%' },
        },
        {
          name: 'categoryLabel',
          type: 'text',
          label: 'Category',
          maxLength: 45,
          admin: { condition: sponsoredOnly, width: '50%' },
        },
      ],
    },
    {
      name: 'ownershipLabel',
      type: 'text',
      label: 'Third Detail',
      defaultValue: 'Locally Owned',
      maxLength: 35,
      admin: {
        condition: sponsoredOnly,
        description: 'Optional third detail, such as Locally Owned or Family Operated.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Partner Description',
      maxLength: 180,
      admin: {
        condition: sponsoredOnly,
        description: 'Use one factual sentence. Avoid testimonials or editorial endorsement language.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Visit Community Partner',
          maxLength: 35,
          admin: { condition: sponsoredOnly, width: '45%' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Partner Website',
          admin: {
            condition: sponsoredOnly,
            description: 'Use the full https:// URL.',
            width: '55%',
          },
        },
      ],
    },
    {
      name: 'supportMessage',
      type: 'text',
      label: 'Support Message',
      defaultValue: 'This sponsorship supports free directory listings and independent local storytelling.',
      maxLength: 120,
      admin: { condition: sponsoredOnly },
    },
  ],
}
