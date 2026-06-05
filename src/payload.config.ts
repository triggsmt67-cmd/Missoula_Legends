import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Media } from './collections/Media'
import { Directory } from './collections/Directory'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // Basic admin setup
  },
  editor: lexicalEditor({}),
  collections: [Media, Directory, Articles],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: !!(
        process.env.BLOB_READ_WRITE_TOKEN &&
        !process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_local_')
      ),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
