import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    const dbTables = new Set(res.rows.map(r => r.table_name));

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    console.log('Migration Files Analysis:');
    let runCount = 0;

    for (const file of files) {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const tableMatches = [...content.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi)];
      
      let allFound = true;
      let tablesInFile = 0;
      
      for (const match of tableMatches) {
        tablesInFile++;
        const tableName = match[1].toLowerCase();
        if (!dbTables.has(tableName)) {
          allFound = false;
        }
      }

      // Special check if a file only alters tables or has no CREATE TABLE
      if (tablesInFile === 0) {
        // e.g., security hardening or alter table
        // We assume it's run if previous files are run
        console.log(`[?] ${file} (No new tables to check)`);
        runCount++;
      } else if (allFound) {
        console.log(`[✔] ${file} (All ${tablesInFile} tables found)`);
        runCount++;
      } else {
        console.log(`[ ] ${file} (Some tables missing)`);
      }
    }
    console.log(`\nTotal likely run: ${runCount} / ${files.length}`);
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
check();
