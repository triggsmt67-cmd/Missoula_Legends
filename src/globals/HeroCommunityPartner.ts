import type { GlobalConfig } from 'payload'

const sponsoredOnly = (data: Record<string, unknown>) => data.displayMode === 'sponsored'

export const HeroCommunityPartner: GlobalConfig = {
  slug: 'hero-community-partner',
  label: 'Hero Community Partner',
  admin: {
    description:
      'Manage the single, clearly labeled community partner featured in the homepage hero. Choose Available when unsold, or Sponsored to link a business.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/')
        } catch {}
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
        { label: 'Available (Display Tasteful House Invitation)', value: 'available' },
        { label: 'Sponsored (Display Active Community Partner)', value: 'sponsored' },
        { label: 'Disabled (Hide Hero Sponsor Box Completely)', value: 'disabled' },
      ],
      admin: {
        description:
          'Available displays an underwriting invitation. Sponsored displays the active community partner.',
      },
    },
    {
      name: 'directoryListing',
      type: 'relationship',
      relationTo: 'directory',
      label: 'Featured Directory Profile',
      admin: {
        condition: sponsoredOnly,
        description:
          'Select any business from your Directory. When selected, the card automatically pulls its business name, category, location, photo, description, and website URL directly from the database. Any fields filled below will override the database values.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Campaign Start Date (Optional)',
          admin: {
            condition: sponsoredOnly,
            width: '50%',
            description: 'Card remains in Available state until this date.',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Campaign Expiration Date (Optional)',
          admin: {
            condition: sponsoredOnly,
            width: '50%',
            description: 'Card automatically reverts to Available after this date.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          label: 'Custom Business Name (Override)',
          maxLength: 70,
          admin: {
            condition: sponsoredOnly,
            description: 'Leave blank to use the directory business name.',
            width: '70%',
          },
        },
        {
          name: 'monogram',
          type: 'text',
          label: 'Monogram',
          maxLength: 3,
          admin: {
            condition: sponsoredOnly,
            description: '1–3 letters (e.g. TH). Auto-generated from name if left blank.',
            width: '30%',
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom Logo / Image (Override)',
      admin: {
        condition: sponsoredOnly,
        description: 'Optional override. Leave blank to automatically use the directory featured image.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'locationLabel',
          type: 'text',
          label: 'Location Label (Override)',
          maxLength: 40,
          admin: {
            condition: sponsoredOnly,
            description: 'e.g. "Downtown Missoula". Auto-populated from neighborhood if blank.',
            width: '50%',
          },
        },
        {
          name: 'categoryLabel',
          type: 'text',
          label: 'Category Label (Override)',
          maxLength: 45,
          admin: {
            condition: sponsoredOnly,
            description: 'e.g. "Home & Trade Services". Auto-populated from category if blank.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'ownershipLabel',
      type: 'text',
      label: 'Third Detail / Tagline (Override)',
      defaultValue: 'Locally Owned',
      maxLength: 35,
      admin: {
        condition: sponsoredOnly,
        description: 'e.g. "Locally Owned", "Since 1974", or operating hours.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Partner Statement / Description (Override)',
      maxLength: 240,
      admin: {
        condition: sponsoredOnly,
        description: 'Leave blank to use the directory profile description.',
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
          label: 'Custom Destination URL (Override)',
          admin: {
            condition: sponsoredOnly,
            description: 'Leave blank to use the business website or directory profile.',
            width: '55%',
          },
        },
      ],
    },
    {
      name: 'supportMessage',
      type: 'text',
      label: 'Underwriting Message',
      defaultValue: 'This sponsorship supports free directory listings and independent local storytelling.',
      maxLength: 120,
      admin: { condition: sponsoredOnly },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes (Admin Only)',
      access: {
        read: ({ req: { user } }) => Boolean(user),
      },
      admin: {
        description: 'Internal contract terms, sponsor contact details, renewal schedule, or pricing notes. Never rendered publicly.',
      },
    },
  ],
}
