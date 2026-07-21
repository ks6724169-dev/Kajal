import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  try {
    const res = await pool.query('SELECT version, name FROM migration_history ORDER BY applied_at ASC');
    console.log('Migrations run in migration_history:');
    res.rows.forEach(r => console.log(`${r.version} - ${r.name}`));
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
check();
