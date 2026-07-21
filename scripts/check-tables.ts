import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Tables in public schema:');
    res.rows.forEach(r => console.log(r.table_name));
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
check();
