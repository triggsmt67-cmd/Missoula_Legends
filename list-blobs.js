import { list } from '@vercel/blob'


async function check() {
  try {
    const blobs = await list({ token: process.env.BLOB_READ_WRITE_TOKEN })
    for (const blob of blobs.blobs) {
      console.log(blob.url)
    }
  } catch (err) {
    console.error(err)
  }
}
check()
