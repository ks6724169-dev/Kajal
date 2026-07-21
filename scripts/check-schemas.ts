import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('core_audit', 'core_storage', 'core_monitoring', 'core_backup');`).then(res => {
  console.log(res.rows);
  pool.end();
});
