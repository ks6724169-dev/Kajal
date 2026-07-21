import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    ALTER TABLE school_registrations
    ADD COLUMN IF NOT EXISTS board_type TEXT,
    ADD COLUMN IF NOT EXISTS established_year INTEGER,
    ADD COLUMN IF NOT EXISTS principal_name TEXT,
    ADD COLUMN IF NOT EXISTS principal_email TEXT,
    ADD COLUMN IF NOT EXISTS principal_phone TEXT,
    ADD COLUMN IF NOT EXISTS admin_name TEXT,
    ADD COLUMN IF NOT EXISTS admin_email TEXT,
    ADD COLUMN IF NOT EXISTS admin_phone TEXT,
    ADD COLUMN IF NOT EXISTS total_students INTEGER,
    ADD COLUMN IF NOT EXISTS total_teachers INTEGER,
    ADD COLUMN IF NOT EXISTS selected_plan TEXT,
    ADD COLUMN IF NOT EXISTS billing_cycle TEXT,
    ADD COLUMN IF NOT EXISTS logo_url TEXT,
    ADD COLUMN IF NOT EXISTS agree_terms BOOLEAN;
  `;
  try {
    await pool.query(sql);
    console.log("Successfully altered school_registrations.");
  } catch (err: any) {
    console.error(err.message);
  } finally {
    pool.end();
  }
}
run();
