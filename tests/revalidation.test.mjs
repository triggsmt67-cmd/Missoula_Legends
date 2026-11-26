import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSource } from './load-source.mjs'

function setup(user = null, allowed = true) {
  const paths = []
  const route = loadSource('src/app/api/revalidate/route.ts', {
    'next/cache': { revalidatePath: (path) => paths.push(path) },
    '@/lib/payload-auth': { getAuthenticatedPayloadUser: async () => ({ user }) },
    '@/lib/request-security': { checkRateLimit: () => ({ allowed, retryAfterSeconds: 30 }) },
  })
  const request = (path, origin = 'https://www.missoulalegends.com') => new Request('https://www.missoulalegends.com/api/revalidate', {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify({ path }),
  })
  return { route, paths, request }
}

test('anonymous revalidation and cross-origin requests have no side effects', async () => {
  const { route, paths, request } = setup()
  assert.equal(route.GET, undefined, 'GET must not expose a mutation handler')
  assert.equal((await route.POST(request('/'))).status, 401)
  assert.equal((await route.POST(request('/', 'https://attacker.example'))).status, 403)
  assert.deepEqual(paths, [])
})

test('authenticated revalidation rejects alternate path encodings and private routes', async () => {
  const { route, paths, request } = setup({ id: 1 })
  for (const path of ['/admin', '/api/users', '//attacker.example', '/directory/../admin', '/directory/%2e%2e/admin', '/directory/test?x=1', '/directory/[slug]', '/', null, 4]) {
    if (path === '/') continue
    assert.equal((await route.POST(request(path))).status, 400, String(path))
  }
  assert.deepEqual(paths, [])
})

test('an authenticated request invalidates only its approved public page', async () => {
  const { route, paths, request } = setup({ id: 1 })
  for (const path of ['/', '/articles/test-story', '/directory/category/shopping']) {
    assert.equal((await route.POST(request(path))).status, 200)
  }
  assert.deepEqual(paths, ['/', '/articles/test-story', '/directory/category/shopping'])
})

test('authenticated requests above the limit do not invalidate anything', async () => {
  const { route, paths, request } = setup({ id: 1 }, false)
  const response = await route.POST(request('/'))
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('Retry-After'), '30')
  assert.deepEqual(paths, [])
})
