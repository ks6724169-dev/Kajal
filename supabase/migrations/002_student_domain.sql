-- Phase 03.2B Student & Parent Domain Migrations

CREATE TABLE IF NOT EXISTS family_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    household_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS parent_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    family_id UUID REFERENCES family_master(id),
    type VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    occupation VARCHAR(255),
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    is_pickup_authorized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    family_id UUID REFERENCES family_master(id),
    student_id VARCHAR(50) NOT NULL,
    admission_number VARCHAR(50) NOT NULL,
    roll_number VARCHAR(50),
    academic_number VARCHAR(50),
    board_registration VARCHAR(100),
    aadhaar VARCHAR(50),
    passport VARCHAR(50),
    blood_group VARCHAR(10),
    religion VARCHAR(50),
    category VARCHAR(50),
    nationality VARCHAR(50),
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    photo_url TEXT,
    biometric_id VARCHAR(100),
    rfid VARCHAR(100),
    face_recognition_id VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    academic_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_admission_no ON student_master(tenant_id, admission_number) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_id ON student_master(tenant_id, student_id) WHERE deleted_at IS NULL;

-- Trigram search for fuzzy name matching (needs pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_student_name_trgm ON student_master USING GIN (first_name gin_trgm_ops, last_name gin_trgm_ops);

-- RLS Policies
ALTER TABLE family_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_family ON family_master;
DROP POLICY IF EXISTS tenant_isolation_family ON family_master; CREATE POLICY tenant_isolation_family ON family_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE parent_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_parent ON parent_master;
DROP POLICY IF EXISTS tenant_isolation_parent ON parent_master; CREATE POLICY tenant_isolation_parent ON parent_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE student_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_student ON student_master;
DROP POLICY IF EXISTS tenant_isolation_student ON student_master; CREATE POLICY tenant_isolation_student ON student_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
