import test from 'node:test'
import assert from 'node:assert/strict'
import { loadSource } from './load-source.mjs'

export function nodesOf(tree) {
  const nodes = []
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit)
    if (!node || typeof node !== 'object') return
    nodes.push(node)
    visit(node.props?.children)
  }
  visit(tree)
  return nodes
}

function schemasOf(tree) {
  return nodesOf(tree)
    .filter(node => node.type === 'script' && node.props.type === 'application/ld+json')
    .flatMap(node => JSON.parse(node.props.dangerouslySetInnerHTML.__html))
}

test('history stories describe articles and actual location text without invented founding dates or postal addresses', async () => {
  const story = { id: 1, title: 'Early Smokejumpers', slug: 'smokejumpers', year: '1940s',
    location: 'Camp Menard, Ninemile Valley, near Huson, Montana', content: 'Historical account.' }
  const page = loadSource('src/app/(app)/history/[slug]/page.tsx', {
    payload: { getPayload: async () => ({ find: async () => ({ docs: [story] }) }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true },
  })
  const schema = schemasOf(await page.default({ params: Promise.resolve({ slug: story.slug }) }))
  const article = schema.find(item => item['@type'] === 'BlogPosting')
  assert.equal(article.contentLocation['@type'], 'Place')
  assert.equal(article.contentLocation.name, story.location)
  assert.equal(article.author.url, 'https://www.missoulalegends.com/#curator')
  assert.equal(article.publisher.logo.url, 'https://www.missoulalegends.com/logo.webp')
  assert.equal(article.datePublished, undefined)
  assert.doesNotMatch(JSON.stringify(schema), /HistoricalLandmark|foundingDate|PostalAddress|#landmark/)
})

test('unknown editorial dates are omitted and known dates remain stable', () => {
  const { schemaDate } = loadSource('src/lib/editorial-schema.ts')
  assert.equal(schemaDate(), undefined)
  assert.equal(schemaDate('not a date'), undefined)
  assert.equal(schemaDate('2026-11-25T23:08:20Z'), '2026-11-25T23:08:20.000Z')
})

test('towing and combined plumbing categories emit defined Schema.org business types', () => {
  const { getBusinessSchemaType } = loadSource('src/lib/schema-utils.ts')
  assert.equal(getBusinessSchemaType('towing'), 'AutomotiveBusiness')
  assert.equal(getBusinessSchemaType('plumbing-hvac'), 'HomeAndConstructionBusiness')
})

test('reviewed businesses keep their actual roles in every schema builder', () => {
  const { getBusinessSchemaType } = loadSource('src/lib/schema-utils.ts')
  for (const name of ['Great Burn Brewing', 'Draught Works', 'Big Sky Brewing Company', 'Bayern Brewing, Inc.']) {
    assert.equal(getBusinessSchemaType('food-drink', name), 'Brewery')
  }
  assert.equal(getBusinessSchemaType('automotive', 'Deals on Wheels'), 'AutoDealer')
  assert.equal(getBusinessSchemaType('automotive', 'Other automotive business'), 'AutomotiveBusiness')
  assert.equal(getBusinessSchemaType('plumbing-hvac', 'Temp Right Service'), 'HVACBusiness')
  assert.deepEqual(getBusinessSchemaType('plumbing-hvac', 'Garden City Plumbing & Heating'), ['Plumber', 'HVACBusiness'])
})

test('a filtered directory graph contains exactly the initial visible businesses', async () => {
  const listings = [
    { id: 1, businessName: 'Shop', slug: 'shop', category: 'shopping' },
    { id: 2, businessName: 'Garage', slug: 'garage', category: 'auto-repair' },
    { id: 3, businessName: 'Towing', slug: 'towing', category: 'towing' },
  ]
  const page = loadSource('src/app/(app)/directory/page.tsx', {
    payload: { getPayload: async () => ({ find: async () => ({ docs: listings }) }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true },
    'next/dynamic': () => 'DirectorySearchSection',
  })
  const schemas = schemasOf(await page.default({ searchParams: Promise.resolve({ category: 'automotive' }) }))
  const list = schemas[0].mainEntity
  assert.equal(list.numberOfItems, 2)
  assert.deepEqual(list.itemListElement.map(item => item.item.name), ['Garage', 'Towing'])
  assert.equal(schemas[0].url, 'https://www.missoulalegends.com/directory/category/automotive')
})

test('search URLs initialize the client input and schema from both supported query names', async () => {
  const page = loadSource('src/app/(app)/directory/page.tsx', {
    payload: { getPayload: async () => ({ find: async () => ({ docs: [
      { id: 1, businessName: 'Blackfoot Outfitters', slug: 'blackfoot', category: 'lifestyle' },
      { id: 2, businessName: 'Different Shop', slug: 'shop', category: 'shopping' },
    ] }) }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true },
    'next/dynamic': () => 'DirectorySearchSection',
  })
  for (const key of ['search', 'q']) {
    const props = { searchParams: Promise.resolve({ [key]: ' Blackfoot ' }) }
    const tree = await page.default(props)
    const client = nodesOf(tree).find(node => node.type === 'DirectorySearchSection')
    assert.equal(client.props.initialQuery, 'Blackfoot')
    assert.equal(schemasOf(tree)[0].mainEntity.numberOfItems, 1)
    const metadata = await page.generateMetadata(props)
    assert.equal(metadata.robots.index, false)
    assert.equal(metadata.alternates.canonical, '/directory')
  }
  const invalidCategory = await page.generateMetadata({ searchParams: Promise.resolve({ category: 'does-not-exist' }) })
  assert.equal(invalidCategory.alternates.canonical, '/directory')
})

test('empty categories stay out of indexing until a public listing exists', async () => {
  let totalDocs = 0
  const page = loadSource('src/app/(app)/directory/category/[slug]/page.tsx', {
    payload: { getPayload: async () => ({ count: async options => {
      assert.equal(options.overrideAccess, false)
      assert.match(JSON.stringify(options.where), /published|unlisted/)
      return { totalDocs }
    } }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true },
  })
  const props = { params: Promise.resolve({ slug: 'home-lodging' }) }
  assert.equal((await page.generateMetadata(props)).robots.index, false)
  totalDocs = 1
  const metadata = await page.generateMetadata(props)
  assert.equal(metadata.robots.index, true)
  assert.equal(metadata.alternates.canonical, '/directory/category/home-lodging')
})

test('sitemap includes populated parent categories and omits empty categories', async () => {
  const { default: sitemap } = loadSource('src/app/sitemap.ts', {
    payload: { getPayload: async () => ({ find: async options => ({ docs: options.collection === 'directory' ? [
      { slug: 'tow-shop', category: 'towing', updatedAt: '2026-11-25T00:00:00Z' },
    ] : [] }) }) },
    '@/lib/runtime-config': { isPayloadConfigured: () => true, getSiteUrl: () => 'https://www.missoulalegends.com', getStaticLastModified: () => new Date('2026-11-25') },
  })
  const urls = (await sitemap()).map(item => item.url)
  assert.ok(urls.includes('https://www.missoulalegends.com/directory/category/automotive'))
  assert.ok(!urls.includes('https://www.missoulalegends.com/directory/category/home-lodging'))
})
