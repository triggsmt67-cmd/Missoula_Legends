async function run() {
  const { Client } = await import('pg');
  const connectionString = process.env.DATABASE_URI || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('Set DATABASE_URI or POSTGRES_URL before running this script.');
  }

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
