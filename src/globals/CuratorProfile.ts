import type { GlobalConfig } from 'payload'

export const CuratorProfile: GlobalConfig = {
  slug: 'curator-profile',
  label: 'Curator Profile',
  admin: {
    description: 'Manage the Curator spotlight that appears on the home page and stories sidebar.',
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
        revalidatePath('/stories')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Trevor Riggs',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Missoula Curator • Marketing Strategist',
      admin: {
        description: 'Subtitle shown below the name (e.g. "Missoula Curator • Marketing Strategist")',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      defaultValue:
        'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers. A native Montanan with a practical eye for what actually works, Trevor believes the best marketing starts close to the ground — with real businesses, real people, and the details most outsiders miss.',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Circular headshot photo displayed in the curator spotlight.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'trevor@missoulalegends.com',
    },
  ],
}
