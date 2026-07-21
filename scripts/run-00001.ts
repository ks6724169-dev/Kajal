import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const filePath = 'database/migrations/00001_initial_database_foundation.sql';
  const fullPath = path.join(process.cwd(), filePath);
  
  console.log(`[RUNNING] ${filePath}...`);
  const sql = fs.readFileSync(fullPath, 'utf8');
  
  try {
    await pool.query(sql);
    console.log(`[SUCCESS] ${filePath}`);
  } catch (e: any) {
    console.error(`[ERROR] ${filePath}:`, e.message);
  }
  
  await pool.end();
  console.log('Done!');
}
run();
