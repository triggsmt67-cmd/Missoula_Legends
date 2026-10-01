import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'

const nativeRequire = createRequire(import.meta.url)
const root = path.resolve(import.meta.dirname, '..')
// Real application modules, mocked infrastructure only. No Payload config or DB can load.
function loadModule(relative, mocks = {}, env = {}) {
  const cache = new Map()
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports
    const source = fs.readFileSync(file, 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    }}).outputText
    const loaded = { exports: {} }
    cache.set(file, loaded)
    function requireModule(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name]
      if (name === '@payload-config') return { default: {} }
      if (name === 'payload') throw new Error('Real CMS access prohibited in regression tests')
      if (name === 'server-only') return {}
      if (name.startsWith('@/') || name.startsWith('.')) {
        const target = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : path.resolve(path.dirname(file), name)
        const resolved = [target, target + '.ts', target + '.tsx', target + '.js'].find(p => fs.existsSync(p) && fs.statSync(p).isFile())
        if (!resolved) throw new Error(`Unresolved fixture module: ${name}`)
        return load(resolved)
      }
      return nativeRequire(name)
    }
    vm.runInNewContext(compiled, { exports: loaded.exports, module: loaded, require: requireModule,
      process: { env: { NODE_ENV: 'production', ...env } },
      console: { log() {}, warn() {}, error() {} }, URL, Request, Response, Buffer, setTimeout, clearTimeout,
    }, { filename: file })
    return loaded.exports
  }
  return load(path.join(root, relative))
}
const nextResponse = { NextResponse: { json: (data, init) => Response.json(data, init) } }
const richText = text => ({ type: 'rich_text', rich_text: [{ plain_text: text.slice(0, 7) }, { text: { content: text.slice(7) } }] })
function syncFixture(existing = [], env = {}) {
  const writes = [], paths = []
  const payload = {
    find: async () => ({ docs: existing }),
    create: async options => { writes.push(options); return { id: 1, ...options.data } },
    update: async options => { writes.push(options); return { id: options.id, ...options.data } },
  }
  const route = loadModule('src/app/api/notion-sync/route.ts', {
    'payload': { getPayload: async () => payload },
    'next/server': nextResponse,
    'next/cache': { revalidatePath: p => paths.push(p) },
  }, { NOTION_SYNC_SECRET: 'fixture-secret', ...env })
  return { writes, paths, post: (body, auth = 'Bearer fixture-secret') => route.POST(new Request('https://fixture.invalid/api/notion-sync', {
    method: 'POST', headers: { authorization: auth, 'content-type': 'application/json' }, body: JSON.stringify(body),
  })) }
}
const core = { 'Business Name': 'Dirtman Sprinklers', Category: 'Tradesmen', Status: 'Published', 'Profile Slug': 'dirtman-sprinklers-missoula' }
for (const [label, wrap] of [
  ['flat', p => p], ['properties', p => ({ properties: p })],
  ['data.properties', p => ({ data: { properties: p } })], ['entity.properties', p => ({ entity: { properties: p } })],
]) test(`Notion ${label} fills all three requested fields`, async () => {
  const fixture = syncFixture()
  const description = 'Local irrigation service.\n\n**Repairs and maintenance** for Missoula homes.'
  const response = await fixture.post(wrap({ ...core, Neighborhood: richText('Southgate Triangle'),
    'Neighborhood Context': richText('Across from Southgate Mall.'), Description: richText(description) }))
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.success, true)
  assert.equal(fixture.writes.length, 1)
  assert.equal(fixture.writes[0].data.neighborhood, 'southgate-triangle')
  assert.equal(fixture.writes[0].data.neighborhoodContext, 'Across from Southgate Mall.')
  assert.equal(fixture.writes[0].data.description, description)
  assert.equal(fixture.writes[0].data._status, 'published')
  assert.ok(result.mappedFields.includes('description'))
  assert.ok(fixture.paths.includes('/directory/dirtman-sprinklers-missoula'))
})
test('Notion enums, structured arrays and editorial alias normalize correctly', async () => {
  const f = syncFixture()
  await f.post({ ...core, Category: { type: 'multi_select', multi_select: [{ name: 'Health $ Wellness' }] },
    Neighborhood: 'Downtown Missoula — East Spruce Street', 'Neighborhood Context (Editorial)': '**Along** <b>the Hip Strip</b>',
    Description: 'Full description', 'quick_facts': 'Locally owned\nEstablished 2000', services: 'Repair; Maintenance', faqs: 'Q: Open?\nA: Weekdays.' })
  const data = f.writes[0].data
  assert.equal(data.category, 'health-wellness')
  assert.equal(data.neighborhood, 'downtown')
  assert.equal(data.neighborhoodContext, 'Along the Hip Strip')
  assert.equal(data.quickFacts.length, 2)
  assert.equal(data.services.length, 2)
  assert.equal(data.faqs[0].answer, 'Weekdays.')
})
test('Partial webhook preserves publication and omitted descriptive/array fields', async () => {
  const f = syncFixture([{ id: 9, _status: 'published', listingStatus: 'featured' }])
  const response = await f.post({ 'Business Name': core['Business Name'], Category: 'Tradesmen' })
  const { data, draft } = f.writes[0]
  for (const key of ['description', 'neighborhoodContext', 'quickFacts', 'services', 'faqs', '_status', 'listingStatus']) assert.equal(Object.hasOwn(data, key), false, key)
  assert.equal(draft, false)
  assert.ok((await response.json()).warnings.some(w => w.includes('Description is absent')))
})
test('Explicit blank values clear previously filled fields', async () => {
  const f = syncFixture([{ id: 9, _status: 'published', listingStatus: 'listed' }])
  await f.post({ ...core, Neighborhood: '', 'Neighborhood Context': '', Description: '' })
  assert.equal(f.writes[0].data.neighborhood, null)
  assert.equal(f.writes[0].data.neighborhoodContext, '')
  assert.equal(f.writes[0].data.description, '')
})
test('Unknown neighborhood warns without guessing or erasing existing selection', async () => {
  const f = syncFixture([{ id: 9, _status: 'published', listingStatus: 'listed' }])
  const response = await f.post({ ...core, Neighborhood: 'Unknown business park', Description: 'Text' })
  assert.equal(Object.hasOwn(f.writes[0].data, 'neighborhood'), false)
  assert.ok((await response.json()).warnings.some(w => w.includes('Unknown Neighborhood')))
})
for (const mode of ['production', 'development']) test(`Notion rejects unauthenticated ${mode} writes`, async () => {
  const f = syncFixture([], { NODE_ENV: mode })
  assert.equal((await f.post(core, 'Bearer wrong')).status, 401)
  assert.equal(f.writes.length, 0)
})
test('Malformed webhook structures cannot write to CMS', async () => {
  const f = syncFixture()
  for (const input of [null, [], { properties: 'wrong' }]) assert.equal((await f.post(input)).status, 400)
  assert.equal(f.writes.length, 0)
})
test('Every known neighborhood option and representative editorial phrases map', () => {
  const { mapNeighborhood, NEIGHBORHOOD_OPTIONS } = loadModule('src/lib/neighborhoods.ts')
  for (const { label, value } of NEIGHBORHOOD_OPTIONS) {
    assert.equal(mapNeighborhood(label), value)
    assert.equal(mapNeighborhood(value), value)
  }
  for (const [input, expected] of [
    ['Lower Rattlesnake / Downtown edge', 'rattlesnake'], ['Orchard Homes, along South Third Street West', 'orchard-homes-target-range'],
    ['Hip Strip / South Higgins', 'hip-strip'], ['Franklin to the Fort area', 'franklin-to-the-fort'],
    ['Airport / I-90 Exit 99 area', 'airport'], ['Southgate Triangle', 'southgate-triangle'],
  ]) assert.equal(mapNeighborhood(input), expected)
  assert.equal(mapNeighborhood('Missoula Development Park'), 'missoula-development-park')
  assert.equal(mapNeighborhood('Unknown business park'), undefined)
})
test('JSON-LD script terminators are escaped and original data round-trips', () => {
  const { serializeJsonLd } = loadModule('src/lib/schema-utils.ts')
  const value = { name: '</script><script>alert(1)</script>', description: 'Backslash \\ and quotes "' }
  const serialized = serializeJsonLd(value)
  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), value)
})
test('Internal notes field ACL denies anonymous readers and permits authenticated editors', () => {
  const { Directory } = loadModule('src/collections/Directory.ts')
  for (const name of ['researchNotes', 'openQuestions']) {
    const field = Directory.fields.find(f => f.name === name)
    assert.equal(field.access.read({ req: { user: null } }), false)
    assert.equal(field.access.read({ req: { user: { id: 1 } } }), true)
  }
})
test('Cache revalidation requires a secret and valid public page path', async () => {
  const paths = []
  const route = loadModule('src/app/api/revalidate/route.ts', {
    'next/server': nextResponse, 'next/cache': { revalidatePath: p => paths.push(p) },
  }, { REVALIDATE_SECRET: 'fixture-secret' })
  const req = (p, token) => new Request('https://fixture.invalid/api/revalidate', {
    method: 'POST', headers: { authorization: token || '', 'content-type': 'application/json' }, body: JSON.stringify({ path: p }),
  })
  assert.equal((await route.POST(req('/', 'wrong'))).status, 401)
  assert.equal((await route.POST(req('/admin', 'Bearer fixture-secret'))).status, 400)
  assert.equal((await route.POST(req('//external.invalid', 'Bearer fixture-secret'))).status, 400)
  assert.equal((await route.POST(req('/directory/dirtman-sprinklers-missoula', 'Bearer fixture-secret'))).status, 200)
  assert.deepEqual(paths, ['/directory/dirtman-sprinklers-missoula'])
  assert.equal(route.GET, undefined)
})
for (const collection of ['articles', 'history', 'directory']) test(`Public ${collection} detail rejects draft-only records`, async () => {
  const doc = { id: 1, slug: 'private-draft', title: 'Private draft', businessName: 'Private draft', _status: 'draft', listingStatus: 'listed' }
  const queryOptions = []
  const page = loadModule(`src/app/(app)/${collection}/[slug]/page.tsx`, {
    'payload': { getPayload: async () => ({ find: async o => { queryOptions.push(o); return { docs: o.overrideAccess === false ? [] : [doc] } } }) },
    'next/navigation': { notFound: () => { throw new Error('NOT_FOUND') }, redirect: () => { throw new Error('REDIRECT') } },
    '@/lib/sponsorship': { getActiveSponsorPlacement: async () => null },
  }, { PAYLOAD_SECRET: 'fixture-only', DATABASE_URI: 'postgres://fixture.invalid/unused' })
  await assert.rejects(page.default({ params: Promise.resolve({ slug: 'private-draft' }) }), /NOT_FOUND/)
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: 'private-draft' }) })
  assert.notEqual(metadata.title, 'Private draft')
  assert.ok(queryOptions.length >= 2)
  assert.ok(queryOptions.every(o => o.overrideAccess === false))
})
test('Claim provider failures return an error rather than false success', async () => {
  const route = loadModule('src/app/api/claim/route.ts', {
    'next/server': nextResponse,
    resend: { Resend: class { emails = { send: async () => ({ error: { message: 'Fixture delivery failure' } }) } } },
  }, { RESEND_API_KEY: 'fixture-only' })
  const data = new FormData()
  data.set('bizname', 'Fixture business'); data.set('yourname', 'Fixture user'); data.set('contact', 'fixture@example.com')
  const response = await route.POST(new Request('https://fixture.invalid/api/claim', { method: 'POST', body: data }))
  assert.equal(response.status, 502)
})

test('Published profile renders the mapped neighborhood, editorial context, description and schema', async () => {
  const doc = { id: 99, slug: 'audit-fixture', businessName: 'Audit Fixture', _status: 'published', listingStatus: 'listed', category: 'tradesmen', neighborhood: 'southgate-triangle', neighborhoodContext: 'Across from Southgate Mall.', description: 'Fixture description from the Notion rich text field.' }
  const page = loadModule('src/app/(app)/directory/[slug]/page.tsx', {
    payload: { getPayload: async () => ({ find: async o => ({ docs: o.collection === 'directory' && o.where?.slug ? [doc] : [] }) }) },
    '@/lib/sponsorship': { getActiveSponsorPlacement: async () => null },
  }, { PAYLOAD_SECRET: 'fixture-only', DATABASE_URI: 'postgres://fixture.invalid/unused' })
  const { renderToStaticMarkup } = nativeRequire('react-dom/server')
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: doc.slug }) }))
  assert.ok(html.includes('Southgate Triangle'))
  assert.ok(html.includes(doc.neighborhoodContext))
  assert.ok(html.includes(doc.description))
  assert.ok(html.includes('disambiguatingDescription'))
})

test('Sponsor tracking treats malicious sponsor text as data and fires only for its link', () => {
  const { SponsorTrackingLink } = loadModule('src/components/SponsorTrackingLink.tsx')
  const link = SponsorTrackingLink({ sponsorName: "</script><script>alert(1)</script>", placement: 'directory', href: 'https://fixture.invalid' })
  const { renderToStaticMarkup } = nativeRequire('react-dom/server')
  const html = renderToStaticMarkup(link)
  assert.equal(html.includes('<script'), false)
  assert.equal(link.type, 'a')
  assert.equal(typeof link.props.onClick, 'function')
})

test('Notion preserves an existing public slug when a unique exact-name match exists', async () => {
  const writes = []
  const route = loadModule('src/app/api/notion-sync/route.ts', {
    payload: { getPayload: async () => ({
      find: async options => ({ docs: options.where.businessName ? [{ id: 106, slug: 'dirtman-sprinklers', _status: 'published' }] : [] }),
      update: async options => { writes.push(options); return { id: 106, ...options.data } },
      create: async () => { throw new Error('Must not create a duplicate') },
    }) },
    'next/server': nextResponse,
    'next/cache': { revalidatePath() {} },
  }, { NOTION_SYNC_SECRET: 'fixture-secret' })
  const response = await route.POST(new Request('https://fixture.invalid/api/notion-sync', { method: 'POST', headers: { authorization: 'Bearer fixture-secret', 'content-type': 'application/json' }, body: JSON.stringify({ ...core, Description: 'Text' }) }))
  assert.equal(response.status, 200)
  assert.equal(writes[0].id, 106)
  assert.equal(writes[0].data.slug, 'dirtman-sprinklers')
})
