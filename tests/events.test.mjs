import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSource } from './load-source.mjs'

const replacement = [
  { title: 'New music event', schedule: 'Friday', description: 'Public event' },
  { title: 'New community event', schedule: 'Saturday', description: 'Public event' },
]

function setup({ failInsert = false, failDelete = false, transaction = 1 } = {}) {
  let records = [{ id: 10, title: 'Existing event', featuredImage: 90 }]
  let staged
  let creates = 0
  let rollbacks = 0
  let commits = 0
  const payload = {
    db: {
      async beginTransaction() { staged = structuredClone(records); return transaction },
      async commitTransaction() { commits++; records = staged },
      async rollbackTransaction() { rollbacks++; staged = null },
    },
    async find(options) {
      assert.equal(options.req.transactionID, 1)
      assert.equal(options.pagination, false)
      return { docs: structuredClone(staged) }
    },
    async create(options) {
      assert.equal(options.collection, 'events')
      assert.equal(options.req.transactionID, 1)
      if (failInsert && creates === 1) throw new Error('Insert failed')
      staged.push({ ...options.data, id: 100 + creates++ })
    },
    async delete(options) {
      assert.equal(options.collection, 'events', 'shared media must never be deleted')
      assert.equal(options.req.transactionID, 1)
      assert.deepEqual(options.where.id.in, [10], 'delete only the captured previous records')
      staged = staged.filter((record) => !options.where.id.in.includes(record.id))
      return { errors: failDelete ? [{ message: 'Delete failed' }] : [] }
    },
  }
  const { replaceEvents } = loadSource('src/lib/replace-events.ts', {
    payload: { createLocalReq: async ({ req }) => req },
  })
  return { run: () => replaceEvents(payload, replacement), records: () => records, rollbacks: () => rollbacks, commits: () => commits }
}

test('a replacement insertion failure preserves the current calendar', async () => {
  const state = setup({ failInsert: true })
  await assert.rejects(state.run(), /Insert failed/)
  assert.equal(state.records()[0].title, 'Existing event')
  assert.equal(state.records()[0].featuredImage, 90)
  assert.equal(state.rollbacks(), 1)
  assert.equal(state.commits(), 0)
})

test('a bulk deletion failure rolls back the entire replacement', async () => {
  const state = setup({ failDelete: true })
  await assert.rejects(state.run(), /Unable to replace/)
  assert.deepEqual(state.records().map((record) => record.id), [10])
  assert.equal(state.commits(), 0)
})

test('successful replacement atomically swaps captured events and retains shared media', async () => {
  const state = setup()
  await state.run()
  assert.deepEqual(state.records().map((record) => record.title), replacement.map((event) => event.title))
  assert.equal(state.commits(), 1)
  assert.equal(state.rollbacks(), 0)
})

test('missing transaction support fails before any calendar reads or writes', async () => {
  const state = setup({ transaction: null })
  await assert.rejects(state.run(), /requires a database transaction/)
  assert.equal(state.records()[0].title, 'Existing event')
})

for (const partial of [true, false]) {
  test(`${partial ? 'partial feed failure preserves the calendar' : 'complete feeds replace the calendar before revalidation'}`, async () => {
    const order = []
    const route = loadSource('src/app/api/sync-events/route.ts', {
      payload: { getPayload: async () => ({}) },
      '@/lib/runtime-config': { isPayloadConfigured: () => true },
      '@/lib/replace-events': { replaceEvents: async (_, events) => { assert.equal(events.length, 3); order.push('replace') } },
      'next/cache': { revalidatePath: () => order.push('revalidate') },
    }, {
      process: { env: { NODE_ENV: 'production', CRON_SECRET: 'synthetic-cron-secret' } },
      console: { log() {}, warn() {}, error() {} },
      fetch: async (url) => partial && url.includes('food-bev')
        ? new Response('', { status: 503 })
        : new Response('<rss><channel><item><title>Local event</title><description>Friday evening at a local venue</description><link>https://example.com/event</link></item></channel></rss>'),
    })
    const request = new Request('https://www.missoulalegends.com/api/sync-events', {
      headers: { authorization: 'Bearer synthetic-cron-secret', 'x-vercel-cron': '1' },
    })
    const response = await route.GET(request)
    assert.equal(response.status, partial ? 503 : 200)
    assert.deepEqual(order, partial ? [] : ['replace', 'revalidate'])
  })
}
