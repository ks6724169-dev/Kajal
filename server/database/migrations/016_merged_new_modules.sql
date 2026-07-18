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
        CREATE POLICY tenant_isolation_guardian ON guardian_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_parent_map') THEN
        CREATE POLICY tenant_isolation_student_parent_map ON student_parent_map FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_pickup') THEN
        CREATE POLICY tenant_isolation_pickup ON pickup_authorization FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_emergency') THEN
        CREATE POLICY tenant_isolation_emergency ON emergency_contact FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_family_address') THEN
        CREATE POLICY tenant_isolation_family_address ON family_address FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_household') THEN
        CREATE POLICY tenant_isolation_household ON household_member FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notif_pref') THEN
        CREATE POLICY tenant_isolation_notif_pref ON notification_preference FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_consent') THEN
        CREATE POLICY tenant_isolation_consent ON digital_consent FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
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
-- Phase 03.2F Enterprise Examination, Assessment & Academic Intelligence Platform Migrations

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS examination_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    term VARCHAR(100) NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS examination_session (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    examination_id UUID NOT NULL REFERENCES examination_master(id) ON DELETE CASCADE,
    session_name VARCHAR(255) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS examination_schedule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    examination_id UUID NOT NULL REFERENCES examination_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    exam_date DATE NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    passing_marks NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS examination_rooms (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    room_number VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    block_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS invigilator_assignment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES examination_schedule(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES examination_rooms(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS subject_paper (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    examination_id UUID NOT NULL REFERENCES examination_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    paper_code VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS blueprint_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    total_marks NUMERIC(5, 2) NOT NULL,
    easy_percentage NUMERIC(5, 2) DEFAULT 30.00,
    medium_percentage NUMERIC(5, 2) DEFAULT 50.00,
    hard_percentage NUMERIC(5, 2) DEFAULT 20.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS question_paper (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES examination_schedule(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    blueprint_id UUID REFERENCES blueprint_master(id) ON DELETE SET NULL,
    paper_code VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    total_marks NUMERIC(5, 2) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    difficulty_level VARCHAR(50) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'MCQ', 'SHORT', 'LONG', 'FIB'
    options JSONB,
    correct_answer TEXT,
    marks NUMERIC(5, 2) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS assignment_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS project_assessment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    obtained_marks NUMERIC(5, 2),
    evaluator_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS internal_assessment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    term VARCHAR(100) NOT NULL,
    attendance_marks NUMERIC(5, 2) DEFAULT 0,
    assignment_marks NUMERIC(5, 2) DEFAULT 0,
    quiz_marks NUMERIC(5, 2) DEFAULT 0,
    total_internal_marks NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS external_assessment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    exam_marks NUMERIC(5, 2) NOT NULL,
    total_external_marks NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS practical_exam (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES examination_schedule(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    examiner_name VARCHAR(255) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    obtained_marks NUMERIC(5, 2),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS viva_exam (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES examination_schedule(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    examiner_name VARCHAR(255) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    obtained_marks NUMERIC(5, 2),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS marks_entry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES examination_schedule(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    obtained_marks NUMERIC(5, 2) NOT NULL,
    practical_marks NUMERIC(5, 2) DEFAULT 0,
    viva_marks NUMERIC(5, 2) DEFAULT 0,
    is_absent BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS grade_book (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    term VARCHAR(100) NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    subject_id UUID NOT NULL,
    internal_marks NUMERIC(5, 2) NOT NULL,
    external_marks NUMERIC(5, 2) NOT NULL,
    total_marks NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    points NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gpa_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    term VARCHAR(100) NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    gpa NUMERIC(4, 2) NOT NULL,
    total_credits INT NOT NULL,
    earned_credits INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS cgpa_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    academic_year VARCHAR(100) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL,
    total_credits INT NOT NULL,
    earned_credits INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS result_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    examination_id UUID NOT NULL REFERENCES examination_master(id) ON DELETE CASCADE,
    total_obtained NUMERIC(6, 2) NOT NULL,
    total_max NUMERIC(6, 2) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    gpa NUMERIC(4, 2),
    cgpa NUMERIC(4, 2),
    overall_grade VARCHAR(20) NOT NULL,
    result_status VARCHAR(50) NOT NULL, -- 'PASS', 'FAIL', 'WITHHELD', 'SUPPLEMENTARY'
    rank INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS result_publication (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    examination_id UUID NOT NULL REFERENCES examination_master(id) ON DELETE CASCADE,
    publish_date TIMESTAMP NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS promotion_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    from_class_id UUID NOT NULL,
    to_class_id UUID NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    promotion_date TIMESTAMP NOT NULL,
    is_promoted BOOLEAN DEFAULT TRUE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_remark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    term VARCHAR(100) NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    remark_text TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL, -- 'POSITIVE', 'NEUTRAL', 'WARNING'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS performance_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    average_marks NUMERIC(5, 2) NOT NULL,
    attendance_rate NUMERIC(5, 2) NOT NULL,
    predicted_score NUMERIC(5, 2),
    risk_level VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS weak_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    reason TEXT NOT NULL,
    identified_date DATE NOT NULL,
    remediation_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gifted_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    reason TEXT NOT NULL,
    identified_date DATE NOT NULL,
    enrichment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL,
    recommendation_text TEXT NOT NULL,
    generated_by VARCHAR(50) NOT NULL, -- 'AI', 'TEACHER'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_exam_tenant ON examination_master (tenant_id);
CREATE INDEX IF NOT EXISTS idx_exam_session_exam ON examination_session (examination_id);
CREATE INDEX IF NOT EXISTS idx_exam_schedule_exam ON examination_schedule (examination_id);
CREATE INDEX IF NOT EXISTS idx_invig_sched ON invigilator_assignment (schedule_id);
CREATE INDEX IF NOT EXISTS idx_invig_room ON invigilator_assignment (room_id);
CREATE INDEX IF NOT EXISTS idx_invig_teach ON invigilator_assignment (teacher_id);
CREATE INDEX IF NOT EXISTS idx_sub_paper_exam ON subject_paper (examination_id);
CREATE INDEX IF NOT EXISTS idx_quest_paper_sched ON question_paper (schedule_id);
CREATE INDEX IF NOT EXISTS idx_pract_sched ON practical_exam (schedule_id);
CREATE INDEX IF NOT EXISTS idx_pract_stud ON practical_exam (student_id);
CREATE INDEX IF NOT EXISTS idx_viva_sched ON viva_exam (schedule_id);
CREATE INDEX IF NOT EXISTS idx_viva_stud ON viva_exam (student_id);
CREATE INDEX IF NOT EXISTS idx_marks_sched ON marks_entry (schedule_id);
CREATE INDEX IF NOT EXISTS idx_marks_stud ON marks_entry (student_id);
CREATE INDEX IF NOT EXISTS idx_grade_stud ON grade_book (student_id);
CREATE INDEX IF NOT EXISTS idx_gpa_stud ON gpa_records (student_id);
CREATE INDEX IF NOT EXISTS idx_cgpa_stud ON cgpa_records (student_id);
CREATE INDEX IF NOT EXISTS idx_res_stud ON result_master (student_id);
CREATE INDEX IF NOT EXISTS idx_res_exam ON result_master (examination_id);
CREATE INDEX IF NOT EXISTS idx_prom_stud ON promotion_master (student_id);
CREATE INDEX IF NOT EXISTS idx_remark_stud ON academic_remark (student_id);
CREATE INDEX IF NOT EXISTS idx_perf_stud ON performance_registry (student_id);
CREATE INDEX IF NOT EXISTS idx_weak_stud ON weak_student_registry (student_id);
CREATE INDEX IF NOT EXISTS idx_gift_stud ON gifted_student_registry (student_id);
CREATE INDEX IF NOT EXISTS idx_rec_stud ON academic_recommendation (student_id);

-- 3. Row-Level Security (RLS)
ALTER TABLE examination_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE invigilator_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_paper ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprint_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_paper ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_exam ENABLE ROW LEVEL SECURITY;
ALTER TABLE viva_exam ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cgpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_publication ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_remark ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_student_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifted_student_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_recommendation ENABLE ROW LEVEL SECURITY;

-- 4. Tenant Isolation Policies
DO $$
BEGIN
    -- Policy creators
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_master') THEN
        CREATE POLICY tenant_isolation_exam_master ON examination_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_session') THEN
        CREATE POLICY tenant_isolation_exam_session ON examination_session FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_schedule') THEN
        CREATE POLICY tenant_isolation_exam_schedule ON examination_schedule FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_rooms') THEN
        CREATE POLICY tenant_isolation_exam_rooms ON examination_rooms FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_invig_assign') THEN
        CREATE POLICY tenant_isolation_invig_assign ON invigilator_assignment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_sub_paper') THEN
        CREATE POLICY tenant_isolation_sub_paper ON subject_paper FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_blueprint') THEN
        CREATE POLICY tenant_isolation_blueprint ON blueprint_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_quest_paper') THEN
        CREATE POLICY tenant_isolation_quest_paper ON question_paper FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_quest_bank') THEN
        CREATE POLICY tenant_isolation_quest_bank ON question_bank FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_assign_master') THEN
        CREATE POLICY tenant_isolation_assign_master ON assignment_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_proj_assess') THEN
        CREATE POLICY tenant_isolation_proj_assess ON project_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_int_assess') THEN
        CREATE POLICY tenant_isolation_int_assess ON internal_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ext_assess') THEN
        CREATE POLICY tenant_isolation_ext_assess ON external_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_pract_exam') THEN
        CREATE POLICY tenant_isolation_pract_exam ON practical_exam FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_viva_exam') THEN
        CREATE POLICY tenant_isolation_viva_exam ON viva_exam FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_marks_entry') THEN
        CREATE POLICY tenant_isolation_marks_entry ON marks_entry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_grade_book') THEN
        CREATE POLICY tenant_isolation_grade_book ON grade_book FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_gpa') THEN
        CREATE POLICY tenant_isolation_gpa ON gpa_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_cgpa') THEN
        CREATE POLICY tenant_isolation_cgpa ON cgpa_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_result') THEN
        CREATE POLICY tenant_isolation_result ON result_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_result_pub') THEN
        CREATE POLICY tenant_isolation_result_pub ON result_publication FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_promotion') THEN
        CREATE POLICY tenant_isolation_promotion ON promotion_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_remark') THEN
        CREATE POLICY tenant_isolation_remark ON academic_remark FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_perf') THEN
        CREATE POLICY tenant_isolation_perf ON performance_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_weak') THEN
        CREATE POLICY tenant_isolation_weak ON weak_student_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_gifted') THEN
        CREATE POLICY tenant_isolation_gifted ON gifted_student_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_rec') THEN
        CREATE POLICY tenant_isolation_rec ON academic_recommendation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- 5. Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_exam_master_audit') THEN
        CREATE TRIGGER tr_exam_master_audit AFTER INSERT OR UPDATE OR DELETE ON examination_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_exam_session_audit') THEN
        CREATE TRIGGER tr_exam_session_audit AFTER INSERT OR UPDATE OR DELETE ON examination_session FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_exam_schedule_audit') THEN
        CREATE TRIGGER tr_exam_schedule_audit AFTER INSERT OR UPDATE OR DELETE ON examination_schedule FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_exam_rooms_audit') THEN
        CREATE TRIGGER tr_exam_rooms_audit AFTER INSERT OR UPDATE OR DELETE ON examination_rooms FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_invig_audit') THEN
        CREATE TRIGGER tr_invig_audit AFTER INSERT OR UPDATE OR DELETE ON invigilator_assignment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_sub_paper_audit') THEN
        CREATE TRIGGER tr_sub_paper_audit AFTER INSERT OR UPDATE OR DELETE ON subject_paper FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_blueprint_audit') THEN
        CREATE TRIGGER tr_blueprint_audit AFTER INSERT OR UPDATE OR DELETE ON blueprint_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_quest_paper_audit') THEN
        CREATE TRIGGER tr_quest_paper_audit AFTER INSERT OR UPDATE OR DELETE ON question_paper FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_quest_bank_audit') THEN
        CREATE TRIGGER tr_quest_bank_audit AFTER INSERT OR UPDATE OR DELETE ON question_bank FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_assign_audit') THEN
        CREATE TRIGGER tr_assign_audit AFTER INSERT OR UPDATE OR DELETE ON assignment_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_project_audit') THEN
        CREATE TRIGGER tr_project_audit AFTER INSERT OR UPDATE OR DELETE ON project_assessment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_int_audit') THEN
        CREATE TRIGGER tr_int_audit AFTER INSERT OR UPDATE OR DELETE ON internal_assessment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ext_audit') THEN
        CREATE TRIGGER tr_ext_audit AFTER INSERT OR UPDATE OR DELETE ON external_assessment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_pract_audit') THEN
        CREATE TRIGGER tr_pract_audit AFTER INSERT OR UPDATE OR DELETE ON practical_exam FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_viva_audit') THEN
        CREATE TRIGGER tr_viva_audit AFTER INSERT OR UPDATE OR DELETE ON viva_exam FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_marks_audit') THEN
        CREATE TRIGGER tr_marks_audit AFTER INSERT OR UPDATE OR DELETE ON marks_entry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_grade_audit') THEN
        CREATE TRIGGER tr_grade_audit AFTER INSERT OR UPDATE OR DELETE ON grade_book FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_gpa_audit') THEN
        CREATE TRIGGER tr_gpa_audit AFTER INSERT OR UPDATE OR DELETE ON gpa_records FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_cgpa_audit') THEN
        CREATE TRIGGER tr_cgpa_audit AFTER INSERT OR UPDATE OR DELETE ON cgpa_records FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_result_audit') THEN
        CREATE TRIGGER tr_result_audit AFTER INSERT OR UPDATE OR DELETE ON result_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_result_pub_audit') THEN
        CREATE TRIGGER tr_result_pub_audit AFTER INSERT OR UPDATE OR DELETE ON result_publication FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_promotion_audit') THEN
        CREATE TRIGGER tr_promotion_audit AFTER INSERT OR UPDATE OR DELETE ON promotion_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_remark_audit') THEN
        CREATE TRIGGER tr_remark_audit AFTER INSERT OR UPDATE OR DELETE ON academic_remark FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_perf_audit') THEN
        CREATE TRIGGER tr_perf_audit AFTER INSERT OR UPDATE OR DELETE ON performance_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_weak_audit') THEN
        CREATE TRIGGER tr_weak_audit AFTER INSERT OR UPDATE OR DELETE ON weak_student_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_gifted_audit') THEN
        CREATE TRIGGER tr_gifted_audit AFTER INSERT OR UPDATE OR DELETE ON gifted_student_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_rec_audit') THEN
        CREATE TRIGGER tr_rec_audit AFTER INSERT OR UPDATE OR DELETE ON academic_recommendation FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
-- Phase 03.1F Enterprise AI Provider Layer Migrations

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS ai_provider_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL UNIQUE,
    base_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_model_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- 'TEXT', 'VISION', 'EMBEDDING', 'OCR'
    context_window INT NOT NULL DEFAULT 8192,
    pricing_input NUMERIC(10, 6) DEFAULT 0.000000, -- Price per 1k tokens
    pricing_output NUMERIC(10, 6) DEFAULT 0.000000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(provider_name, model_name)
);

CREATE TABLE IF NOT EXISTS ai_usage_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID,
    request_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    estimated_cost NUMERIC(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_request_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    request_type VARCHAR(100) NOT NULL, -- 'CHAT', 'VISION', 'OCR', 'EMBEDDINGS'
    prompt_text TEXT,
    is_success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_response_cache (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    prompt_hash VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, prompt_hash)
);

CREATE TABLE IF NOT EXISTS ai_api_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, provider_name)
);

CREATE TABLE IF NOT EXISTS ai_rate_limits (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'TENANT', 'USER'
    entity_id UUID NOT NULL,
    window_start TIMESTAMP NOT NULL,
    request_count INT DEFAULT 0,
    token_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, entity_type, entity_id, window_start)
);

CREATE TABLE IF NOT EXISTS ai_cost_tracking (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'TENANT', 'USER'
    entity_id UUID NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    term VARCHAR(100) NOT NULL,
    budget_limit NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    budget_spent NUMERIC(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, entity_type, entity_id, academic_year, term)
);

CREATE TABLE IF NOT EXISTS ai_provider_health (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    is_healthy BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_rate_percentage NUMERIC(5, 2) DEFAULT 0.00,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, provider_name)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_ai_prov_tenant ON ai_provider_registry (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_prov ON ai_model_registry (provider_name);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant ON ai_usage_log (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_request_tenant ON ai_request_log (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON ai_response_cache (tenant_id, prompt_hash);
CREATE INDEX IF NOT EXISTS idx_ai_keys_tenant ON ai_api_keys (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_limits_entity ON ai_rate_limits (tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_cost_entity ON ai_cost_tracking (tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_health_prov ON ai_provider_health (tenant_id, provider_name);

-- 3. Row-Level Security (RLS)
ALTER TABLE ai_provider_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_provider_health ENABLE ROW LEVEL SECURITY;

-- 4. Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_provider') THEN
        CREATE POLICY tenant_isolation_ai_provider ON ai_provider_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_model') THEN
        CREATE POLICY tenant_isolation_ai_model ON ai_model_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_usage') THEN
        CREATE POLICY tenant_isolation_ai_usage ON ai_usage_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_request') THEN
        CREATE POLICY tenant_isolation_ai_request ON ai_request_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_cache') THEN
        CREATE POLICY tenant_isolation_ai_cache ON ai_response_cache FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_keys') THEN
        CREATE POLICY tenant_isolation_ai_keys ON ai_api_keys FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_limits') THEN
        CREATE POLICY tenant_isolation_ai_limits ON ai_rate_limits FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_cost') THEN
        CREATE POLICY tenant_isolation_ai_cost ON ai_cost_tracking FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_health') THEN
        CREATE POLICY tenant_isolation_ai_health ON ai_provider_health FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- 5. Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_provider_audit') THEN
        CREATE TRIGGER tr_ai_provider_audit AFTER INSERT OR UPDATE OR DELETE ON ai_provider_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_model_audit') THEN
        CREATE TRIGGER tr_ai_model_audit AFTER INSERT OR UPDATE OR DELETE ON ai_model_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_usage_audit') THEN
        CREATE TRIGGER tr_ai_usage_audit AFTER INSERT OR UPDATE OR DELETE ON ai_usage_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_request_audit') THEN
        CREATE TRIGGER tr_ai_request_audit AFTER INSERT OR UPDATE OR DELETE ON ai_request_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_cache_audit') THEN
        CREATE TRIGGER tr_ai_cache_audit AFTER INSERT OR UPDATE OR DELETE ON ai_response_cache FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_keys_audit') THEN
        CREATE TRIGGER tr_ai_keys_audit AFTER INSERT OR UPDATE OR DELETE ON ai_api_keys FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_limits_audit') THEN
        CREATE TRIGGER tr_ai_limits_audit AFTER INSERT OR UPDATE OR DELETE ON ai_rate_limits FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_cost_audit') THEN
        CREATE TRIGGER tr_ai_cost_audit AFTER INSERT OR UPDATE OR DELETE ON ai_cost_tracking FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_health_audit') THEN
        CREATE TRIGGER tr_ai_health_audit AFTER INSERT OR UPDATE OR DELETE ON ai_provider_health FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
-- Phase 03.2G Enterprise Academic Intelligence Migrations

CREATE TABLE IF NOT EXISTS student_academic_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    overall_gpa NUMERIC(4, 2) DEFAULT 0.00,
    total_credits_earned INT DEFAULT 0,
    academic_standing VARCHAR(50) DEFAULT 'GOOD',
    learning_style VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_performance_analytics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50) NOT NULL,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    percentile_rank NUMERIC(5, 2) DEFAULT 0.00,
    class_rank INT,
    attendance_rate NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS subject_analytics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50) NOT NULL,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    pass_rate NUMERIC(5, 2) DEFAULT 0.00,
    difficulty_index NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS weak_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    reason TEXT,
    identified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remediation_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gifted_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    reason TEXT,
    identified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrichment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS dropout_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    risk_level VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    confidence_score NUMERIC(5, 2) DEFAULT 0.00,
    risk_factors JSONB,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attendance_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    predicted_attendance_rate NUMERIC(5, 2) DEFAULT 0.00,
    risk_level VARCHAR(50) NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS promotion_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    probability NUMERIC(5, 2) DEFAULT 0.00,
    recommendation VARCHAR(100),
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS learning_style_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    primary_style VARCHAR(50) NOT NULL, -- 'VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING_WRITING'
    secondary_style VARCHAR(50),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_study_plan (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'WEEKLY', 'DAILY', 'REVISION'
    plan_data JSONB NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    recommendation_text TEXT NOT NULL,
    generated_by VARCHAR(100) DEFAULT 'AI_GATEWAY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_benchmark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    benchmark_name VARCHAR(100) NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    target_value NUMERIC(10, 2) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_trend (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'CLASS', 'SUBJECT'
    entity_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    trend_data JSONB NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_alert (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    alert_message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'MEDIUM',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS performance_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    score NUMERIC(5, 2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_prediction_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    prediction_type VARCHAR(100) NOT NULL,
    prediction_result JSONB NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stud_acad_prof_tenant ON student_academic_profile (tenant_id);
CREATE INDEX IF NOT EXISTS idx_stud_perf_anal_tenant ON student_performance_analytics (tenant_id);
CREATE INDEX IF NOT EXISTS idx_subj_anal_tenant ON subject_analytics (tenant_id);
CREATE INDEX IF NOT EXISTS idx_dropout_pred_tenant ON dropout_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_att_pred_tenant ON attendance_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_promo_pred_tenant ON promotion_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_learn_style_tenant ON learning_style_profile (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_study_plan_tenant ON ai_study_plan (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommend_tenant ON ai_recommendation (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_bench_tenant ON academic_benchmark (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_trend_tenant ON academic_trend (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_alert_tenant ON academic_alert (tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_hist_tenant ON performance_history (tenant_id);
CREATE INDEX IF NOT EXISTS idx_stud_pred_log_tenant ON student_prediction_log (tenant_id);

-- Row-Level Security (RLS)
ALTER TABLE student_academic_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropout_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_style_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_study_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_benchmark ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_trend ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_alert ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_prediction_log ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_academic_profile') THEN
        CREATE POLICY tenant_isolation_student_academic_profile ON student_academic_profile FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_performance_analytics') THEN
        CREATE POLICY tenant_isolation_student_performance_analytics ON student_performance_analytics FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_subject_analytics') THEN
        CREATE POLICY tenant_isolation_subject_analytics ON subject_analytics FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_dropout_prediction') THEN
        CREATE POLICY tenant_isolation_dropout_prediction ON dropout_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_attendance_prediction') THEN
        CREATE POLICY tenant_isolation_attendance_prediction ON attendance_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_promotion_prediction') THEN
        CREATE POLICY tenant_isolation_promotion_prediction ON promotion_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_learning_style_profile') THEN
        CREATE POLICY tenant_isolation_learning_style_profile ON learning_style_profile FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_study_plan') THEN
        CREATE POLICY tenant_isolation_ai_study_plan ON ai_study_plan FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_recommendation') THEN
        CREATE POLICY tenant_isolation_ai_recommendation ON ai_recommendation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_benchmark') THEN
        CREATE POLICY tenant_isolation_academic_benchmark ON academic_benchmark FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_trend') THEN
        CREATE POLICY tenant_isolation_academic_trend ON academic_trend FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_alert') THEN
        CREATE POLICY tenant_isolation_academic_alert ON academic_alert FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_performance_history') THEN
        CREATE POLICY tenant_isolation_performance_history ON performance_history FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_prediction_log') THEN
        CREATE POLICY tenant_isolation_student_prediction_log ON student_prediction_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_academic_profile_audit') THEN
        CREATE TRIGGER tr_student_academic_profile_audit AFTER INSERT OR UPDATE OR DELETE ON student_academic_profile FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_performance_analytics_audit') THEN
        CREATE TRIGGER tr_student_performance_analytics_audit AFTER INSERT OR UPDATE OR DELETE ON student_performance_analytics FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_subject_analytics_audit') THEN
        CREATE TRIGGER tr_subject_analytics_audit AFTER INSERT OR UPDATE OR DELETE ON subject_analytics FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_dropout_prediction_audit') THEN
        CREATE TRIGGER tr_dropout_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON dropout_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_attendance_prediction_audit') THEN
        CREATE TRIGGER tr_attendance_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON attendance_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_promotion_prediction_audit') THEN
        CREATE TRIGGER tr_promotion_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON promotion_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_learning_style_profile_audit') THEN
        CREATE TRIGGER tr_learning_style_profile_audit AFTER INSERT OR UPDATE OR DELETE ON learning_style_profile FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_study_plan_audit') THEN
        CREATE TRIGGER tr_ai_study_plan_audit AFTER INSERT OR UPDATE OR DELETE ON ai_study_plan FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_recommendation_audit') THEN
        CREATE TRIGGER tr_ai_recommendation_audit AFTER INSERT OR UPDATE OR DELETE ON ai_recommendation FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_benchmark_audit') THEN
        CREATE TRIGGER tr_academic_benchmark_audit AFTER INSERT OR UPDATE OR DELETE ON academic_benchmark FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_trend_audit') THEN
        CREATE TRIGGER tr_academic_trend_audit AFTER INSERT OR UPDATE OR DELETE ON academic_trend FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_alert_audit') THEN
        CREATE TRIGGER tr_academic_alert_audit AFTER INSERT OR UPDATE OR DELETE ON academic_alert FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_performance_history_audit') THEN
        CREATE TRIGGER tr_performance_history_audit AFTER INSERT OR UPDATE OR DELETE ON performance_history FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_prediction_log_audit') THEN
        CREATE TRIGGER tr_student_prediction_log_audit AFTER INSERT OR UPDATE OR DELETE ON student_prediction_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
-- Phase 03.2H Enterprise Communication & Messaging Platform Migrations

CREATE TABLE IF NOT EXISTS notification_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_template (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 'EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP'
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS announcement_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience JSONB NOT NULL,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS circular_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    circular_number VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachment_url VARCHAR(255),
    target_audience JSONB NOT NULL,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS conversation_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255),
    type VARCHAR(50) DEFAULT 'ONE_TO_ONE', -- 'ONE_TO_ONE', 'GROUP'
    participants JSONB NOT NULL,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS message_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attachment_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    message_id UUID NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS broadcast_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender_id UUID NOT NULL,
    scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS broadcast_recipient (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    broadcast_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    channel VARCHAR(50) NOT NULL,
    content TEXT,
    delivery_status VARCHAR(50) DEFAULT 'SENT',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS sms_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS whatsapp_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS push_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS reminder_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 'HOMEWORK', 'FEE', 'ATTENDANCE', 'EXAMINATION', 'HOLIDAY', 'MEETING'
    scheduled_at TIMESTAMP NOT NULL,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS event_invitation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    event_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    response_status VARCHAR(50) DEFAULT 'PENDING',
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
    user_id UUID NOT NULL,
    channel_preferences JSONB NOT NULL,
    category_preferences JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS device_token (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'IOS', 'ANDROID', 'WEB'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS delivery_status (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    message_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'SENT', 'DELIVERED', 'READ', 'FAILED'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    version INT DEFAULT 1
);


-- Indexes
CREATE INDEX IF NOT EXISTS idx_notif_tenant ON notification_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_annc_tenant ON announcement_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_circ_tenant ON circular_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conv_tenant ON conversation_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_msg_tenant ON message_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_brdc_tenant ON broadcast_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notiflog_tenant ON notification_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_q_tenant ON email_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sms_q_tenant ON sms_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wa_q_tenant ON whatsapp_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_push_q_tenant ON push_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rem_tenant ON reminder_master(tenant_id);


-- Row-Level Security (RLS)
ALTER TABLE notification_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE circular_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachment_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_recipient ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitation ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_status ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_master') THEN
        CREATE POLICY tenant_isolation_notification_master ON notification_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_template') THEN
        CREATE POLICY tenant_isolation_notification_template ON notification_template FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_announcement_master') THEN
        CREATE POLICY tenant_isolation_announcement_master ON announcement_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_circular_master') THEN
        CREATE POLICY tenant_isolation_circular_master ON circular_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_conversation_master') THEN
        CREATE POLICY tenant_isolation_conversation_master ON conversation_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_message_master') THEN
        CREATE POLICY tenant_isolation_message_master ON message_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_attachment_master') THEN
        CREATE POLICY tenant_isolation_attachment_master ON attachment_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_broadcast_master') THEN
        CREATE POLICY tenant_isolation_broadcast_master ON broadcast_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_broadcast_recipient') THEN
        CREATE POLICY tenant_isolation_broadcast_recipient ON broadcast_recipient FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_log') THEN
        CREATE POLICY tenant_isolation_notification_log ON notification_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_email_queue') THEN
        CREATE POLICY tenant_isolation_email_queue ON email_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_sms_queue') THEN
        CREATE POLICY tenant_isolation_sms_queue ON sms_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_whatsapp_queue') THEN
        CREATE POLICY tenant_isolation_whatsapp_queue ON whatsapp_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_push_queue') THEN
        CREATE POLICY tenant_isolation_push_queue ON push_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_reminder_master') THEN
        CREATE POLICY tenant_isolation_reminder_master ON reminder_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_event_invitation') THEN
        CREATE POLICY tenant_isolation_event_invitation ON event_invitation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_preference') THEN
        CREATE POLICY tenant_isolation_notification_preference ON notification_preference FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_device_token') THEN
        CREATE POLICY tenant_isolation_device_token ON device_token FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_delivery_status') THEN
        CREATE POLICY tenant_isolation_delivery_status ON delivery_status FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_notification_master_audit') THEN
        CREATE TRIGGER tr_notification_master_audit AFTER INSERT OR UPDATE OR DELETE ON notification_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_notification_template_audit') THEN
        CREATE TRIGGER tr_notification_template_audit AFTER INSERT OR UPDATE OR DELETE ON notification_template FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_announcement_master_audit') THEN
        CREATE TRIGGER tr_announcement_master_audit AFTER INSERT OR UPDATE OR DELETE ON announcement_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_circular_master_audit') THEN
        CREATE TRIGGER tr_circular_master_audit AFTER INSERT OR UPDATE OR DELETE ON circular_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_conversation_master_audit') THEN
        CREATE TRIGGER tr_conversation_master_audit AFTER INSERT OR UPDATE OR DELETE ON conversation_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_message_master_audit') THEN
        CREATE TRIGGER tr_message_master_audit AFTER INSERT OR UPDATE OR DELETE ON message_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_broadcast_master_audit') THEN
        CREATE TRIGGER tr_broadcast_master_audit AFTER INSERT OR UPDATE OR DELETE ON broadcast_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_email_queue_audit') THEN
        CREATE TRIGGER tr_email_queue_audit AFTER INSERT OR UPDATE OR DELETE ON email_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_sms_queue_audit') THEN
        CREATE TRIGGER tr_sms_queue_audit AFTER INSERT OR UPDATE OR DELETE ON sms_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_whatsapp_queue_audit') THEN
        CREATE TRIGGER tr_whatsapp_queue_audit AFTER INSERT OR UPDATE OR DELETE ON whatsapp_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_push_queue_audit') THEN
        CREATE TRIGGER tr_push_queue_audit AFTER INSERT OR UPDATE OR DELETE ON push_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_reminder_master_audit') THEN
        CREATE TRIGGER tr_reminder_master_audit AFTER INSERT OR UPDATE OR DELETE ON reminder_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
-- Phase 03.2I Enterprise Library & Digital Knowledge Management Platform Migrations

CREATE TABLE IF NOT EXISTS library_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_subcategory (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_id UUID NOT NULL REFERENCES library_category(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS author_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS publisher_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_book (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    category_id UUID REFERENCES library_category(id),
    subcategory_id UUID REFERENCES library_subcategory(id),
    author_id UUID REFERENCES author_master(id),
    publisher_id UUID REFERENCES publisher_master(id),
    edition VARCHAR(50),
    language VARCHAR(50),
    pages INT,
    price DECIMAL(10, 2),
    description TEXT,
    cover_image_url VARCHAR(255),
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS shelf_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    shelf_number VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_copy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_book(id),
    barcode VARCHAR(100) UNIQUE,
    shelf_id UUID REFERENCES shelf_master(id),
    condition VARCHAR(50) DEFAULT 'GOOD', -- 'GOOD', 'DAMAGED', 'LOST'
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_member (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL, -- Reference to user
    member_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'TEACHER', 'STAFF'
    max_books_allowed INT DEFAULT 2,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_card (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    card_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_issue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    copy_id UUID NOT NULL REFERENCES library_copy(id),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    is_returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_return (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    issue_id UUID NOT NULL REFERENCES library_issue(id),
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    condition_on_return VARCHAR(50),
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_reservation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    book_id UUID NOT NULL REFERENCES library_book(id),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fine_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    issue_id UUID REFERENCES library_issue(id),
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS rfid_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    copy_id UUID REFERENCES library_copy(id),
    rfid_tag VARCHAR(255) UNIQUE NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS qr_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'BOOK', 'COPY', 'MEMBER'
    entity_id UUID NOT NULL,
    qr_code_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS digital_resource (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL, -- 'EBOOK', 'RESEARCH_PAPER', 'JOURNAL', 'STUDY_MATERIAL', 'PREVIOUS_PAPER', 'QUESTION_BANK', 'VIDEO', 'AUDIO'
    category_id UUID REFERENCES library_category(id),
    author_id UUID REFERENCES author_master(id),
    file_url VARCHAR(255) NOT NULL,
    file_size INT,
    search_vector TSVECTOR,
    published_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ebook_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    isbn VARCHAR(50),
    format VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS research_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    doi VARCHAR(100),
    abstract TEXT,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS journal_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    volume VARCHAR(50),
    issue VARCHAR(50),
    issn VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS previous_year_paper (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    examination VARCHAR(100),
    subject VARCHAR(100),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    subject VARCHAR(100),
    topic VARCHAR(100),
    difficulty_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS study_material (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    class_name VARCHAR(50),
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS book_review (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_book(id),
    member_id UUID NOT NULL REFERENCES library_member(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    book_id UUID REFERENCES library_book(id),
    resource_id UUID REFERENCES digital_resource(id),
    read_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_book_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    recommended_books JSONB NOT NULL,
    recommended_resources JSONB,
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS knowledge_collection (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    curator_id UUID,
    resources JSONB, -- Array of resource IDs or book IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS resource_download_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    member_id UUID NOT NULL REFERENCES library_member(id),
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lib_book_tenant ON library_book(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_copy_tenant ON library_copy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_issue_tenant ON library_issue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_resrv_tenant ON library_reservation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dig_res_tenant ON digital_resource(tenant_id);

-- TSVector Update Triggers for Search
CREATE OR REPLACE FUNCTION lib_book_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
     setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('english', coalesce(new.isbn,'')), 'B') ||
     setweight(to_tsvector('english', coalesce(new.description,'')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER lib_book_tsvectorupdate BEFORE INSERT OR UPDATE
    ON library_book FOR EACH ROW EXECUTE PROCEDURE lib_book_search_trigger();

CREATE OR REPLACE FUNCTION dig_res_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
     setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('english', coalesce(new.description,'')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER dig_res_tsvectorupdate BEFORE INSERT OR UPDATE
    ON digital_resource FOR EACH ROW EXECUTE PROCEDURE dig_res_search_trigger();

-- Row-Level Security (RLS)
ALTER TABLE library_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_subcategory ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_copy ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_issue ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_return ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_reservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfid_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE previous_year_paper ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_book_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_download_log ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
DECLARE
    table_name text;
    policy_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'library_category', 'library_subcategory', 'author_master', 'publisher_master',
            'library_book', 'shelf_master', 'library_copy', 'library_member', 'library_card',
            'library_issue', 'library_return', 'library_reservation', 'fine_master',
            'rfid_registry', 'qr_registry', 'digital_resource', 'ebook_repository',
            'research_repository', 'journal_repository', 'previous_year_paper',
            'question_bank', 'study_material', 'book_review', 'reading_history',
            'ai_book_recommendation', 'knowledge_collection', 'resource_download_log'
          )
    LOOP
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Audit Triggers
DO $$
DECLARE
    table_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'library_category', 'library_subcategory', 'author_master', 'publisher_master',
            'library_book', 'shelf_master', 'library_copy', 'library_member', 'library_card',
            'library_issue', 'library_return', 'library_reservation', 'fine_master',
            'rfid_registry', 'qr_registry', 'digital_resource', 'ebook_repository',
            'research_repository', 'journal_repository', 'previous_year_paper',
            'question_bank', 'study_material', 'book_review', 'reading_history',
            'ai_book_recommendation', 'knowledge_collection', 'resource_download_log'
          )
    LOOP
        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
-- Phase 03.2J Enterprise Finance, Fee, Accounting & Revenue Management Platform Migrations

CREATE TABLE IF NOT EXISTS financial_year (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    year_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_head (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_refundable BOOLEAN DEFAULT FALSE,
    category_id UUID REFERENCES fee_category(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_structure (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    academic_year_id UUID,
    class_id UUID,
    total_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_installment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    structure_id UUID NOT NULL REFERENCES fee_structure(id),
    installment_name VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    late_fee_per_day DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_fee (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    structure_id UUID REFERENCES fee_structure(id),
    installment_id UUID REFERENCES fee_installment(id),
    total_amount DECIMAL(15,2) NOT NULL,
    concession_amount DECIMAL(15,2) DEFAULT 0,
    scholarship_amount DECIMAL(15,2) DEFAULT 0,
    fine_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_amount DECIMAL(15,2) NOT NULL,
    due_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS receipt (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    payment_id UUID NOT NULL REFERENCES payment(id),
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_collection (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_fee_id UUID NOT NULL REFERENCES student_fee(id),
    payment_id UUID NOT NULL REFERENCES payment(id),
    amount_allocated DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS refund (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    payment_id UUID REFERENCES payment(id),
    amount DECIMAL(15,2) NOT NULL,
    reason TEXT,
    refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS scholarship (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS concession (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    reason VARCHAR(255) NOT NULL,
    percentage DECIMAL(5,2),
    amount DECIMAL(15,2),
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_group VARCHAR(100) NOT NULL,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    balance_type VARCHAR(10) DEFAULT 'DEBIT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS voucher (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    voucher_number VARCHAR(100) UNIQUE NOT NULL,
    voucher_date DATE NOT NULL,
    voucher_type VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    narration TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ledger (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    account_id UUID NOT NULL REFERENCES account(id),
    voucher_id UUID REFERENCES voucher(id),
    transaction_date DATE NOT NULL,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    narration TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS journal_entry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    voucher_id UUID NOT NULL REFERENCES voucher(id),
    account_id UUID NOT NULL REFERENCES account(id),
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS cash_book (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    transaction_date DATE NOT NULL,
    receipt_amount DECIMAL(15,2) DEFAULT 0,
    payment_amount DECIMAL(15,2) DEFAULT 0,
    balance DECIMAL(15,2) NOT NULL,
    particulars TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS bank_account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    ifsc_code VARCHAR(50),
    branch_name VARCHAR(255),
    current_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS expense (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    expense_category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    paid_to VARCHAR(255),
    description TEXT,
    voucher_id UUID REFERENCES voucher(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS income (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    income_category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    income_date DATE NOT NULL,
    received_from VARCHAR(255),
    description TEXT,
    voucher_id UUID REFERENCES voucher(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS budget (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    financial_year_id UUID NOT NULL REFERENCES financial_year(id),
    department VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    utilized_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS tax (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    tax_name VARCHAR(100) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gst (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    gstin VARCHAR(50) NOT NULL,
    cgst_percentage DECIMAL(5,2) DEFAULT 0,
    sgst_percentage DECIMAL(5,2) DEFAULT 0,
    igst_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS invoice (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID,
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fee_reminder (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    student_fee_id UUID REFERENCES student_fee(id),
    reminder_date DATE NOT NULL,
    message TEXT,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS revenue_report (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    report_date DATE NOT NULL,
    total_collection DECIMAL(15,2) DEFAULT 0,
    total_due DECIMAL(15,2) DEFAULT 0,
    total_expense DECIMAL(15,2) DEFAULT 0,
    net_revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fin_year_tenant ON financial_year(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fee_struct_tenant ON fee_structure(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_fee_tenant ON student_fee(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_payment_tenant ON payment(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_receipt_tenant ON receipt(tenant_id, payment_id);
CREATE INDEX IF NOT EXISTS idx_voucher_tenant ON voucher(tenant_id, voucher_date);
CREATE INDEX IF NOT EXISTS idx_ledger_tenant ON ledger(tenant_id, account_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_tenant ON journal_entry(tenant_id, voucher_id);

-- Row-Level Security (RLS)
ALTER TABLE financial_year ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_head ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_installment ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship ENABLE ROW LEVEL SECURITY;
ALTER TABLE concession ENABLE ROW LEVEL SECURITY;
ALTER TABLE account ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_reminder ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_report ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
DECLARE
    table_name text;
    policy_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'financial_year', 'fee_category', 'fee_head', 'fee_structure', 'fee_installment',
            'student_fee', 'payment', 'receipt', 'fee_collection', 'refund', 'scholarship',
            'concession', 'account', 'voucher', 'ledger', 'journal_entry', 'cash_book',
            'bank_account', 'expense', 'income', 'budget', 'tax', 'gst', 'invoice',
            'fee_reminder', 'revenue_report'
          )
    LOOP
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Audit Triggers
DO $$
DECLARE
    table_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'financial_year', 'fee_category', 'fee_head', 'fee_structure', 'fee_installment',
            'student_fee', 'payment', 'receipt', 'fee_collection', 'refund', 'scholarship',
            'concession', 'account', 'voucher', 'ledger', 'journal_entry', 'cash_book',
            'bank_account', 'expense', 'income', 'budget', 'tax', 'gst', 'invoice',
            'fee_reminder', 'revenue_report'
          )
    LOOP
        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
-- Phase 03.2K Enterprise Transport, Fleet, GPS & Student Mobility Platform Migrations

CREATE TABLE IF NOT EXISTS vehicle_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    capacity INT NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year_of_manufacture INT,
    chassis_number VARCHAR(100),
    engine_number VARCHAR(100),
    gps_device_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS driver_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    alternate_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS conductor_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS transport_route (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    start_point VARCHAR(255) NOT NULL,
    end_point VARCHAR(255) NOT NULL,
    estimated_duration_mins INT,
    estimated_distance_km DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS route_stop (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    route_id UUID NOT NULL REFERENCES transport_route(id),
    stop_name VARCHAR(255) NOT NULL,
    stop_order INT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    estimated_arrival_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_transport (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    route_id UUID REFERENCES transport_route(id),
    pickup_stop_id UUID REFERENCES route_stop(id),
    drop_stop_id UUID REFERENCES route_stop(id),
    transport_fee DECIMAL(10,2),
    fee_cycle VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS seat_allocation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_transport_id UUID NOT NULL REFERENCES student_transport(id),
    vehicle_id UUID NOT NULL REFERENCES vehicle_master(id),
    seat_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gps_device (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    device_imei VARCHAR(100) UNIQUE NOT NULL,
    sim_number VARCHAR(50),
    provider VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS live_location (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicle_master(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS trip_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicle_master(id),
    route_id UUID NOT NULL REFERENCES transport_route(id),
    driver_id UUID REFERENCES driver_master(id),
    conductor_id UUID REFERENCES conductor_master(id),
    trip_date DATE NOT NULL,
    trip_type VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    start_odometer INT,
    end_odometer INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS transport_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    trip_id UUID NOT NULL REFERENCES trip_master(id),
    stop_id UUID REFERENCES route_stop(id),
    boarding_type VARCHAR(50), -- PICKUP, DROP
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(50), -- RFID, QR, FACE, MANUAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS emergency_alert (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    trip_id UUID REFERENCES trip_master(id),
    vehicle_id UUID REFERENCES vehicle_master(id),
    alert_type VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS vehicle_maintenance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicle_master(id),
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(100),
    cost DECIMAL(10,2),
    vendor VARCHAR(255),
    description TEXT,
    next_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fuel_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicle_master(id),
    fill_date DATE NOT NULL,
    quantity_liters DECIMAL(8,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    odometer_reading INT,
    receipt_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Basic RLS
ALTER TABLE vehicle_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE conductor_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_route ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stop ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_device ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alert ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_log ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    table_name text;
    policy_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'vehicle_master', 'driver_master', 'conductor_master', 'transport_route', 'route_stop',
            'student_transport', 'seat_allocation', 'gps_device', 'live_location', 'trip_master',
            'transport_attendance', 'emergency_alert', 'vehicle_maintenance', 'fuel_log'
          )
    LOOP
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;
    END LOOP;
END $$;

DO $$
DECLARE
    table_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'vehicle_master', 'driver_master', 'conductor_master', 'transport_route', 'route_stop',
            'student_transport', 'seat_allocation', 'gps_device', 'live_location', 'trip_master',
            'transport_attendance', 'emergency_alert', 'vehicle_maintenance', 'fuel_log'
          )
    LOOP
        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
-- Phase 03.2L Enterprise Hostel, Accommodation, Mess & Residential Management Platform Migrations

CREATE TABLE IF NOT EXISTS hostel_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_name VARCHAR(255) NOT NULL,
    hostel_type VARCHAR(50), -- BOYS, GIRLS, CO-ED
    capacity INT,
    address TEXT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_building (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostel_master(id),
    building_name VARCHAR(100) NOT NULL,
    number_of_floors INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_block (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    building_id UUID NOT NULL REFERENCES hostel_building(id),
    block_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_floor (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    block_id UUID NOT NULL REFERENCES hostel_block(id),
    floor_number INT NOT NULL,
    floor_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_room (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    floor_id UUID NOT NULL REFERENCES hostel_floor(id),
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(50), -- AC, NON-AC, SINGLE, DOUBLE, TRIPLE
    capacity INT NOT NULL,
    base_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_bed (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    room_id UUID NOT NULL REFERENCES hostel_room(id),
    bed_number VARCHAR(50) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_allocation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    bed_id UUID NOT NULL REFERENCES hostel_bed(id),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_transfer (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    allocation_id UUID NOT NULL REFERENCES hostel_allocation(id),
    from_bed_id UUID NOT NULL REFERENCES hostel_bed(id),
    to_bed_id UUID NOT NULL REFERENCES hostel_bed(id),
    transfer_date DATE NOT NULL,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_leave (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING' -- PENDING, APPROVED, REJECTED
);

CREATE TABLE IF NOT EXISTS visitor_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    id_proof_type VARCHAR(50),
    id_proof_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS visitor_pass (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    visitor_id UUID NOT NULL REFERENCES visitor_master(id),
    student_id UUID NOT NULL,
    visit_date DATE NOT NULL,
    in_time TIMESTAMP,
    out_time TIMESTAMP,
    purpose TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gate_pass (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    issue_date DATE NOT NULL,
    valid_until TIMESTAMP,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_complaint (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    room_id UUID REFERENCES hostel_room(id),
    category VARCHAR(100),
    description TEXT,
    raised_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    resolved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'OPEN' -- OPEN, IN_PROGRESS, RESOLVED
);

CREATE TABLE IF NOT EXISTS hostel_maintenance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    room_id UUID REFERENCES hostel_room(id),
    hostel_id UUID REFERENCES hostel_master(id),
    maintenance_type VARCHAR(100),
    scheduled_date DATE,
    completion_date DATE,
    cost DECIMAL(10,2),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'SCHEDULED' -- SCHEDULED, IN_PROGRESS, COMPLETED
);

CREATE TABLE IF NOT EXISTS hostel_inventory (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostel_master(id),
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_staff (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostel_master(id),
    staff_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS warden_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostel_master(id),
    user_id UUID NOT NULL,
    warden_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_fee (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    allocation_id UUID REFERENCES hostel_allocation(id),
    fee_amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS mess_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID REFERENCES hostel_master(id),
    mess_name VARCHAR(255) NOT NULL,
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS mess_plan (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    mess_id UUID NOT NULL REFERENCES mess_master(id),
    plan_name VARCHAR(100) NOT NULL,
    diet_type VARCHAR(50), -- VEG, NON_VEG
    monthly_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS meal_menu (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    mess_plan_id UUID NOT NULL REFERENCES mess_plan(id),
    day_of_week VARCHAR(20) NOT NULL,
    meal_type VARCHAR(50) NOT NULL, -- BREAKFAST, LUNCH, DINNER
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS meal_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    mess_plan_id UUID REFERENCES mess_plan(id),
    meal_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    consumed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS laundry_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID REFERENCES hostel_master(id),
    vendor_name VARCHAR(255),
    price_per_kg DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS laundry_transaction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    laundry_id UUID REFERENCES laundry_master(id),
    drop_date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    item_count INT,
    pickup_date DATE,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING' -- PENDING, WASHING, READY, DELIVERED
);

CREATE TABLE IF NOT EXISTS room_inspection (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    room_id UUID NOT NULL REFERENCES hostel_room(id),
    inspected_by UUID NOT NULL,
    inspection_date DATE NOT NULL,
    remarks TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS electricity_reading (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    room_id UUID NOT NULL REFERENCES hostel_room(id),
    reading_date DATE NOT NULL,
    units DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS water_consumption (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostel_master(id),
    reading_date DATE NOT NULL,
    liters DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hostel_notice (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    hostel_id UUID REFERENCES hostel_master(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- RLS Enablement
DO $$
DECLARE
    table_name text;
    policy_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'hostel_master', 'hostel_building', 'hostel_block', 'hostel_floor', 'hostel_room',
            'hostel_bed', 'hostel_allocation', 'hostel_transfer', 'hostel_leave', 'visitor_master',
            'visitor_pass', 'gate_pass', 'hostel_complaint', 'hostel_maintenance', 'hostel_inventory',
            'hostel_staff', 'warden_master', 'hostel_fee', 'mess_master', 'mess_plan', 'meal_menu',
            'meal_attendance', 'laundry_master', 'laundry_transaction', 'room_inspection',
            'electricity_reading', 'water_consumption', 'hostel_notice'
          )
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;

        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
-- Phase 03.2M Enterprise HR, Payroll, Leave, Attendance & Employee Self-Service Platform Migrations

CREATE TABLE IF NOT EXISTS shift_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    half_day_hours DECIMAL(4,2),
    full_day_hours DECIMAL(4,2),
    grace_time_mins INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS shift_assignment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    shift_id UUID NOT NULL REFERENCES shift_master(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS holiday_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    holiday_name VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type VARCHAR(50), -- NATIONAL, OPTIONAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Add new columns to existing employee_attendance
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS check_in TIMESTAMP;
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS check_out TIMESTAMP;
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS late_mins INT;
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS early_exit_mins INT;
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS overtime_mins INT;
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES shift_master(id);
ALTER TABLE employee_attendance ADD COLUMN IF NOT EXISTS record_status VARCHAR(50) DEFAULT 'ACTIVE';

CREATE TABLE IF NOT EXISTS biometric_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    device_id VARCHAR(100),
    punch_time TIMESTAMP NOT NULL,
    punch_type VARCHAR(50), -- IN, OUT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gps_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    punch_time TIMESTAMP NOT NULL,
    punch_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS face_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    face_image_url TEXT,
    confidence_score DECIMAL(5,2),
    punch_time TIMESTAMP NOT NULL,
    punch_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attendance_correction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    attendance_date DATE NOT NULL,
    requested_check_in TIMESTAMP,
    requested_check_out TIMESTAMP,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS leave_type (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    yearly_limit INT,
    carry_forward BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS leave_balance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL REFERENCES leave_type(id),
    financial_year VARCHAR(20) NOT NULL,
    allocated_days DECIMAL(5,1) NOT NULL,
    used_days DECIMAL(5,1) DEFAULT 0,
    balance_days DECIMAL(5,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS leave_application (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_type_id UUID NOT NULL REFERENCES leave_type(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days DECIMAL(5,1) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS leave_approval (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    leave_application_id UUID NOT NULL REFERENCES leave_application(id),
    approver_id UUID NOT NULL,
    approval_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    approval_status VARCHAR(50) NOT NULL, -- APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payroll_cycle (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cycle_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS salary_structure (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    structure_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS salary_component (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    structure_id UUID NOT NULL REFERENCES salary_structure(id),
    component_name VARCHAR(100) NOT NULL,
    component_type VARCHAR(50) NOT NULL, -- EARNING, DEDUCTION
    amount_type VARCHAR(50), -- FIXED, PERCENTAGE
    amount_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_salary (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    structure_id UUID NOT NULL REFERENCES salary_structure(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    annual_ctc DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payroll_run (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cycle_id UUID NOT NULL REFERENCES payroll_cycle(id),
    run_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by UUID,
    total_gross DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    total_net DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PROCESSED'
);

CREATE TABLE IF NOT EXISTS payslip (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    payroll_run_id UUID NOT NULL REFERENCES payroll_run(id),
    gross_salary DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'GENERATED'
);

CREATE TABLE IF NOT EXISTS payroll_adjustment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    payroll_run_id UUID REFERENCES payroll_run(id),
    adjustment_type VARCHAR(50), -- BONUS, DEDUCTION, INCENTIVE
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS payroll_bonus (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    bonus_type VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    award_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payroll_incentive (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    incentive_type VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    award_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payroll_deduction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    deduction_type VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    deduction_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_loan (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    principal_amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2),
    tenure_months INT NOT NULL,
    emi_amount DECIMAL(10,2),
    disbursement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS loan_installment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    loan_id UUID NOT NULL REFERENCES employee_loan(id),
    installment_number INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS advance_salary (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    request_date DATE NOT NULL,
    recovery_month VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS reimbursement (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    expense_type VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS claim (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    claim_type VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    claim_date DATE NOT NULL,
    description TEXT,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS tax_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    pan_number VARCHAR(20),
    tax_regime VARCHAR(50), -- OLD, NEW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS pf_account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    uan_number VARCHAR(50),
    pf_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS esi_account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    esi_number VARCHAR(50),
    dispensary VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS professional_tax (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    state VARCHAR(100),
    pt_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS tds_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    financial_year VARCHAR(20),
    total_tax_liability DECIMAL(12,2),
    tds_deducted DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS payroll_ledger (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    payroll_run_id UUID REFERENCES payroll_run(id),
    account_type VARCHAR(100), -- SALARY_PAYABLE, PF_PAYABLE, TDS_PAYABLE
    amount DECIMAL(15,2),
    transaction_type VARCHAR(50), -- CR, DR
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_document (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    document_type VARCHAR(100),
    document_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_bank_account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    ifsc_code VARCHAR(50),
    branch_name VARCHAR(100),
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

CREATE TABLE IF NOT EXISTS employee_self_service (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    request_type VARCHAR(100), -- ADDRESS_CHANGE, BANK_CHANGE
    request_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS payroll_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    payroll_run_id UUID REFERENCES payroll_run(id),
    audited_by UUID,
    audit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    findings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- RLS Enablement
DO $$
DECLARE
    table_name text;
    policy_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'shift_master', 'shift_assignment', 'holiday_master', 'employee_attendance',
            'biometric_attendance', 'gps_attendance', 'face_attendance', 'attendance_correction',
            'leave_type', 'leave_balance', 'leave_application', 'leave_approval',
            'payroll_cycle', 'salary_structure', 'salary_component', 'employee_salary',
            'payroll_run', 'payslip', 'payroll_adjustment', 'payroll_bonus', 'payroll_incentive',
            'payroll_deduction', 'employee_loan', 'loan_installment', 'advance_salary',
            'reimbursement', 'claim', 'tax_profile', 'pf_account', 'esi_account',
            'professional_tax', 'tds_profile', 'payroll_ledger', 'employee_document',
            'employee_bank_account', 'employee_self_service', 'payroll_audit'
          )
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;

        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
-- Phase 03.2N Enterprise Asset, Inventory, Procurement & Store Management Platform Migrations

CREATE TABLE IF NOT EXISTS asset_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS asset_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_id UUID REFERENCES asset_category(id),
    asset_name VARCHAR(255) NOT NULL,
    asset_code VARCHAR(100) NOT NULL,
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    current_value DECIMAL(15,2),
    barcode VARCHAR(100),
    serial_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS asset_location (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS asset_assignment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    assigned_to UUID, -- user/employee id
    assigned_date DATE NOT NULL,
    return_date DATE,
    condition_on_assignment VARCHAR(100),
    condition_on_return VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS asset_maintenance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(100),
    cost DECIMAL(10,2),
    description TEXT,
    performed_by VARCHAR(255),
    next_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'COMPLETED'
);

CREATE TABLE IF NOT EXISTS asset_depreciation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    depreciation_date DATE NOT NULL,
    depreciation_value DECIMAL(10,2),
    book_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS inventory_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS inventory_item (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_id UUID REFERENCES inventory_category(id),
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(100) NOT NULL,
    uom VARCHAR(50), -- Unit of Measure
    reorder_level INT,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS warehouse (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    warehouse_name VARCHAR(100) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS store_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    warehouse_id UUID REFERENCES warehouse(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS stock (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    item_id UUID NOT NULL REFERENCES inventory_item(id),
    store_id UUID NOT NULL REFERENCES store_master(id),
    quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS stock_movement (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    item_id UUID NOT NULL REFERENCES inventory_item(id),
    from_store_id UUID REFERENCES store_master(id),
    to_store_id UUID REFERENCES store_master(id),
    quantity DECIMAL(12,2) NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- IN, OUT, TRANSFER
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS vendor_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS vendor_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    tax_number VARCHAR(100),
    address TEXT,
    category_id UUID REFERENCES vendor_category(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS vendor_contact (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendor_master(id),
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS purchase_request (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    requested_by UUID NOT NULL,
    request_date DATE NOT NULL,
    required_date DATE,
    department VARCHAR(100),
    total_estimated_amount DECIMAL(15,2),
    approval_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS purchase_order (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendor_master(id),
    purchase_request_id UUID REFERENCES purchase_request(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    payment_terms TEXT,
    approval_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS purchase_order_item (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES purchase_order(id),
    item_id UUID NOT NULL REFERENCES inventory_item(id),
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS goods_receipt (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES purchase_order(id),
    receipt_date DATE NOT NULL,
    received_by UUID NOT NULL,
    delivery_note_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS quotation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendor_master(id),
    purchase_request_id UUID REFERENCES purchase_request(id),
    quotation_date DATE NOT NULL,
    valid_until DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS invoice (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    purchase_order_id UUID REFERENCES purchase_order(id),
    vendor_id UUID NOT NULL REFERENCES vendor_master(id),
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS inventory_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    store_id UUID NOT NULL REFERENCES store_master(id),
    audit_date DATE NOT NULL,
    audited_by UUID NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'COMPLETED'
);

CREATE TABLE IF NOT EXISTS inventory_transfer (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    from_store_id UUID NOT NULL REFERENCES store_master(id),
    to_store_id UUID NOT NULL REFERENCES store_master(id),
    transfer_date DATE NOT NULL,
    requested_by UUID,
    approved_by UUID,
    transfer_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS inventory_adjustment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    item_id UUID NOT NULL REFERENCES inventory_item(id),
    store_id UUID NOT NULL REFERENCES store_master(id),
    adjustment_date DATE NOT NULL,
    adjusted_quantity DECIMAL(12,2) NOT NULL,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS warranty (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    provider_name VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms TEXT,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS amc_contract (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    vendor_id UUID NOT NULL REFERENCES vendor_master(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cost DECIMAL(12,2),
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS scrap_asset (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset_master(id),
    scrap_date DATE NOT NULL,
    reason TEXT,
    scrap_value DECIMAL(10,2),
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- RLS Enablement
DO $$
DECLARE
    table_name text;
    policy_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'asset_category', 'asset_master', 'asset_location', 'asset_assignment',
            'asset_maintenance', 'asset_depreciation', 'inventory_category', 'inventory_item',
            'warehouse', 'store_master', 'stock', 'stock_movement', 'vendor_category',
            'vendor_master', 'vendor_contact', 'purchase_request', 'purchase_order',
            'purchase_order_item', 'goods_receipt', 'quotation', 'invoice', 'inventory_audit',
            'inventory_transfer', 'inventory_adjustment', 'warranty', 'amc_contract', 'scrap_asset'
          )
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;

        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
