-- Phase 03.2D Employee & Teacher Workforce Migrations

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    employment_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    official_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    emergency_contacts JSONB,
    blood_group VARCHAR(10),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    marital_status VARCHAR(50),
    nationality VARCHAR(50),
    religion VARCHAR(50),
    address JSONB,
    photo_url TEXT,
    biometric_id VARCHAR(100),
    rfid VARCHAR(100),
    face_recognition_id VARCHAR(100),
    digital_signature_url TEXT,
    fido2_registration JSONB,
    employment_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_emp_email_tenant ON employees(tenant_id, official_email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_emp_id_tenant ON employees(tenant_id, employee_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    teacher_number VARCHAR(50) NOT NULL,
    qualifications JSONB,
    experience_years INT DEFAULT 0,
    skills JSONB,
    subjects JSONB,
    teaching_languages JSONB,
    board_certifications JSONB,
    achievements JSONB,
    research JSONB,
    awards JSONB,
    professional_membership JSONB,
    ai_teaching_profile TEXT,
    digital_portfolio_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,
    work_hours NUMERIC(5,2),
    overtime_hours NUMERIC(5,2),
    shift_mapping VARCHAR(100),
    is_locked BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS employee_leaves (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    approved_by UUID,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    review_date TIMESTAMP NOT NULL,
    kpi_score NUMERIC(5,2) NOT NULL,
    okr_progress NUMERIC(5,2) NOT NULL,
    reviewer_id UUID NOT NULL,
    comments TEXT,
    training_recommendation TEXT,
    promotion_recommendation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS training_courses (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    learning_hours INT NOT NULL,
    certification VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS employee_training (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    course_id UUID NOT NULL REFERENCES training_courses(id),
    status VARCHAR(50) NOT NULL,
    completion_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1
);

-- Apply RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_employees ON employees; CREATE POLICY tenant_isolation_employees ON employees FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_teachers ON teachers; CREATE POLICY tenant_isolation_teachers ON teachers FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_emp_att ON employee_attendance; CREATE POLICY tenant_isolation_emp_att ON employee_attendance FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE employee_leaves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_emp_leave ON employee_leaves; CREATE POLICY tenant_isolation_emp_leave ON employee_leaves FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_perf_rev ON performance_reviews; CREATE POLICY tenant_isolation_perf_rev ON performance_reviews FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_train_courses ON training_courses; CREATE POLICY tenant_isolation_train_courses ON training_courses FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE employee_training ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_emp_train ON employee_training; CREATE POLICY tenant_isolation_emp_train ON employee_training FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
