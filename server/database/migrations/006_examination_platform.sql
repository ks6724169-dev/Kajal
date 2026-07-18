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
        DROP POLICY IF EXISTS tenant_isolation_exam_master ON examination_master; CREATE POLICY tenant_isolation_exam_master ON examination_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_session') THEN
        DROP POLICY IF EXISTS tenant_isolation_exam_session ON examination_session; CREATE POLICY tenant_isolation_exam_session ON examination_session FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_schedule') THEN
        DROP POLICY IF EXISTS tenant_isolation_exam_schedule ON examination_schedule; CREATE POLICY tenant_isolation_exam_schedule ON examination_schedule FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_exam_rooms') THEN
        DROP POLICY IF EXISTS tenant_isolation_exam_rooms ON examination_rooms; CREATE POLICY tenant_isolation_exam_rooms ON examination_rooms FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_invig_assign') THEN
        DROP POLICY IF EXISTS tenant_isolation_invig_assign ON invigilator_assignment; CREATE POLICY tenant_isolation_invig_assign ON invigilator_assignment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_sub_paper') THEN
        DROP POLICY IF EXISTS tenant_isolation_sub_paper ON subject_paper; CREATE POLICY tenant_isolation_sub_paper ON subject_paper FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_blueprint') THEN
        DROP POLICY IF EXISTS tenant_isolation_blueprint ON blueprint_master; CREATE POLICY tenant_isolation_blueprint ON blueprint_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_quest_paper') THEN
        DROP POLICY IF EXISTS tenant_isolation_quest_paper ON question_paper; CREATE POLICY tenant_isolation_quest_paper ON question_paper FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_quest_bank') THEN
        DROP POLICY IF EXISTS tenant_isolation_quest_bank ON question_bank; CREATE POLICY tenant_isolation_quest_bank ON question_bank FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_assign_master') THEN
        DROP POLICY IF EXISTS tenant_isolation_assign_master ON assignment_master; CREATE POLICY tenant_isolation_assign_master ON assignment_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_proj_assess') THEN
        DROP POLICY IF EXISTS tenant_isolation_proj_assess ON project_assessment; CREATE POLICY tenant_isolation_proj_assess ON project_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_int_assess') THEN
        DROP POLICY IF EXISTS tenant_isolation_int_assess ON internal_assessment; CREATE POLICY tenant_isolation_int_assess ON internal_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ext_assess') THEN
        DROP POLICY IF EXISTS tenant_isolation_ext_assess ON external_assessment; CREATE POLICY tenant_isolation_ext_assess ON external_assessment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_pract_exam') THEN
        DROP POLICY IF EXISTS tenant_isolation_pract_exam ON practical_exam; CREATE POLICY tenant_isolation_pract_exam ON practical_exam FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_viva_exam') THEN
        DROP POLICY IF EXISTS tenant_isolation_viva_exam ON viva_exam; CREATE POLICY tenant_isolation_viva_exam ON viva_exam FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_marks_entry') THEN
        DROP POLICY IF EXISTS tenant_isolation_marks_entry ON marks_entry; CREATE POLICY tenant_isolation_marks_entry ON marks_entry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_grade_book') THEN
        DROP POLICY IF EXISTS tenant_isolation_grade_book ON grade_book; CREATE POLICY tenant_isolation_grade_book ON grade_book FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_gpa') THEN
        DROP POLICY IF EXISTS tenant_isolation_gpa ON gpa_records; CREATE POLICY tenant_isolation_gpa ON gpa_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_cgpa') THEN
        DROP POLICY IF EXISTS tenant_isolation_cgpa ON cgpa_records; CREATE POLICY tenant_isolation_cgpa ON cgpa_records FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_result') THEN
        DROP POLICY IF EXISTS tenant_isolation_result ON result_master; CREATE POLICY tenant_isolation_result ON result_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_result_pub') THEN
        DROP POLICY IF EXISTS tenant_isolation_result_pub ON result_publication; CREATE POLICY tenant_isolation_result_pub ON result_publication FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_promotion') THEN
        DROP POLICY IF EXISTS tenant_isolation_promotion ON promotion_master; CREATE POLICY tenant_isolation_promotion ON promotion_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_remark') THEN
        DROP POLICY IF EXISTS tenant_isolation_remark ON academic_remark; CREATE POLICY tenant_isolation_remark ON academic_remark FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_perf') THEN
        DROP POLICY IF EXISTS tenant_isolation_perf ON performance_registry; CREATE POLICY tenant_isolation_perf ON performance_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_weak') THEN
        DROP POLICY IF EXISTS tenant_isolation_weak ON weak_student_registry; CREATE POLICY tenant_isolation_weak ON weak_student_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_gifted') THEN
        DROP POLICY IF EXISTS tenant_isolation_gifted ON gifted_student_registry; CREATE POLICY tenant_isolation_gifted ON gifted_student_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_rec') THEN
        DROP POLICY IF EXISTS tenant_isolation_rec ON academic_recommendation; CREATE POLICY tenant_isolation_rec ON academic_recommendation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
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
