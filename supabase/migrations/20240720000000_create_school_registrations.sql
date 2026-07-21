-- Migration: Create school_registrations table
-- Phase 01: Enterprise School Registration Foundation

CREATE TABLE IF NOT EXISTS school_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id TEXT UNIQUE NOT NULL,
    school_name TEXT NOT NULL,
    school_type TEXT,
    school_category TEXT,
    board TEXT,
    establishment_year INTEGER,
    country TEXT DEFAULT 'India',
    state TEXT,
    district TEXT,
    city TEXT,
    pincode TEXT,
    address TEXT,
    current_step INTEGER DEFAULT 1,
    progress INTEGER DEFAULT 20,
    status TEXT DEFAULT 'DRAFT',
    
    -- Audit & Versioning
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_school_reg_id ON school_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_school_reg_status ON school_registrations(status);

-- Enable RLS
ALTER TABLE school_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous starts, but usually registration is public-facing but secured by session or rate limiting
-- For now, allow all reads/writes if it matches registration_id (simplified for Phase 01)
CREATE POLICY "Enable all access for now" ON school_registrations FOR ALL USING (true);
