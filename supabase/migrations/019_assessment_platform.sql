-- Phase 03.2P: Assessment Platform Database Migration
-- Includes Question Bank, CBT, OMR, and Result engines.

-- question_bank
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    campus_id UUID,
    subject_id UUID NOT NULL,
    topic_id UUID,
    question_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB,
    explanation TEXT,
    difficulty_level VARCHAR(50) NOT NULL,
    bloom_taxonomy VARCHAR(50),
    marks NUMERIC(5,2) NOT NULL,
    negative_marks NUMERIC(5,2) DEFAULT 0,
    tags TEXT[],
    ai_generated BOOLEAN DEFAULT FALSE,
    quality_score NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_qb_tenant ON question_bank(tenant_id);
CREATE INDEX IF NOT EXISTS idx_qb_subject ON question_bank(subject_id);

-- question_category
CREATE TABLE IF NOT EXISTS question_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- question_tag
CREATE TABLE IF NOT EXISTS question_tag (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- question_paper
CREATE TABLE IF NOT EXISTS question_paper (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID,
    subject_id UUID NOT NULL,
    total_marks NUMERIC(8,2) NOT NULL,
    duration_minutes INT NOT NULL,
    instructions TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- question_paper_version
CREATE TABLE IF NOT EXISTS question_paper_version (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    question_paper_id UUID NOT NULL,
    version_code VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- question_paper_section
CREATE TABLE IF NOT EXISTS question_paper_section (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    question_paper_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    marks_per_question NUMERIC(5,2) NOT NULL,
    negative_marks NUMERIC(5,2) DEFAULT 0,
    mandatory_questions_count INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- question_paper_question
CREATE TABLE IF NOT EXISTS question_paper_question (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    question_paper_id UUID NOT NULL,
    section_id UUID,
    question_id UUID NOT NULL,
    order_sequence INT NOT NULL,
    marks_override NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- cbt_exam
CREATE TABLE IF NOT EXISTS cbt_exam (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    question_paper_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    passing_marks NUMERIC(8,2) NOT NULL,
    strict_browser BOOLEAN DEFAULT FALSE,
    allow_resume BOOLEAN DEFAULT TRUE,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    show_results_immediately BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- cbt_session
CREATE TABLE IF NOT EXISTS cbt_session (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cbt_exam_id UUID NOT NULL,
    student_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(50),
    device_info TEXT,
    session_status VARCHAR(50) NOT NULL,
    auto_submitted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- cbt_attempt
CREATE TABLE IF NOT EXISTS cbt_attempt (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cbt_session_id UUID NOT NULL,
    question_id UUID NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    is_correct BOOLEAN,
    marks_obtained NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- cbt_response
CREATE TABLE IF NOT EXISTS cbt_response (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cbt_attempt_id UUID NOT NULL,
    selected_answer JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- cbt_bookmark
CREATE TABLE IF NOT EXISTS cbt_bookmark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cbt_session_id UUID NOT NULL,
    question_id UUID NOT NULL,
    note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- omr_sheet
CREATE TABLE IF NOT EXISTS omr_sheet (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    student_id UUID NOT NULL,
    scanned_image_url TEXT NOT NULL,
    processing_status VARCHAR(50) NOT NULL,
    error_details TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- omr_evaluation
CREATE TABLE IF NOT EXISTS omr_evaluation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    omr_sheet_id UUID NOT NULL,
    total_marks NUMERIC(8,2) NOT NULL,
    recognized_answers JSONB,
    confidence_score NUMERIC(5,2),
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- exam_hall
CREATE TABLE IF NOT EXISTS exam_hall (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    building_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- seating_plan
CREATE TABLE IF NOT EXISTS seating_plan (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    hall_id UUID NOT NULL,
    student_id UUID NOT NULL,
    seat_number VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- invigilator
CREATE TABLE IF NOT EXISTS invigilator (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    staff_id UUID NOT NULL,
    hall_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- candidate_attendance
CREATE TABLE IF NOT EXISTS candidate_attendance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    student_id UUID NOT NULL,
    hall_id UUID,
    is_present BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- exam_violation
CREATE TABLE IF NOT EXISTS exam_violation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    student_id UUID NOT NULL,
    violation_type VARCHAR(50) NOT NULL,
    description TEXT,
    reported_by UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- moderation_rule
CREATE TABLE IF NOT EXISTS moderation_rule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    condition TEXT NOT NULL,
    adjustment_formula TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- grace_mark
CREATE TABLE IF NOT EXISTS grace_mark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    marks_added NUMERIC(5,2) NOT NULL,
    reason TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- result_approval
CREATE TABLE IF NOT EXISTS result_approval (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    approved_by UUID NOT NULL,
    approval_date TIMESTAMP WITH TIME ZONE NOT NULL,
    comments TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- result_publication
CREATE TABLE IF NOT EXISTS result_publication (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- assessment_audit
CREATE TABLE IF NOT EXISTS assessment_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes JSONB,
    performed_by UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable Row Level Security (RLS)
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_question_bank ON question_bank;
CREATE POLICY tenant_isolation_question_bank ON question_bank FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE cbt_exam ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_cbt_exam ON cbt_exam;
CREATE POLICY tenant_isolation_cbt_exam ON cbt_exam FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE cbt_session ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_cbt_session ON cbt_session;
CREATE POLICY tenant_isolation_cbt_session ON cbt_session FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE question_paper ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_question_paper ON question_paper;
CREATE POLICY tenant_isolation_question_paper ON question_paper FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
