import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    SELECT school_name, status, school_unique_id, tenant_id
    FROM school_registrations
    WHERE school_name = 'Test School 5';
  `;
  try {
    const res = await pool.query(sql);
    console.log(res.rows);
  } catch (err: any) {
    console.error(err.message);
  } finally {
    pool.end();
  }
}
run();
