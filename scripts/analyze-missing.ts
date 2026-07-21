import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const tableRes = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`);
    const dbTables = new Set(tableRes.rows.map(r => r.table_name.toLowerCase()));

    const viewRes = await pool.query(`SELECT table_name FROM information_schema.views WHERE table_schema = 'public';`);
    const dbViews = new Set(viewRes.rows.map(r => r.table_name.toLowerCase()));

    const matViewRes = await pool.query(`SELECT matviewname FROM pg_matviews WHERE schemaname = 'public';`);
    const dbMatViews = new Set(matViewRes.rows.map(r => r.matviewname.toLowerCase()));
    
    // Add mat views to dbViews for simplicity
    for (const mv of dbMatViews) {
      dbViews.add(mv);
    }

    const funcRes = await pool.query(`SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';`);
    const dbFuncs = new Set(funcRes.rows.map(r => r.routine_name.toLowerCase()));

    const checkDir = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) return;
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.sql')).sort();
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        
        const tableMatches = [...content.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi)];
        const viewMatches = [...content.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?(?:MATERIALIZED\s+)?VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi)];
        const funcMatches = [...content.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-zA-Z0-9_]+)/gi)];

        let totalObjects = 0;
        let totalFound = 0;
        let missingObjects = [];
        
        for (const match of tableMatches) {
          totalObjects++;
          if (dbTables.has(match[1].toLowerCase())) {
            totalFound++;
          } else {
            missingObjects.push(`Table: ${match[1]}`);
          }
        }
        for (const match of viewMatches) {
          totalObjects++;
          if (dbViews.has(match[1].toLowerCase())) {
            totalFound++;
          } else {
            missingObjects.push(`View: ${match[1]}`);
          }
        }
        for (const match of funcMatches) {
          totalObjects++;
          if (dbFuncs.has(match[1].toLowerCase())) {
            totalFound++;
          } else {
            missingObjects.push(`Function: ${match[1]}`);
          }
        }

        if (totalObjects > 0 && totalFound < totalObjects) {
          console.log(`[PENDING/PARTIAL] ${path.basename(dirPath)}/${file} - Missing: ${missingObjects.join(', ')}`);
        }
      }
    };

    checkDir(path.join(process.cwd(), 'server', 'database', 'migrations'));
    
    const coreDirs = [
      'migrations', 'schemas', 'views', 'materialized_views', 
      'functions', 'triggers', 'policies', 'indexes', 'auth', 'storage'
    ];
    for (const dir of coreDirs) {
      checkDir(path.join(process.cwd(), 'database', dir));
    }

  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
check();
