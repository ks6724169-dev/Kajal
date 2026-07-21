import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    ALTER TABLE school_registrations
    ADD COLUMN IF NOT EXISTS affiliation_number TEXT,
    ADD COLUMN IF NOT EXISTS official_website TEXT,
    ADD COLUMN IF NOT EXISTS official_email TEXT,
    ADD COLUMN IF NOT EXISTS official_phone TEXT,
    ADD COLUMN IF NOT EXISTS owner_name TEXT,
    ADD COLUMN IF NOT EXISTS administrator_name TEXT,
    ADD COLUMN IF NOT EXISTS administrator_designation TEXT,
    ADD COLUMN IF NOT EXISTS owner_email TEXT,
    ADD COLUMN IF NOT EXISTS owner_mobile TEXT,
    ADD COLUMN IF NOT EXISTS alternate_mobile TEXT,
    ADD COLUMN IF NOT EXISTS short_name TEXT,
    ADD COLUMN IF NOT EXISTS primary_brand_color TEXT,
    ADD COLUMN IF NOT EXISTS secondary_brand_color TEXT,
    ADD COLUMN IF NOT EXISTS institution_name TEXT,
    ADD COLUMN IF NOT EXISTS institution_type TEXT,
    ADD COLUMN IF NOT EXISTS postal_code TEXT;
  `;
  try {
    await pool.query(sql);
    console.log("Successfully added all new/missing columns to school_registrations.");
  } catch (err: any) {
    console.error("Failed to alter school_registrations table:", err.message);
  } finally {
    pool.end();
  }
}
run();
