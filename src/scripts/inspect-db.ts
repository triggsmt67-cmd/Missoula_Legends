import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  console.log('--- Inspecting Restored Payload Database ---')
  const payload = await getPayload({ config })

  const directoryDocs = await payload.find({
    collection: 'directory',
    limit: 10,
    depth: 1,
  })
  
  console.log('\nDirectory listings found:', directoryDocs.docs.length)
  directoryDocs.docs.forEach(doc => {
    console.log(`- ID: ${doc.id}, Business: ${doc.businessName}`)
    console.log(`  Featured Image:`, doc.featuredImage)
  })

  const mediaDocs = await payload.find({
    collection: 'media',
    limit: 20,
    depth: 0,
  })
  console.log('\nMedia files found:', mediaDocs.docs.length)
  mediaDocs.docs.forEach(doc => {
    console.log(`- ID: ${doc.id}, Filename: ${doc.filename}, URL: ${doc.url}`)
  })
}

run().catch(console.error)
