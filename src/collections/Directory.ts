import type { CollectionConfig } from 'payload'

export const Directory: CollectionConfig = {
  slug: 'directory',
  admin: {
    useAsTitle: 'businessName',
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
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Food & Drink', value: 'food-drink' },
        { label: 'Shopping', value: 'shopping' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Automotive', value: 'automotive' },
        { label: 'Professional Services', value: 'professional-services' },
        { label: 'Health & Wellness', value: 'health-wellness' },
        { label: 'Arts & Culture', value: 'arts-culture' },
        { label: 'Home & Lodging', value: 'home-lodging' },
      ],
    },
    {
      name: 'neighborhood',
      type: 'select',
      required: true,
      options: [
        { label: 'Downtown', value: 'downtown' },
        { label: 'Hip Strip', value: 'hip-strip' },
        { label: 'Slant Streets', value: 'slant-streets' },
        { label: 'University District', value: 'university-district' },
        { label: 'Northside', value: 'northside' },
        { label: 'Westside', value: 'westside' },
        { label: 'Rattlesnake', value: 'rattlesnake' },
        { label: 'Grant Creek', value: 'grant-creek' },
        { label: 'Orchard Homes / Target Range', value: 'orchard-homes-target-range' },
        { label: 'Rose Park', value: 'rose-park' },
        { label: 'Miller Creek / Linda Vista', value: 'miller-creek-linda-vista' },
        { label: 'South Hills', value: 'south-hills' },
        { label: 'East Missoula', value: 'east-missoula' },
        { label: 'Bonner-Milltown', value: 'bonner-milltown' },
        { label: 'Lolo', value: 'lolo' },
        { label: 'Wye', value: 'wye' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'website',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'listed',
      options: [
        { label: 'Listed', value: 'listed' },
        { label: 'Editorial Feature', value: 'featured' },
        { label: 'Partner Spotlight', value: 'partner' },
      ],
      label: 'Listing Status',
    },
  ],
}
