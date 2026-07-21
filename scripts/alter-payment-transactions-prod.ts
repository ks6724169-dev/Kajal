import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    -- Add any missing columns to payment_transactions table for high-fidelity production tracking
    ALTER TABLE payment_transactions
    ADD COLUMN IF NOT EXISTS school_unique_id TEXT,
    ADD COLUMN IF NOT EXISTS subscription_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_order_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_method TEXT,
    ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'INITIATED',
    ADD COLUMN IF NOT EXISTS signature_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS webhook_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS transaction_reference TEXT;

    -- Make sure gateway_order_id doesn't fail if we allow null during different checkout stages
    ALTER TABLE payment_transactions ALTER COLUMN gateway_order_id DROP NOT NULL;
  `;

  try {
    console.log("Applying production-ready payment database upgrades...");
    await pool.query(sql);
    console.log("Database table 'payment_transactions' updated successfully with all auditing properties!");
  } catch (err: any) {
    console.error("Failed to alter database schema:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
