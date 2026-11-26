import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSource } from './load-source.mjs'

function setup(result) {
  let sends = 0
  const route = loadSource('src/app/api/claim/route.ts', {
    resend: { Resend: class {
      emails = { send: async () => { sends++; return result } }
    } },
  }, { process: { env: { RESEND_API_KEY: 'synthetic-test-key' } }, console: { error() {}, warn() {} } })
  function request(honeypot = '') {
    const data = new FormData()
    for (const [name, value] of Object.entries({ bizname: 'Test shop', yourname: 'Test owner', contact: 'owner@example.com', honeypot })) data.set(name, value)
    return new Request('https://www.missoulalegends.com/api/claim', { method: 'POST', body: data })
  }
  return { route, request, sends: () => sends }
}

test('provider rejection returns failure instead of acknowledging a lost claim', async () => {
  const { route, request } = setup({ data: null, error: { message: 'Provider rejected send' } })
  const response = await route.POST(request())
  assert.equal(response.status, 503)
  assert.notEqual((await response.json()).ok, true)
})

test('an empty provider response is not treated as delivery acceptance', async () => {
  const { route, request } = setup({ data: null, error: null })
  assert.equal((await route.POST(request())).status, 503)
})

test('accepted claims and honeypot handling retain their legitimate behavior', async () => {
  const { route, request, sends } = setup({ data: { id: 'test-mail-id' }, error: null })
  const accepted = await route.POST(request())
  assert.equal(accepted.status, 200)
  assert.equal((await accepted.json()).ok, true)
  await route.POST(request('bot'))
  assert.equal(sends(), 1)
})
