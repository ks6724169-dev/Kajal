import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  try {
    const res = await pool.query('SELECT version FROM supabase_migrations.schema_migrations ORDER BY version ASC');
    console.log('Migrations run in Supabase (supabase_migrations.schema_migrations):');
    res.rows.forEach(r => console.log(r.version));
  } catch (e: any) {
    console.error('Error querying schema_migrations:', e.message);
  } finally {
    pool.end();
  }
}
check();
