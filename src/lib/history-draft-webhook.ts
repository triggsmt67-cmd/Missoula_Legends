import { createHash, timingSafeEqual } from 'node:crypto'

export const maxHistoryWebhookBytes = 128 * 1024
type RecordValue = Record<string, unknown>
export type HistoryDraftInput = {
  title: string
  slug: string
  excerpt: string
  markdown: string
  heroImage: number
  year?: string
  location?: string
}
type Match = { id: number | string; slug?: string | null; status?: string | null; currentlyPublic?: boolean }
type Store = {
  findExisting: (slug: string, title: string) => Promise<Match | undefined>
  hasImage: (id: number) => Promise<boolean>
  createDraft: (fields: HistoryDraftInput) => Promise<Match>
}

class InputError extends Error {
  readonly status: number

  constructor(message: string, status = 422) {
    super(message)
    this.status = status
  }
}

const record = (x: unknown): RecordValue | undefined =>
  x !== null && typeof x === 'object' && !Array.isArray(x) ? (x as RecordValue) : undefined

function value(raw: unknown, preserveMarkup = false): string {
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw)
  const prop = record(raw)
  const fragments = prop?.title ?? prop?.rich_text
  if (Array.isArray(fragments)) {
    return fragments.map((fragment) => {
      const node = record(fragment)
      const rich = record(node?.text)
      const original = rich?.content
      const text = typeof node?.plain_text === 'string'
        ? node.plain_text
        : typeof original === 'string' ? original : ''
      if (!preserveMarkup || !text.trim()) return text
      const href = node?.href ?? record(rich?.link)?.url
      if (typeof href === 'string') {
        // Notion stores a pasted linked label and its destination separately.
        const label = text.replace(/([\\[\]])/g, '\\$1').replace(/\s*\n\s*/g, ' ')
        const url = href.replace(/[<>()\s]/g, (char) => '%'+char.charCodeAt(0).toString(16).toUpperCase().padStart(2,'0'))
        return `[${label}](${url})`
      }
      const annotations = record(node?.annotations)
      if (annotations?.italic === true || annotations?.bold === true) {
        const marker = annotations.italic && annotations.bold ? '***' : annotations.bold ? '**' : '*'
        return text.replace(/(^\s*)([\s\S]*?)(\s*$)/, (_, lead: string, body: string, tail: string) =>
          `${lead}${marker}${body}${marker}${tail}`)
      }
      return text
    }).join('')
  }
  if (typeof prop?.number === 'number') return String(prop.number)
  return ''
}

export function parseHistoryDraft(input: unknown): HistoryDraftInput {
  const body = record(input)
  if (!body) throw new InputError('Expected an object with story fields.')
  const data = record(body.data)
  const fields = record(data?.properties) ?? record(body.properties) ?? body
  const get = (key: string, alias: string, limit: number, required = true) => {
    const x = value(fields[key] ?? fields[alias], key === 'Story Markdown').trim()
    if (required && !x) throw new InputError(`Missing ${key}.`)
    if (x.length > limit) throw new InputError(`${key} is too long.`)
    return x
  }
  const rawSlug = get('Slug', 'slug', 110)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug)) {
    throw new InputError('Use a fixed lowercase Slug with single hyphens.')
  }
  const image = get('Hero Media ID', 'heroImage', 16)
  const heroImage = Number(image)
  if (!/^\d+$/.test(image) || !Number.isSafeInteger(heroImage) || heroImage < 1) {
    throw new InputError('Hero Media ID must be a positive Payload Media ID.')
  }
  return {
    title: get('Title', 'title', 160),
    slug: rawSlug,
    excerpt: get('Excerpt', 'excerpt', 500),
    markdown: get('Story Markdown', 'markdown', 60_000),
    heroImage,
    year: get('Era / Year', 'year', 100, false) || undefined,
    location: get('Location / Landmark', 'location', 180, false) || undefined,
  }
}

async function readBody(req: Request) {
  const length = req.headers.get('content-length')
  if (length && Number(length) > maxHistoryWebhookBytes) throw new InputError('Request is too large.', 413)
  if (!req.body) throw new InputError('Missing JSON request body.', 400)
  const reader = req.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0
  let text = ''
  try {
    while (true) {
      const next = await reader.read()
      if (next.done) break
      bytes += next.value.byteLength
      if (bytes > maxHistoryWebhookBytes) {
        await reader.cancel().catch(() => undefined)
        throw new InputError('Request is too large.', 413)
      }
      text += decoder.decode(next.value, { stream: true })
    }
    return JSON.parse(text + decoder.decode()) as unknown
  } catch (err) {
    if (err instanceof InputError) throw err
    throw new InputError('Invalid JSON request body.', 400)
  } finally {
    reader.releaseLock()
  }
}

const digest = (value: string) => createHash('sha256').update(value).digest()
const json = (status: number, fields: RecordValue) => Response.json(fields, { status })

function alreadyExists(existing: Match) {
  if (existing.status !== 'draft' || existing.currentlyPublic) {
    return json(409, { success: false, error: 'A non-draft History entry already matches. Nothing was changed.' })
  }
  return json(200, { success: true, operation: 'existing-draft', id: existing.id, slug: existing.slug, status: 'draft' })
}

export function makeHistoryDraftPost(deps: {
  secret: () => string | undefined
  store: () => Promise<Store>
  onError?: () => void
}) {
  return async (req: Request) => {
    const secret = deps.secret()
    if (!secret || secret.length < 32) return json(503, { success: false, error: 'History draft import is not configured.' })
    const supplied = req.headers.get('x-history-draft-token')
    if (!supplied || !timingSafeEqual(digest(secret), digest(supplied))) {
      return json(401, { success: false, error: 'Unauthorized.' })
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers.get('content-type') ?? '')) {
      return json(415, { success: false, error: 'Expected application/json.' })
    }
    try {
      const input = parseHistoryDraft(await readBody(req))
      const store = await deps.store()
      const existing = await store.findExisting(input.slug, input.title)
      if (existing) return alreadyExists(existing)
      if (!await store.hasImage(input.heroImage)) {
        return json(422, { success: false, error: 'Hero Media ID must match an existing image.' })
      }
      let saved: Match
      try {
        saved = await store.createDraft(input)
      } catch (err) {
        if (err instanceof InputError) throw err
        // A retry may race with the original request; don't overwrite author edits.
        const raced = await store.findExisting(input.slug, input.title)
        if (raced) return alreadyExists(raced)
        throw err
      }
      if (saved.status !== 'draft') throw new Error('Draft state could not be confirmed')
      return json(201, { success: true, operation: 'created', id: saved.id, slug: saved.slug, status: 'draft' })
    } catch (err) {
      if (err instanceof InputError) return json(err.status, { success: false, error: err.message })
      deps.onError?.()
      return json(500, { success: false, error: 'Unable to save the History draft. Check the History collection before retrying.' })
    }
  }
}

export function validateHistoryLinks(tree: unknown) {
  const walk = (x: unknown) => {
    const node = record(x)
    if (!node) return
    const link = record(node.fields)?.url ?? node.url
    if ((node.type === 'link' || node.type === 'autolink') && typeof link === 'string' &&
      !/^(https?:\/\/|\/(?![\/\\])|#)/i.test(link.trim())) {
      throw new InputError('Use HTTPS or site-relative links in Story Markdown.')
    }
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(record(tree)?.root)
}
