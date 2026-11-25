import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload, type Where } from 'payload'
import { makeHistoryDraftPost, validateHistoryLinks } from '@/lib/history-draft-webhook'

export const runtime = 'nodejs'

export const POST = makeHistoryDraftPost({
  secret: () => process.env.HISTORY_DRAFT_WEBHOOK_SECRET,
  onError: () => console.error('[history-draft] Import failed; check the History collection before retrying.'),
  store: async () => {
    const payload = await getPayload({ config })
    return {
      findExisting: async (slug, title) => {
        const where: Where = { or: [{ slug: { equals: slug } }, { title: { equals: title } }] }
        const published = await payload.find({
          collection: 'history', where: { and: [where, { _status: { equals: 'published' } }] },
          draft: false, overrideAccess: true, limit: 1, depth: 0,
        })
        const visible = published.docs[0]
        if (visible) return { id: visible.id, slug: visible.slug, status: visible._status, currentlyPublic: true }
        const latest = await payload.find({
          collection: 'history', where, draft: true, overrideAccess: true, limit: 1, depth: 0,
        })
        const doc = latest.docs[0]
        return doc ? { id: doc.id, slug: doc.slug, status: doc._status } : undefined
      },
      hasImage: async (id) => {
        const result = await payload.find({
          collection: 'media', where: { id: { equals: id } }, overrideAccess: true, limit: 1, depth: 0,
        })
        const image = result.docs[0]
        return typeof image?.mimeType === 'string' && image.mimeType.startsWith('image/')
      },
      createDraft: async ({ markdown, ...fields }) => {
        const editorConfig = await editorConfigFactory.default({ config: payload.config })
        const content = convertMarkdownToLexical({ editorConfig, markdown })
        validateHistoryLinks(content)
        const doc = await payload.create({
          collection: 'history',
          data: { ...fields, content, _status: 'draft' },
          draft: true,
          overrideAccess: true,
        })
        return { id: doc.id, slug: doc.slug, status: doc._status }
      },
    }
  },
})
