import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSource } from './load-source.mjs'

const routes = [
  ['articles', 'src/app/(app)/articles/[slug]/page.tsx', 'Articles'],
  ['history', 'src/app/(app)/history/[slug]/page.tsx', 'History'],
  ['directory', 'src/app/(app)/directory/[slug]/page.tsx', 'Directory'],
]

for (const [collection, file, exportName] of routes) {
  test(`${collection}: public detail and metadata reject drafts, retain published records`, async () => {
    const config = loadSource(`src/collections/${exportName}.ts`)[exportName]
    let published = false
    const calls = []
    const payload = {
      async find(options) {
        calls.push(options)
        assert.equal(options.overrideAccess, false, 'anonymous reads must enforce CMS access')
        if (options.collection !== collection) return { docs: [] }
        const access = config.access.read({ req: { user: null } })
        assert.equal(access._status.equals, 'published')
        if (!published) return { docs: [] }
        return { docs: [{ id: 1, slug: 'test-story', title: 'Published title', businessName: 'Published business',
          category: 'shopping', listingStatus: 'listed', _status: 'published', content: 'Public copy', description: 'Public copy', relatedBusiness: [] }] }
      },
      async findGlobal(options) { assert.equal(options.overrideAccess, false); return {} },
    }
    const page = loadSource(file, {
      payload: { getPayload: async () => payload },
      '@/lib/runtime-config': { isPayloadConfigured: () => true },
      'next/navigation': { notFound() { throw new Error('NOT_FOUND') } },
    })
    const params = { params: Promise.resolve({ slug: 'test-story' }) }
    await assert.rejects(page.default(params), /NOT_FOUND/)
    const draftMetadata = await page.generateMetadata(params)
    assert.doesNotMatch(JSON.stringify(draftMetadata), /Published title|Published business/)
    published = true
    const metadata = await page.generateMetadata(params)
    assert.match(JSON.stringify(metadata), /Published title|Published business/)
    const rendered = await page.default(params)
    assert.ok(rendered)
    assert.ok(calls.length >= 4)
  })
}

test('internal directory fields require an authenticated CMS user', () => {
  const { Directory } = loadSource('src/collections/Directory.ts')
  for (const name of ['researchNotes', 'openQuestions', 'marketingFootprintGrade']) {
    const field = Directory.fields.find((field) => field.name === name)
    assert.equal(field.access.read({ req: { user: null } }), false)
    assert.equal(field.access.read({ req: { user: { id: 1 } } }), true)
  }
})

test('public directory projection excludes private and unexpected nested properties', () => {
  const { toPublicDirectoryListing } = loadSource('src/lib/public-directory.ts')
  const result = toPublicDirectoryListing({
    id: 1, businessName: 'Public shop', description: 'Searchable public description',
    researchNotes: 'PRIVATE', openQuestions: 'PRIVATE', marketingFootprintGrade: 'PRIVATE', futurePrivateField: 'PRIVATE',
    contactInfo: { phone: '406-555-0100', address: 'Public shop address', privateContact: 'PRIVATE' },
    featuredImage: { alt: 'Public photo', url: '/photo.webp', privateMetadata: 'PRIVATE', sizes: { thumbnail: { url: '/thumb.webp', privateMetadata: 'PRIVATE' } } },
  })
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE/)
  assert.equal(result.businessName, 'Public shop')
  assert.equal(result.description, 'Searchable public description')
  assert.equal(result.contactInfo.phone, '406-555-0100')
  assert.equal(result.featuredImage.sizes.thumbnail.url, '/thumb.webp')
})

test('the directory page passes only public records into its actual client props', async () => {
  const page = loadSource('src/app/(app)/directory/page.tsx', {
    payload: { getPayload: async () => ({ find: async (options) => {
      assert.equal(options.overrideAccess, false)
      return { docs: [{ id: 1, businessName: 'Public shop', slug: 'public-shop', category: 'shopping',
        description: 'Public description', researchNotes: 'PRIVATE', futurePrivateField: 'PRIVATE',
        contactInfo: { phone: '406-555-0100', privateContact: 'PRIVATE' } }] }
    } }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true },
    'next/dynamic': () => 'DirectorySearchSection',
  })
  const rendered = await page.default({ searchParams: Promise.resolve({}) })
  const nodes = [rendered]
  let clientProps
  while (nodes.length > 0) {
    const node = nodes.pop()
    if (node?.type === 'DirectorySearchSection') clientProps = node.props
    const children = node?.props?.children
    if (Array.isArray(children)) nodes.push(...children)
    else if (children && typeof children === 'object') nodes.push(children)
  }
  assert.ok(clientProps)
  const serialized = JSON.stringify(clientProps)
  assert.doesNotMatch(serialized, /PRIVATE/)
  assert.match(serialized, /Public shop/)
})
