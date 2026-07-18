-- Phase 03.2C Student Lifecycle Migrations

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,
    remarks TEXT,
    is_locked BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS behaviour_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    incident_date TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    score_impact INT NOT NULL,
    reported_by UUID NOT NULL,
    is_principal_review_required BOOLEAN DEFAULT FALSE,
    parent_notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    blood_group VARCHAR(10),
    medical_conditions JSONB,
    allergies JSONB,
    vaccinations JSONB,
    emergency_alerts JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS medical_visits (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES student_master(id),
    visit_date TIMESTAMP NOT NULL,
    symptoms TEXT NOT NULL,
    treatment TEXT NOT NULL,
    doctor_notes TEXT,
    referred_to_hospital BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- RLS Policies
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_attendance ON attendance_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE behaviour_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_behaviour ON behaviour_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_health ON health_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE medical_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_medical_visits ON medical_visits FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
