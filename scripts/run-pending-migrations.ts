import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const filesToRun = [
  'database/views/core_views.sql',
  'database/materialized_views/core_materialized_views.sql',
  'database/storage/storage_policies.sql'
];

async function run() {
  for (const filePath of filesToRun) {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`[SKIPPED] ${filePath} not found`);
      continue;
    }
    
    console.log(`[RUNNING] ${filePath}...`);
    const sql = fs.readFileSync(fullPath, 'utf8');
    
    try {
      await pool.query(sql);
      console.log(`[SUCCESS] ${filePath}`);
    } catch (e: any) {
      console.error(`[ERROR] ${filePath}:`, e.message);
    }
  }
  
  await pool.end();
  console.log('Done!');
}
run();
