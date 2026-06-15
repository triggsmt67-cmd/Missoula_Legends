const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_7cq9msOwKvBz@ep-still-sunset-apfrpqjm-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to restored database.');
  
  try {
    const dirRes = await client.query("SELECT id, business_name, featured_image_id FROM directory");
    console.log('\nRestored Directory Listings:');
    console.log(dirRes.rows);

    const mediaRes = await client.query("SELECT id, filename, url FROM media");
    console.log('\nRestored Media Files:');
    console.log(mediaRes.rows);
  } catch (e) {
    console.error('Error reading database:', e.message);
  }

  await client.end();
}

run().catch(console.error);
