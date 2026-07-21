import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

async function runMigration() {
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20240720000000_create_school_registrations.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Executing migration...');
  try {
    const client = await pool.connect();
    try {
      await client.query(sql);
      console.log('Migration completed successfully');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
