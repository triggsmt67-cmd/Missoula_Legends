// Seed data for Missoula Legends

export const seedMedia = [
  {
    alt: 'Exterior facade of Black Coffee Roasters on the Hip Strip with wood-fired roaster exhaust stack visible',
    filename: 'black-coffee.jpg',
  },
  {
    alt: 'The sprawling interior of Rockin Rudys record store filled with vinyl bins and local novelty items',
    filename: 'rockin-rudys.jpg',
  },
  {
    alt: 'Restored historic brick tasting room at Montgomery Distillery with copper distillation stills in the background',
    filename: 'montgomery-distillery.jpg',
  },
  {
    alt: 'Charming display window at Fact and Fiction Books featuring regional Montana authors and local novels',
    filename: 'fact-and-fiction.jpg',
  },
  {
    alt: 'Cozy community table at Burns Street Bistro in Missoula Northside serving fresh brunch and local coffee',
    filename: 'burns-street-bistro.jpg',
  },
  {
    alt: 'Trevor Riggs - Missoula Legends Curator',
    filename: 'missoula-curator.jpg',
  },
  {
    alt: 'Historic Wilma Theater Facade and Marquee in downtown Missoula',
    filename: 'missoula-history-site.jpg',
  },
  {
    alt: "Rockin' Rudy's Logo - Missoula's legendary independent record and gift shop since 1982",
    filename: 'logo-rockin-rudys.png',
  },
  {
    alt: "The Roxy Theater Logo - Community cinema and art house on Hip Strip",
    filename: 'logo-roxy-theater.png',
  },
  {
    alt: "Big Dipper Ice Cream Logo - Hand-crafted local ice cream made in Missoula",
    filename: 'logo-big-dipper.png',
  },
  {
    alt: "Le Petit Outre Logo - Artisan bakery and espresso bar",
    filename: 'logo-le-petit-outre.png',
  },
  {
    alt: "Runner's Edge Logo - Locally owned running specialty store",
    filename: 'logo-runners-edge.png',
  },
  {
    alt: "Radius Gallery Logo - Contemporary fine art gallery in downtown Missoula",
    filename: 'logo-radius-gallery.png',
  },
]

export const seedDirectory = [
  {
    businessName: 'Black Coffee Roasters',
    category: 'food-drink',
    neighborhood: 'hip-strip',
    status: 'featured',
    description: 'An airy, modern café on Missoula\'s Hip Strip sourcing organic coffee beans directly and roasting them in-house. Known for their custom wood-fired roasting process, minimalist aesthetic, and incredible sourdough pastries.',
    mediaKey: 'black-coffee.jpg',
    contactInfo: {
      phone: '(406) 541-7400',
      website: 'https://www.blackcoffeeroasters.com',
      instagram: '@blackcoffeeroasters',
      address: '220 W Broadway St, Missoula, MT 59802',
    },
  },
  {
    businessName: 'Rockin\' Rudy\'s',
    category: 'shopping',
    neighborhood: 'hip-strip',
    status: 'featured',
    description: 'Missoula\'s legendary record store and novelty shop since 1982. A massive, maze-like space filled with vinyl, CDs, local gifts, toys, and eccentric novelties. A true cultural cornerstone of the Hip Strip.',
    mediaKey: 'rockin-rudys.jpg',
    contactInfo: {
      phone: '(406) 542-0077',
      website: 'https://www.rockinrudys.com',
      instagram: '@rockinrudys',
      address: '237 Blaine St, Missoula, MT 59801',
    },
  },
  {
    businessName: 'Montgomery Distillery',
    category: 'food-drink',
    neighborhood: 'downtown',
    status: 'featured',
    description: 'A family-owned craft distillery in the heart of Downtown Missoula, utilizing grains grown on their own ranch in Heath, Montana. Specializing in rye whiskey, gin, and vodka served in a beautifully restored historic brick tasting room.',
    mediaKey: 'montgomery-distillery.jpg',
    contactInfo: {
      phone: '(406) 926-1725',
      website: 'https://www.montgomerydistillery.com',
      instagram: '@montgomerydistillery',
      address: '129 W Front St, Missoula, MT 59802',
    },
  },
  {
    businessName: 'Fact & Fiction Books',
    category: 'shopping',
    neighborhood: 'downtown',
    status: 'featured',
    description: 'Missoula\'s independent bookstore supporting regional authors and local literature since 1986. Located Downtown, it offers a carefully curated collection of fiction, Montana history, and children\'s literature, along with hosting frequent literary readings.',
    mediaKey: 'fact-and-fiction.jpg',
    contactInfo: {
      phone: '(406) 721-2881',
      website: 'https://www.factandfictionbooks.com',
      instagram: '@factandfictionbooks',
      address: '220 N Higgins Ave, Missoula, MT 59802',
    },
  },
  {
    businessName: 'Burns Street Bistro',
    category: 'food-drink',
    neighborhood: 'northside',
    status: 'featured',
    description: 'A hidden community culinary gem nestled in Missoula\'s historic Northside neighborhood. Burns Street Bistro serves inventive, locally-sourced breakfast and brunch, and hosts neighborhood culinary events in a warm, welcoming community-focused space.',
    mediaKey: 'burns-street-bistro.jpg',
    contactInfo: {
      phone: '(406) 543-0711',
      website: 'https://www.burnsstreetbistro.com',
      instagram: '@burnsstreetbistro',
      address: '1500 Burns St, Missoula, MT 59802',
    },
  },
]

export const seedArticles = [
  {
    title: 'Roasting with Wood Fire: The Art of Black Coffee in Missoula',
    slug: 'roasting-with-wood-fire-black-coffee-missoula',
    mediaKey: 'black-coffee.jpg',
    relatedBusinessName: 'Black Coffee Roasters',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'The Heat of the Hearth',
                version: 1,
              },
            ],
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Tucked away just off Higgins Avenue on the Hip Strip, the aroma of roasting beans blends with a faint, sweet scent of burning larch. This is Black Coffee Roasters, where the ancient art of wood-fired roasting is kept alive. In a world dominated by gas-powered automated roasters, owner Jim Litz prefers the tactile, unpredictable romance of fire.',
                version: 1,
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A Slower, Better Burn',
                version: 1,
              },
            ],
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Jim adjusts the dampers on the custom Italian roaster, letting the wood smoke gently coat the green beans. The wood-fired process yields a deeper, rounder flavor profile, smoothing out acidity and introducing subtle caramel notes that are hard to replicate. It\'s a Missoula staple that honors both local forestry and the pursuit of the perfect cup.',
                version: 1,
              },
            ],
          },
        ],
      },
    },
  },
  {
    title: 'Forty Years of Vinyl and Weirdness: Inside Rockin\' Rudy\'s',
    slug: 'forty-years-vinyl-weirdness-rockin-rudys',
    mediaKey: 'rockin-rudys.jpg',
    relatedBusinessName: 'Rockin\' Rudy\'s',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Missoula\'s Maze of Wonders',
                version: 1,
              },
            ],
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Walk through the double doors of Rockin\' Rudy\'s, and the sensory overload is immediate. Vinyl records click in their bins, the smell of incense floats from the back corner, and gag gifts share shelf space with local art. For over four decades, Rudy\'s has served as the heartbeat of Missoula\'s alternative community.',
                version: 1,
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'More Than a Record Store',
                version: 1,
              },
            ],
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Started in 1982, Rockin\' Rudy\'s has survived the rise and fall of cassettes, CDs, MP3s, and streaming, only to see vinyl roar back to life. But it\'s the sense of community that keeps locals coming back. It\'s where high schoolers buy their first concert tickets, and visitors get a true taste of Missoula\'s quirky spirit.',
                version: 1,
              },
            ],
          },
        ],
      },
    },
  },
  {
    title: 'Distilling Montana Heritage: The Montgomery Family Legacy',
    slug: 'distilling-montana-heritage-montgomery-distillery',
    mediaKey: 'montgomery-distillery.jpg',
    relatedBusinessName: 'Montgomery Distillery',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'The Heritage of the Still',
                version: 1,
              },
            ],
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Located on Front Street in downtown Missoula, Montgomery Distillery is a family-owned operation crafting old-world spirits from local Montana grains. Using grains grown on their family farm in nearby Heath, they oversee the entire process from planting to bottle, producing award-winning gin, vodka, and single-malt whiskey that captures the true flavor of the region.',
                version: 1,
              },
            ],
          },
        ],
      },
    },
  },
]

