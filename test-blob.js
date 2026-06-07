const { list } = require('@vercel/blob');


async function checkBlob() {
  try {
    console.log('Checking Vercel Blob store...');
    console.log('Token prefix:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20));
    const blobs = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    console.log('Success! Blobs:', blobs);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkBlob();
