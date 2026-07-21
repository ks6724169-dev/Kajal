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

    const funcRes = await pool.query(`SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';`);
    const dbFuncs = new Set(funcRes.rows.map(r => r.routine_name.toLowerCase()));

    const checkDir = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) return;
      console.log(`\nChecking directory: ${dirPath}`);
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.sql')).sort();
      let runCount = 0;
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        
        // Tables
        const tableMatches = [...content.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi)];
        // Views
        const viewMatches = [...content.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?(?:MATERIALIZED\s+)?VIEW\s+(?:public\.)?([a-zA-Z0-9_]+)/gi)];
        // Functions
        const funcMatches = [...content.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-zA-Z0-9_]+)/gi)];

        let tablesInFile = 0;
        let tablesFound = 0;
        let viewsInFile = 0;
        let viewsFound = 0;
        let funcsInFile = 0;
        let funcsFound = 0;
        
        for (const match of tableMatches) {
          tablesInFile++;
          if (dbTables.has(match[1].toLowerCase())) tablesFound++;
        }
        for (const match of viewMatches) {
          viewsInFile++;
          if (dbViews.has(match[1].toLowerCase())) viewsFound++;
        }
        for (const match of funcMatches) {
          funcsInFile++;
          if (dbFuncs.has(match[1].toLowerCase())) funcsFound++;
        }

        const totalObjects = tablesInFile + viewsInFile + funcsInFile;
        const totalFound = tablesFound + viewsFound + funcsFound;

        if (totalObjects === 0) {
          console.log(`[?] ${file} (No Tables/Views/Funcs to check)`);
        } else if (totalFound === totalObjects) {
          console.log(`[✔] ${file} (All ${totalObjects} objects found)`);
        } else {
          console.log(`[ ] ${file} (${totalFound}/${totalObjects} objects found)`);
        }
      }
    };

    checkDir(path.join(process.cwd(), 'server', 'database', 'migrations'));
    
    // Core foundation scripts
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
