import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    -- Alter school_registrations table to support subscriptions and payments
    ALTER TABLE school_registrations
    ADD COLUMN IF NOT EXISTS plan_id TEXT,
    ADD COLUMN IF NOT EXISTS student_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS base_amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS setup_fee NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS required_initial_payment NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS gateway TEXT DEFAULT 'MOCK',
    ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_signature TEXT,
    ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

    -- Create payment_transactions table for dynamic, production-ready payment and webhook tracking
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id TEXT,
      school_id TEXT,
      tenant_id UUID,
      plan_id TEXT NOT NULL,
      student_capacity INTEGER NOT NULL,
      billing_cycle TEXT NOT NULL,
      currency TEXT DEFAULT 'INR',
      base_amount NUMERIC(12, 2) NOT NULL,
      setup_fee NUMERIC(12, 2) NOT NULL,
      total_amount NUMERIC(12, 2) NOT NULL,
      required_initial_payment NUMERIC(12, 2) NOT NULL,
      paid_amount NUMERIC(12, 2) DEFAULT 0,
      remaining_amount NUMERIC(12, 2) DEFAULT 0,
      payment_status TEXT DEFAULT 'PENDING',
      gateway TEXT DEFAULT 'MOCK',
      gateway_order_id TEXT UNIQUE NOT NULL,
      gateway_payment_id TEXT,
      gateway_signature TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_payment_tx_reg_id ON payment_transactions(registration_id);
    CREATE INDEX IF NOT EXISTS idx_payment_tx_order_id ON payment_transactions(gateway_order_id);
  `;

  try {
    console.log("Altering school_registrations and creating payment_transactions table...");
    await pool.query(sql);
    console.log("Successfully upgraded database structures for Subscription & Payment Architecture.");
  } catch (err: any) {
    console.error("Failed to alter tables / create tables:", err.message);
    process.exit(1);
  } finally {
    pool.end();
  }
}

run();
