import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    -- 1. Create schools table mapping registration fields
    CREATE TABLE IF NOT EXISTS schools (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id TEXT UNIQUE,
      tenant_id UUID UNIQUE,
      school_unique_id VARCHAR(64) UNIQUE,
      name VARCHAR(255) NOT NULL,
      institution_type VARCHAR(100),
      board VARCHAR(100),
      affiliation_number VARCHAR(100),
      official_email VARCHAR(255),
      official_mobile VARCHAR(50),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100),
      pin_code VARCHAR(50),
      logo TEXT,
      primary_color VARCHAR(50),
      secondary_color VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_schools_reg_id ON schools(registration_id);
    CREATE INDEX IF NOT EXISTS idx_schools_tenant_id ON schools(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_schools_unique_id ON schools(school_unique_id);

    -- 2. Create school_subscriptions table
    CREATE TABLE IF NOT EXISTS school_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID UNIQUE NOT NULL,
      school_id UUID UNIQUE NOT NULL,
      registration_id TEXT UNIQUE NOT NULL,
      plan_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      student_capacity INTEGER NOT NULL,
      billing_cycle TEXT NOT NULL,
      base_amount NUMERIC(12, 2) DEFAULT 0,
      setup_fee NUMERIC(12, 2) DEFAULT 0,
      total_amount NUMERIC(12, 2) DEFAULT 0,
      paid_amount NUMERIC(12, 2) DEFAULT 0,
      remaining_amount NUMERIC(12, 2) DEFAULT 0,
      subscription_status TEXT DEFAULT 'ACTIVE',
      start_date TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_subs_tenant_id ON school_subscriptions(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_subs_school_id ON school_subscriptions(school_id);
    CREATE INDEX IF NOT EXISTS idx_subs_reg_id ON school_subscriptions(registration_id);

    -- 3. Create school_registration_audit_logs table
    CREATE TABLE IF NOT EXISTS school_registration_audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID DEFAULT gen_random_uuid(),
      tenant_id UUID,
      school_id TEXT,
      registration_id TEXT,
      user_id UUID,
      event_type VARCHAR(100) NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_audit_reg_id ON school_registration_audit_logs(registration_id);
    CREATE INDEX IF NOT EXISTS idx_audit_tenant_id ON school_registration_audit_logs(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_audit_event_type ON school_registration_audit_logs(event_type);
  `;

  try {
    console.log("Creating tables for schools, subscriptions, and audit logging...");
    await pool.query(sql);
    console.log("Successfully created database structures for Phase 02.");
  } catch (err: any) {
    console.error("Failed to execute database structures script:", err.message);
    process.exit(1);
  } finally {
    pool.end();
  }
}

run();
