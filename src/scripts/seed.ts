import { getPayload } from 'payload'
import config from '../payload.config'
import { seedMedia, seedDirectory, seedArticles } from '../data/seedData.js'
import fs from 'fs'
import path from 'path'

// 1x1 transparent PNG to act as a placeholder for local seeding
const dummyFileBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

async function seed() {
  console.log('--- Seeding Database for Missoula Legends ---')
  
  try {
    const payload = await getPayload({ config })

    // 1. Read files into memory before clearing anything
    console.log('Reading media files into memory...')
    const mediaBuffers: { [key: string]: { buffer: any; mimetype: string } } = {}
    
    for (const mediaItem of seedMedia) {
      const filePath = path.join(process.cwd(), 'public/media', mediaItem.filename)
      if (fs.existsSync(filePath)) {
        console.log(`Pre-loaded: ${mediaItem.filename}`)
        const fileBuffer = fs.readFileSync(filePath)
        let mimetype = 'image/png'
        const ext = path.extname(mediaItem.filename).toLowerCase()
        if (ext === '.jpg' || ext === '.jpeg') {
          mimetype = 'image/jpeg'
        } else if (ext === '.webp') {
          mimetype = 'image/webp'
        } else if (ext === '.png') {
          mimetype = 'image/png'
        }
        mediaBuffers[mediaItem.filename] = { buffer: fileBuffer, mimetype }
      } else {
        console.warn(`Pre-read: File not found at ${filePath}`)
      }
    }

    // 2. Purge existing data
    console.log('Clearing existing collection records...')
    await payload.delete({
      collection: 'articles',
      where: {},
    })
    await payload.delete({
      collection: 'directory',
      where: {},
    })
    await payload.delete({
      collection: 'history',
      where: {},
    })
    await payload.delete({
      collection: 'media',
      where: {},
    })
    await payload.delete({
      collection: 'partners',
      where: {},
    })
    console.log('Database collections cleared.')

    // 3. Seed Media Collection
    console.log('Seeding Media collection...')
    const mediaMap: { [key: string]: string } = {}
    
    for (const mediaItem of seedMedia) {
      console.log(`Creating media: ${mediaItem.filename}`)
      const preLoaded = mediaBuffers[mediaItem.filename]
      let fileBuffer: any = dummyFileBuffer
      let mimetype = 'image/png'
      
      if (preLoaded) {
        fileBuffer = preLoaded.buffer
        mimetype = preLoaded.mimetype
      } else {
        console.warn(`No preloaded buffer for ${mediaItem.filename}, falling back to 1x1 dummy placeholder`)
      }

      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: mediaItem.alt,
        },
        file: {
          data: fileBuffer,
          name: mediaItem.filename,
          mimetype: mimetype,
          size: fileBuffer.length,
        },
      })
      mediaMap[mediaItem.filename] = doc.id as string
    }
    console.log('Media seeding completed.')

    // Seeding Partners Collection
    console.log('Seeding Partners collection...')
    const partnerList = [
      { name: "Rockin' Rudy's", filename: 'logo-rockin-rudys.png', order: 1 },
      { name: "The Roxy Theater", filename: 'logo-roxy-theater.png', order: 2 },
      { name: "Big Dipper Ice Cream", filename: 'logo-big-dipper.png', order: 3 },
      { name: "Le Petit Outre", filename: 'logo-le-petit-outre.png', order: 4 },
      { name: "Runner's Edge", filename: 'logo-runners-edge.png', order: 5 },
      { name: "Radius Gallery", filename: 'logo-radius-gallery.png', order: 6 },
    ]

    for (const p of partnerList) {
      const logoImageId = mediaMap[p.filename]
      await payload.create({
        collection: 'partners',
        data: {
          name: p.name,
          logo: logoImageId,
          order: p.order,
          permissionStatus: 'approved',
        },
      })
    }
    console.log('Partners seeding completed.')

    // 3. Seed Directory Collection
    console.log('Seeding Directory collection...')
    const directoryMap: { [key: string]: string } = {}

    for (const directoryItem of seedDirectory) {
      console.log(`Creating directory listing: ${directoryItem.businessName}`)
      const featuredImageId = mediaMap[directoryItem.mediaKey]
      
      const doc = await payload.create({
        collection: 'directory',
        data: {
          businessName: directoryItem.businessName,
          category: directoryItem.category,
          neighborhood: directoryItem.neighborhood,
          description: directoryItem.description,
          featuredImage: featuredImageId,
          contactInfo: directoryItem.contactInfo,
          status: 'featured',
        },
      })
      directoryMap[directoryItem.businessName] = doc.id as string
    }
    console.log('Directory seeding completed.')

    // 4. Seed Articles Collection
    console.log('Seeding Articles collection...')
    for (const articleItem of seedArticles) {
      console.log(`Creating article: ${articleItem.title}`)
      const heroImageId = mediaMap[articleItem.mediaKey]
      const relatedBusinessId = directoryMap[articleItem.relatedBusinessName]

      await payload.create({
        collection: 'articles',
        data: {
          title: articleItem.title,
          slug: articleItem.slug,
          heroImage: heroImageId,
          content: articleItem.content,
          relatedBusiness: relatedBusinessId ? [relatedBusinessId] : [],
        },
      })
    }
    console.log('Articles seeding completed.')

    // 5. Seed History Collection
    console.log('Seeding History collection...')
    const historyImageId = mediaMap['missoula-history-site.jpg']
    await payload.create({
      collection: 'history',
      data: {
        title: "The Wilma Theatre: Missoula's Palace of Cinema",
        slug: 'the-wilma-theatre-palace-of-cinema',
        heroImage: historyImageId,
        year: '1921',
        location: '131 S Higgins Ave, Missoula, MT',
        excerpt: 'Since 1921, the Wilma Theatre has stood as a monument to arts and culture in downtown Missoula, hosting grand cinema screenings and live performances along the Clark Fork River.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
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
                    text: 'First opened in 1921 by William "Billy" Simons and named for his wife, light opera singer Wilma Simons, the Wilma Theatre is an iconic centerpiece of downtown Missoula. Designed as a grand eight-story "skyscraper" along the banks of the Clark Fork River, it housed a magnificent theater, offices, apartments, and a swimming pool in the basement. Over the decades, it has transitioned from vaudeville and silent films to a premier concert venue and the main screening site of the Missoula Film Festival. To this day, its glowing neon marquee acts as a warm beacon of arts and culture for the entire Garden City.',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
    })
    console.log('History seeding completed.')

    // 6. Seed Curator Profile Global
    console.log('Seeding Curator Profile global...')
    const curatorImageId = mediaMap['missoula-curator.jpg']
    await payload.updateGlobal({
      slug: 'curator-profile',
      data: {
        name: 'Trevor Riggs',
        title: 'Missoula Curator • Marketing Strategist',
        bio: 'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers. A native Montanan with a practical eye for what actually works, Trevor believes the best marketing starts close to the ground — with real businesses, real people, and the details most outsiders miss.',
        photo: curatorImageId || null,
        contactEmail: 'trevor@missoulalegends.com',
      },
    })
    console.log('Curator Profile global seeded.')

    console.log('--- Database successfully seeded with Missoula local listings! ---')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()
