const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_7cq9msOwKvBz@ep-still-sunset-apfrpqjm-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to database for slug migration.');

  try {
    // 1. Fetch all listings
    const res = await client.query("SELECT id, business_name, slug FROM directory");
    console.log(`Found ${res.rows.length} directory listings.`);

    for (const row of res.rows) {
      const currentSlug = row.slug;
      const generatedSlug = slugify(row.business_name);
      
      console.log(`Listing: "${row.business_name}" | Current Slug: "${currentSlug || 'NULL'}" -> Generated: "${generatedSlug}"`);
      
      // Update in directory table
      await client.query("UPDATE directory SET slug = $1 WHERE id = $2", [generatedSlug, row.id]);
      
      // Update in _directory_v (version table)
      try {
        await client.query("UPDATE _directory_v SET version_slug = $1 WHERE parent_id = $2", [generatedSlug, row.id]);
      } catch (verr) {
        console.warn(`Could not update versions for ID ${row.id}:`, verr.message);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
