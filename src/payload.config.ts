import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Media } from './collections/Media'
import { Directory } from './collections/Directory'
import { Articles } from './collections/Articles'
import { Users } from './collections/Users'
import { Events } from './collections/Events'
import { History } from './collections/History'
import { Partners } from './collections/Partners'
import { Gallery } from './collections/Gallery'
import { CuratorProfile } from './globals/CuratorProfile'

console.log('*** DIAGNOSTIC: Database variables checking ***')
console.log('DATABASE_URI exists:', !!process.env.DATABASE_URI)
if (process.env.DATABASE_URI) {
  console.log('DATABASE_URI prefix:', process.env.DATABASE_URI.split('@')[0])
}
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL)
if (process.env.POSTGRES_URL) {
  console.log('POSTGRES_URL prefix:', process.env.POSTGRES_URL.split('@')[0])
}
console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN)
if (process.env.BLOB_READ_WRITE_TOKEN) {
  console.log(
    'BLOB_READ_WRITE_TOKEN prefix:',
    process.env.BLOB_READ_WRITE_TOKEN.substring(0, 15) + '...'
  )
}
console.log('*** DIAGNOSTIC END ***')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let connectionString = process.env.DATABASE_URI || ''

// Self-healing fallback: If running on Vercel, ignore any local database connection string
if (
  process.env.VERCEL === '1' &&
  (connectionString.includes('127.0.0.1') || connectionString.includes('localhost'))
) {
  console.warn('*** Vercel environment detected. Ignoring local DATABASE_URI and falling back to POSTGRES_URL. ***')
  connectionString = ''
}

if (!connectionString) {
  connectionString = process.env.POSTGRES_URL || ''
}

if (connectionString) {
  try {
    const parsedUrl = new URL(connectionString)
    // Silence the "pg" library's "SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are insecure..." warning.
    parsedUrl.searchParams.set('uselibpqcompat', 'true')
    connectionString = parsedUrl.toString()
  } catch (err) {
    console.error('Failed to parse database connection string', err)
  }
}

export default buildConfig({
  admin: {
    user: 'users',
  },
  cors: ['https://missoulalegends.com', 'http://localhost:3000'],
  csrf: ['https://missoulalegends.com', 'http://localhost:3000'],
  sharp,
  editor: lexicalEditor({}),
  collections: [Media, Directory, Articles, Users, Events, History, Partners, Gallery],
  globals: [CuratorProfile],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString,
    },
    push: true,
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
