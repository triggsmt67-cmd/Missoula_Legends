import { getPayload } from 'payload'
import config from '../payload.config'
import { seedMedia, seedDirectory, seedArticles } from '../data/seedData.js'

// 1x1 transparent PNG to act as a placeholder for local seeding
const dummyFileBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

async function seed() {
  console.log('--- Seeding Database for Missoula Legends ---')
  
  try {
    const payload = await getPayload({ config })

    // 1. Purge existing data
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
      collection: 'media',
      where: {},
    })
    console.log('Database collections cleared.')

    // 2. Seed Media Collection
    console.log('Seeding Media collection...')
    const mediaMap: { [key: string]: string } = {}
    
    for (const mediaItem of seedMedia) {
      console.log(`Creating media: ${mediaItem.filename}`)
      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: mediaItem.alt,
        },
        file: {
          data: dummyFileBuffer,
          name: mediaItem.filename,
          mimetype: 'image/png',
          size: dummyFileBuffer.length,
        },
      })
      mediaMap[mediaItem.filename] = doc.id as string
    }
    console.log('Media seeding completed.')

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
    console.log('--- Database successfully seeded with Missoula local listings! ---')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()
