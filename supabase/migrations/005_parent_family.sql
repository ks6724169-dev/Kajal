-- Phase 03.2E Parent & Family Domain Migrations

-- Alter existing tables to support softDelete() column requirements
ALTER TABLE family_master ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE parent_master ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE student_master ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- Alter newly created tables in case they already exist from previous test runs
ALTER TABLE guardian_master ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE student_parent_map ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE pickup_authorization ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE emergency_contact ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE family_address ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE household_member ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE notification_preference ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE digital_consent ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS guardian_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    parent_id UUID REFERENCES parent_master(id),
    relation_to_student VARCHAR(100) NOT NULL,
    is_legal_guardian BOOLEAN DEFAULT FALSE,
    custody_status VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    verified_by UUID,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_parent_map (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    parent_id UUID NOT NULL REFERENCES parent_master(id),
    relationship_type VARCHAR(100) NOT NULL,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    is_billing_contact BOOLEAN DEFAULT FALSE,
    has_academic_access BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    organization_id UUID,
    campus_id UUID,
    UNIQUE(student_id, parent_id)
);

CREATE TABLE IF NOT EXISTS pickup_authorization (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID REFERENCES student_master(id),
    parent_id UUID REFERENCES parent_master(id),
    authorized_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    photo_url TEXT,
    id_card_number VARCHAR(100),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS emergency_contact (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID REFERENCES student_master(id),
    parent_id UUID REFERENCES parent_master(id),
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    priority INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS family_address (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    family_id UUID NOT NULL REFERENCES family_master(id),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS household_member (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    family_id UUID NOT NULL REFERENCES family_master(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relation_to_head VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_preference (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    parent_id UUID NOT NULL REFERENCES parent_master(id),
    channel VARCHAR(50) NOT NULL,
    allow_academic_alerts BOOLEAN DEFAULT TRUE,
    allow_attendance_alerts BOOLEAN DEFAULT TRUE,
    allow_finance_alerts BOOLEAN DEFAULT TRUE,
    allow_emergency_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS digital_consent (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    parent_id UUID NOT NULL REFERENCES parent_master(id),
    consent_type VARCHAR(100) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMP,
    revoked_at TIMESTAMP,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_guardian_parent ON guardian_master (parent_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_map_student ON student_parent_map (student_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_map_parent ON student_parent_map (parent_id);
CREATE INDEX IF NOT EXISTS idx_pickup_student ON pickup_authorization (student_id);
CREATE INDEX IF NOT EXISTS idx_pickup_parent ON pickup_authorization (parent_id);
CREATE INDEX IF NOT EXISTS idx_emergency_student ON emergency_contact (student_id);
CREATE INDEX IF NOT EXISTS idx_emergency_parent ON emergency_contact (parent_id);
CREATE INDEX IF NOT EXISTS idx_family_address_family ON family_address (family_id);
CREATE INDEX IF NOT EXISTS idx_household_member_family ON household_member (family_id);
CREATE INDEX IF NOT EXISTS idx_notif_pref_parent ON notification_preference (parent_id);
CREATE INDEX IF NOT EXISTS idx_digital_consent_student ON digital_consent (student_id);
CREATE INDEX IF NOT EXISTS idx_digital_consent_parent ON digital_consent (parent_id);

-- 3. Row-Level Security (RLS)
ALTER TABLE guardian_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parent_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_authorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_address ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_consent ENABLE ROW LEVEL SECURITY;

-- 4. Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_guardian') THEN
        DROP POLICY IF EXISTS tenant_isolation_guardian ON guardian_master; CREATE POLICY tenant_isolation_guardian ON guardian_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_parent_map') THEN
        DROP POLICY IF EXISTS tenant_isolation_student_parent_map ON student_parent_map; CREATE POLICY tenant_isolation_student_parent_map ON student_parent_map FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_pickup') THEN
        DROP POLICY IF EXISTS tenant_isolation_pickup ON pickup_authorization; CREATE POLICY tenant_isolation_pickup ON pickup_authorization FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_emergency') THEN
        DROP POLICY IF EXISTS tenant_isolation_emergency ON emergency_contact; CREATE POLICY tenant_isolation_emergency ON emergency_contact FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_family_address') THEN
        DROP POLICY IF EXISTS tenant_isolation_family_address ON family_address; CREATE POLICY tenant_isolation_family_address ON family_address FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_household') THEN
        DROP POLICY IF EXISTS tenant_isolation_household ON household_member; CREATE POLICY tenant_isolation_household ON household_member FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notif_pref') THEN
        DROP POLICY IF EXISTS tenant_isolation_notif_pref ON notification_preference; CREATE POLICY tenant_isolation_notif_pref ON notification_preference FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_consent') THEN
        DROP POLICY IF EXISTS tenant_isolation_consent ON digital_consent; CREATE POLICY tenant_isolation_consent ON digital_consent FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- 5. Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_guardian_audit') THEN
        CREATE TRIGGER tr_guardian_audit AFTER INSERT OR UPDATE OR DELETE ON guardian_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_parent_map_audit') THEN
        CREATE TRIGGER tr_student_parent_map_audit AFTER INSERT OR UPDATE OR DELETE ON student_parent_map FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_pickup_audit') THEN
        CREATE TRIGGER tr_pickup_audit AFTER INSERT OR UPDATE OR DELETE ON pickup_authorization FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_emergency_audit') THEN
        CREATE TRIGGER tr_emergency_audit AFTER INSERT OR UPDATE OR DELETE ON emergency_contact FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_family_address_audit') THEN
        CREATE TRIGGER tr_family_address_audit AFTER INSERT OR UPDATE OR DELETE ON family_address FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_household_member_audit') THEN
        CREATE TRIGGER tr_household_member_audit AFTER INSERT OR UPDATE OR DELETE ON household_member FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_notification_pref_audit') THEN
        CREATE TRIGGER tr_notification_pref_audit AFTER INSERT OR UPDATE OR DELETE ON notification_preference FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_digital_consent_audit') THEN
        CREATE TRIGGER tr_digital_consent_audit AFTER INSERT OR UPDATE OR DELETE ON digital_consent FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
