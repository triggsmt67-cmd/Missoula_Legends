import type { GlobalConfig } from 'payload'

const sponsoredOnly = (data: Record<string, unknown>) => data.displayMode === 'sponsored'

export const CategorySponsorPartner: GlobalConfig = {
  slug: 'category-sponsor-partner',
  label: 'Category Sponsor Partner',
  admin: {
    description:
      'Manage the banner partner displayed across Directory category pages. Choose Available when unsold, or Sponsored to link a business.',
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
          revalidatePath('/directory')
          revalidatePath('/directory/category/[slug]', 'page')
          if (doc?.categorySlug && doc.categorySlug !== 'all') {
            revalidatePath(`/directory/category/${doc.categorySlug}`)
          }
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
        { label: 'Sponsored (Display Active Category Partner)', value: 'sponsored' },
        { label: 'Disabled (Hide Category Banner Completely)', value: 'disabled' },
      ],
      admin: {
        description:
          'Available displays an underwriting invitation. Sponsored displays the active category partner banner.',
      },
    },
    {
      name: 'categorySlug',
      type: 'select',
      label: 'Target Directory Category',
      defaultValue: 'all',
      admin: {
        description: 'Choose which category section this sponsorship applies to (or "All Categories" for global banner).',
      },
      options: [
        { label: 'All Categories (Global Category Banner)', value: 'all' },
        { label: 'Food & Drink', value: 'food-drink' },
        { label: 'Shopping & Retail', value: 'shopping' },
        { label: 'Lifestyle & Recreation', value: 'lifestyle' },
        { label: 'Automotive', value: 'automotive' },
        { label: 'Auto Repair & Service', value: 'auto-repair' },
        { label: 'Professional Services', value: 'professional-services' },
        { label: 'Health & Wellness', value: 'health-wellness' },
        { label: 'Arts & Culture', value: 'arts-culture' },
        { label: 'Home & Lodging', value: 'home-lodging' },
        { label: 'Septic & Excavation', value: 'septic-excavation' },
        { label: 'Plumbing & HVAC', value: 'plumbing-hvac' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Towing', value: 'towing' },
        { label: 'Welding & Fabrication', value: 'welding-fabrication' },
      ],
    },
    {
      name: 'directoryListing',
      type: 'relationship',
      relationTo: 'directory',
      label: 'Featured Directory Profile',
      admin: {
        condition: sponsoredOnly,
        description:
          'Select any business from your Directory. When selected, the banner card automatically pulls its business name, category, location, photo, description, and website URL directly from the database. Any fields filled below will override the database values.',
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
            description: 'e.g. "Food & Drink". Auto-populated from category if blank.',
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
          defaultValue: 'Visit Category Partner',
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
