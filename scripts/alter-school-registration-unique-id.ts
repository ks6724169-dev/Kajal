import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    ALTER TABLE school_registrations
    ADD COLUMN IF NOT EXISTS school_unique_id VARCHAR(64) UNIQUE,
    ADD COLUMN IF NOT EXISTS tenant_id UUID,
    ADD COLUMN IF NOT EXISTS owner_user_id UUID;
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
