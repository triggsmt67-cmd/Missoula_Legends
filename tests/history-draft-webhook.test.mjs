import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { makeHistoryDraftPost, maxHistoryWebhookBytes, validateHistoryLinks } from '../src/lib/history-draft-webhook.ts'

const token = 'local-test-token-at-least-thirty-two-characters'
const fixture = {
  title: 'Sample History Story', slug: 'sample-history-story', heroImage: 42,
  excerpt: 'A short summary', markdown: 'A paragraph.\n\n## A section\n\n[Source](https://example.org)',
  year: '1940s', location: 'North Higgins',
}
const req = (data, header = token, suffix = '') => new Request('https://test.invalid/api/history-draft' + suffix, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(header ? { 'x-history-draft-token': header } : {}) },
  body: typeof data === 'string' ? data : JSON.stringify(data),
})
function harness(existing) {
  let saved = existing
  let writes = 0
  let input
  let storeCalls = 0
  const handle = makeHistoryDraftPost({ secret: () => token, store: async () => {
    storeCalls++
    return {
      findExisting: async () => saved,
      hasImage: async (id) => id === 42,
      createDraft: async (fields) => {
        writes++
        input = fields
        saved = { id: 7, status: 'draft', slug: fields.slug }
        return saved
      },
    }
  } })
  return { handle, stats: () => ({writes, input, storeCalls}) }
}
test('missing or wrong header never reaches storage, even if the URL contains a token', async () => {
  const h = harness()
  assert.equal((await h.handle(req(fixture, null, '?secret=' + token))).status, 401)
  assert.equal((await h.handle(req(fixture, 'wrong'))).status, 401)
  assert.equal(h.stats().storeCalls, 0)
})
test('disabled when no dedicated secret is set', async () => {
  const handle = makeHistoryDraftPost({secret: () => undefined,store: async () => assert.fail('should not connect')})
  assert.equal((await handle(req(fixture))).status,503)
})
test('valid request creates once, ignores publication fields and does not overwrite on retry', async () => {
  const h = harness()
  const first = await h.handle(req({...fixture, _status: 'published', collection: 'directory', Status: 'Published'}))
  assert.equal(first.status, 201)
  assert.equal((await first.json()).status, 'draft')
  assert.deepEqual(h.stats().input, fixture)
  const second = await h.handle(req({...fixture, markdown: 'Would overwrite'}))
  assert.equal(second.status, 200)
  assert.equal((await second.json()).operation, 'existing-draft')
  assert.equal(h.stats().writes, 1)
})
test('Notion properties and split rich text are accepted', async () => {
  const h=harness()
  const out = await h.handle(req({data:{properties:{
    Title:{title:[{plain_text:fixture.title}]}, Slug:fixture.slug, Excerpt:fixture.excerpt,
    'Hero Media ID':{number:42}, 'Story Markdown':{rich_text:[{text:{content:'Paragraph one.'}},{plain_text:'\n\nParagraph two.'}]},
    'Era / Year':fixture.year, 'Location / Landmark':fixture.location,
  }}}))
  assert.equal(out.status,201)
  assert.equal(h.stats().input.markdown,'Paragraph one.\n\nParagraph two.')
})
test('never modifies a published entry, including one with a newer draft', async () => {
  for (const entry of [{id:1,status:'published'},{id:1,status:'draft',currentlyPublic:true}]) {
    const h=harness(entry)
    assert.equal((await h.handle(req(fixture))).status,409)
    assert.equal(h.stats().writes,0)
  }
})
test('invalid fields, unavailable hero, malformed JSON and oversized body cannot create a story', async () => {
  const h=harness()
  for (const body of [{...fixture,heroImage:'https://example.org/photo.jpg'},{...fixture,heroImage:43},{...fixture,excerpt:''},{...fixture,slug:'Invalid slug'}]) {
    assert.equal((await h.handle(req(body))).status,422)
  }
  assert.equal((await h.handle(req('{'))).status,400)
  assert.equal((await h.handle(req(' '.repeat(maxHistoryWebhookBytes + 1)))).status,413)
  assert.equal(h.stats().writes,0)
})
test('rejects unsupported rich-text link types while retaining sources', () => {
  const tree=url=>({root:{children:[{type:'paragraph',children:[{type:'link',fields:{url}}]}]}})
  assert.doesNotThrow(()=>validateHistoryLinks(tree('https://example.org/source')))
  assert.doesNotThrow(()=>validateHistoryLinks(tree('/history')))
  assert.throws(()=>validateHistoryLinks(tree('data:text/plain,invalid')))
})
test('Golden Pheasant working draft passes the same handler without contacting a database', {
  skip: !process.env.HISTORY_STORY_FIXTURE,
}, async () => {
  const raw=JSON.parse(await readFile(process.env.HISTORY_STORY_FIXTURE,'utf8'))
  const h=harness()
  const out=await h.handle(req({...raw, heroImage:42}))
  assert.equal(out.status,201)
  assert.equal(h.stats().input.slug,'golden-pheasant-missoula')
  assert.match(h.stats().input.markdown,/Ruby Wong and Kim Ming/)
  assert.match(h.stats().input.markdown,/Missoula Redevelopment Agency/)
  assert.equal((await out.json()).status,'draft')
})

test('Notion formatted source links and italic photo credit survive extraction', async () => {
  const h=harness()
  const out=await h.handle(req({properties:{...fixture,'Story Markdown':{rich_text:[
    {plain_text:'Read '},
    {plain_text:'Newspaper [archive]',href:'https://example.org/archive_(old)#page'},
    {plain_text:'\n\n'},
    {plain_text:'Photo credit.',annotations:{italic:true}},
  ]}}}))
  assert.equal(out.status,201)
  assert.equal(h.stats().input.markdown,'Read [Newspaper \\[archive\\]](https://example.org/archive_%28old%29#page)\n\n*Photo credit.*')
})
