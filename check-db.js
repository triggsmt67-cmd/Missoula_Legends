
import { getPayload } from 'payload'
import config from './src/payload.config.ts'

async function check() {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'articles',
      depth: 1,
      sort: '-createdAt',
    })
    console.log(`Found ${res.docs.length} articles.`)
    for (const article of res.docs) {
      console.log(`Article: ${article.title} (updated: ${article.updatedAt})`)
      console.log(`  heroImage ID: ${article.heroImage?.id}, URL: ${article.heroImage?.url}`)
      if (article.id === 1 || article.title.includes('Black Coffee')) {
        console.log(`  content:`, JSON.stringify(article.content, null, 2))
      }
    }
  } catch (err) {
    console.error(err)
  }
}
check()
