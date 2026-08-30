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
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: { equals: 'published' },
        listingStatus: { not_equals: 'unlisted' }
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/')
          revalidatePath('/directory')
          if (doc?.slug) {
            revalidatePath(`/directory/${doc.slug}`)
          }
          if (doc?.category) {
            revalidatePath(`/directory/category/${doc.category}`)
          }
          if (doc?.featuredArticle && req?.payload) {
            try {
              const featuredArticle = typeof doc.featuredArticle === 'object'
                ? doc.featuredArticle
                : await req.payload.findByID({
                    collection: 'articles',
                    id: doc.featuredArticle,
                    depth: 0,
                  })
              if (featuredArticle?.slug) {
                revalidatePath(`/articles/${featuredArticle.slug}`)
              }
            } catch (error) {
              console.warn(`Failed to revalidate the featured article for business ${doc?.id}:`, error)
            }
          }
          if (req?.payload && doc?.id) {
            try {
              const relatedArticles = await req.payload.find({
                collection: 'articles',
                where: {
                  relatedBusiness: {
                    equals: doc.id,
                  },
                },
                depth: 0,
                limit: 100,
              })
              for (const art of relatedArticles.docs) {
                if (art.slug) {
                  revalidatePath(`/articles/${art.slug}`)
                }
              }
            } catch (e) {
              console.warn(`Failed to fetch related articles for business ${doc.id} revalidation:`, e)
            }
          }
        } catch (err) {
          console.error('Error in Directory afterChange hook:', err)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/')
          revalidatePath('/directory')
          if (doc?.slug) {
            revalidatePath(`/directory/${doc.slug}`)
          }
          if (doc?.category) {
            revalidatePath(`/directory/category/${doc.category}`)
          }
          if (doc?.featuredArticle && req?.payload) {
            try {
              const featuredArticle = typeof doc.featuredArticle === 'object'
                ? doc.featuredArticle
                : await req.payload.findByID({
                    collection: 'articles',
                    id: doc.featuredArticle,
                    depth: 0,
                  })
              if (featuredArticle?.slug) {
                revalidatePath(`/articles/${featuredArticle.slug}`)
              }
            } catch {}
          }
          if (req?.payload && doc?.id) {
            try {
              const relatedArticles = await req.payload.find({
                collection: 'articles',
                where: {
                  relatedBusiness: {
                    equals: doc.id,
                  },
                },
                depth: 0,
                limit: 100,
              })
              for (const art of relatedArticles.docs) {
                if (art.slug) {
                  revalidatePath(`/articles/${art.slug}`)
                }
              }
            } catch {}
          }
        } catch (err) {
          console.error('Error in Directory afterDelete hook:', err)
        }
        return doc
      },
    ],
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
        { label: 'Septic & Excavation', value: 'septic-excavation' },
        { label: 'Auto Repair', value: 'auto-repair' },
        { label: 'Plumbing & HVAC', value: 'plumbing-hvac' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Tradesmen', value: 'tradesmen' },
        { label: 'Towing', value: 'towing' },
        { label: 'Welding & Fabrication', value: 'welding-fabrication' },
      ],
    },
    {
      name: 'neighborhood',
      type: 'select',
      required: false,
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
      name: 'neighborhoodContext',
      type: 'textarea',
      label: 'Neighborhood Context (Editorial)',
      admin: {
        description:
          'Optional. A short, plain-text editorial phrase that contextualizes the neighborhood in storytelling copy (e.g. "along the Hip Strip"). Displayed as a sub-header on the profile page and injected into structured meta attributes. Must be raw unformatted text — no markdown or HTML.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description (SEO)',
      admin: {
        description:
          'Concise factual summary (who/what/where) used in JSON-LD schema and meta description. Max ~160 chars. If blank, the full description will be truncated automatically.',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'Custom SEO Title',
      maxLength: 70,
      admin: {
        description:
          'Optional page-specific search title. Do not include “| Missoula Legends”; the site adds that automatically.',
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'featuredArticle',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Featured Story',
      filterOptions: {
        _status: { equals: 'published' },
      },
      admin: {
        description:
          'Optional. Select the primary editorial story for this profile. This takes priority over automatically discovered article relationships.',
      },
    },
    {
      name: 'whyItsListed',
      type: 'textarea',
      label: "Why It's Listed",
    },
    {
      name: 'historySection',
      type: 'group',
      label: 'Business History Section',
      admin: {
        description:
          'Optional dedicated history section displayed with its own H2 heading for readers and search engines.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'History Heading',
          maxLength: 90,
        },
        {
          name: 'summary',
          type: 'textarea',
          label: 'History Summary',
        },
      ],
    },
    {
      name: 'quickFacts',
      type: 'array',
      label: 'Quick Facts',
      fields: [
        {
          name: 'fact',
          type: 'text',
        },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQs',
      admin: {
        description: 'Frequently asked questions displayed on the business profile page.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Question',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Answer',
          required: true,
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services Offered',
      fields: [
        {
          name: 'service',
          type: 'text',
        },
      ],
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
          required: false,
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
      ],
    },
    {
      name: 'hours',
      type: 'text',
      label: 'Operating Hours',
      admin: {
        description: 'Optional. e.g. "Mon-Fri 8:00am - 5:00pm" or "Mon-Sat 9:00am-9:00pm"',
      },
    },
    {
      name: 'listingStatus',
      type: 'select',
      required: true,
      defaultValue: 'unlisted',
      options: [
        { label: 'Listed', value: 'listed' },
        { label: 'Unlisted', value: 'unlisted' },
        { label: 'Editorial Feature', value: 'featured' },
        { label: 'Partner Spotlight', value: 'partner' },
      ],
      label: 'Listing Status',
    },
    {
      name: 'seoMetadata',
      type: 'group',
      label: 'SEO & Location Metadata',
      fields: [
        {
          name: 'latitude',
          type: 'text',
          label: 'Latitude',
          admin: {
            description: 'Optional. e.g. 46.8682 (used for proximity maps indexing)',
          },
          validate: (value: unknown) => {
            if (value === null || value === undefined || value === '') return true
            const latitude = Number(value)
            return (
              (Number.isFinite(latitude) && latitude >= -90 && latitude <= 90) ||
              'Latitude must be a number between -90 and 90.'
            )
          },
        },
        {
          name: 'longitude',
          type: 'text',
          label: 'Longitude',
          admin: {
            description: 'Optional. e.g. -114.0264 (used for proximity maps indexing)',
          },
          validate: (value: unknown) => {
            if (value === null || value === undefined || value === '') return true
            const longitude = Number(value)
            return (
              (Number.isFinite(longitude) && longitude >= -180 && longitude <= 180) ||
              'Longitude must be a number between -180 and 180.'
            )
          },
        },
        {
          name: 'ownerName',
          type: 'text',
          label: 'Owner / Founder / President Name',
          admin: {
            description: 'Optional name of the key owner or president (e.g. Bob Atkinson)',
          },
        },
        {
          name: 'ownerTitle',
          type: 'text',
          label: 'Owner / Founder Title',
          defaultValue: 'Owner',
          admin: {
            description: 'e.g. President, Owner, Co-Founder',
          },
        },
        {
          name: 'googleMapsCid',
          type: 'text',
          label: 'Google Maps CID',
          admin: {
            description:
              'The raw, numeric Google Knowledge Graph Customer ID (CID). Example: 17436665727103444855. Do NOT paste the full maps URL here — numbers only.',
          },
          validate: (val: unknown) => {
            if (!val) return true // Optional field
            if (typeof val !== 'string') return 'CID must be a string of digits.'
            return /^\d+$/.test(val) || 'The CID must consist of numbers only.'
          },
        },
      ],
    },
    {
      name: 'notionStatus',
      type: 'select',
      options: [
        { label: 'Research', value: 'research' },
        { label: 'Draft Ready', value: 'draft-ready' },
        { label: 'In Edit', value: 'in-edit' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'research',
    },
    {
      name: 'city',
      type: 'select',
      options: [
        { label: 'Missoula', value: 'missoula' },
        { label: 'Great Falls', value: 'great-falls' },
        { label: 'Billings', value: 'billings' },
        { label: 'Helena', value: 'helena' },
        { label: 'Bozeman', value: 'bozeman' },
        { label: 'Kalispell', value: 'kalispell' },
        { label: 'Lolo', value: 'lolo' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'marketingFootprintGrade',
      type: 'select',
      options: [
        { label: 'A', value: 'A' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B', value: 'B' },
        { label: 'B-', value: 'B-' },
        { label: 'C+', value: 'C+' },
        { label: 'C', value: 'C' },
        { label: 'C-', value: 'C-' },
        { label: 'D', value: 'D' },
        { label: 'F', value: 'F' },
        { label: 'Pending', value: 'Pending' },
      ],
    },
    {
      name: 'openQuestions',
      type: 'textarea',
    },
    {
      name: 'dateResearched',
      type: 'date',
    },
    {
      name: 'researchNotes',
      type: 'textarea',
      label: 'Research Notes (Internal)',
      admin: {
        description: 'Internal research notes synced from Notion.',
      },
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data && data.businessName) {
              return data.businessName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
}
