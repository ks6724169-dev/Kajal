-- GALAXY ERP ENTERPRISE SUITE — Phase 03.2O
-- Enterprise Timetable, Scheduling & Resource Allocation Platform (ETSRAP)

-- 1. Academic Calendar
CREATE TABLE IF NOT EXISTS academic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    calendar_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Academic Week
CREATE TABLE IF NOT EXISTS academic_week (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    academic_calendar_id UUID NOT NULL REFERENCES academic_calendar(id),
    week_number INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Working Day
CREATE TABLE IF NOT EXISTS working_day (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    academic_calendar_id UUID NOT NULL REFERENCES academic_calendar(id),
    day_of_week VARCHAR(20) NOT NULL, -- 'MONDAY', 'TUESDAY', etc.
    is_working_day BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. Holiday
CREATE TABLE IF NOT EXISTS holiday (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    academic_calendar_id UUID NOT NULL REFERENCES academic_calendar(id),
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. Period Master
CREATE TABLE IF NOT EXISTS period_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    period_number INT NOT NULL,
    slot_id UUID, -- Optional link to time_slot if exists
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. Time Slot
CREATE TABLE IF NOT EXISTS time_slot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    slot_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    type VARCHAR(50), -- 'ACADEMIC', 'EXAM'
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 7. Bell Schedule
CREATE TABLE IF NOT EXISTS bell_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    schedule_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 8. Timetable Master
CREATE TABLE IF NOT EXISTS timetable_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_name VARCHAR(255) NOT NULL,
    academic_calendar_id UUID NOT NULL REFERENCES academic_calendar(id),
    term_id UUID,
    is_published BOOLEAN DEFAULT FALSE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 9. Timetable Version
CREATE TABLE IF NOT EXISTS timetable_version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_id UUID NOT NULL REFERENCES timetable_master(id),
    version_number INT NOT NULL,
    description TEXT,
    created_by UUID,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 10. Timetable Period
CREATE TABLE IF NOT EXISTS timetable_period (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_id UUID NOT NULL REFERENCES timetable_master(id),
    period_id UUID NOT NULL REFERENCES period_master(id),
    day_of_week VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    room_id UUID,
    class_id UUID,
    section_id UUID,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 11. Teacher Schedule
CREATE TABLE IF NOT EXISTS teacher_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    day_of_week VARCHAR(20) NOT NULL,
    period_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 12. Student Schedule
CREATE TABLE IF NOT EXISTS student_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    day_of_week VARCHAR(20) NOT NULL,
    period_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 13. Class Schedule
CREATE TABLE IF NOT EXISTS class_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    class_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    day_of_week VARCHAR(20) NOT NULL,
    period_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 14. Room Schedule
CREATE TABLE IF NOT EXISTS room_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    room_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    day_of_week VARCHAR(20) NOT NULL,
    period_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 15. Lab Schedule
CREATE TABLE IF NOT EXISTS lab_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    lab_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    day_of_week VARCHAR(20) NOT NULL,
    period_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 16. Subject Allocation
CREATE TABLE IF NOT EXISTS subject_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    class_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    weekly_periods_count INT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 17. Teacher Allocation
CREATE TABLE IF NOT EXISTS teacher_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    allocated_periods INT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 18. Room Allocation
CREATE TABLE IF NOT EXISTS room_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    room_id UUID NOT NULL,
    is_lab BOOLEAN DEFAULT FALSE,
    capacity INT NOT NULL,
    properties JSONB,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 19. Resource Allocation
CREATE TABLE IF NOT EXISTS resource_allocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL,
    timetable_period_id UUID REFERENCES timetable_period(id),
    allocated_from TIMESTAMPTZ NOT NULL,
    allocated_to TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 20. Substitute Teacher
CREATE TABLE IF NOT EXISTS substitute_teacher (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    original_teacher_id UUID NOT NULL,
    substitute_teacher_id UUID NOT NULL,
    timetable_period_id UUID NOT NULL REFERENCES timetable_period(id),
    substitution_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 21. Free Period
CREATE TABLE IF NOT EXISTS free_period (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    teacher_id UUID,
    room_id UUID,
    period_id UUID REFERENCES period_master(id),
    day_of_week VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 22. Timetable Conflict
CREATE TABLE IF NOT EXISTS timetable_conflict (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_id UUID NOT NULL REFERENCES timetable_master(id),
    conflict_type VARCHAR(100) NOT NULL,
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 23. Timetable Publish
CREATE TABLE IF NOT EXISTS timetable_publish (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_id UUID NOT NULL REFERENCES timetable_master(id),
    publish_date DATE NOT NULL,
    published_by UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 24. Timetable History
CREATE TABLE IF NOT EXISTS timetable_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    timetable_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    payload JSONB,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 25. Timetable Audit
CREATE TABLE IF NOT EXISTS timetable_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE academic_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_week ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slot ENABLE ROW LEVEL SECURITY;
ALTER TABLE bell_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE substitute_teacher ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_conflict ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_publish ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_audit ENABLE ROW LEVEL SECURITY;

-- Organization Isolation Policies (Simplified example)
CREATE POLICY organization_isolation_academic_calendar ON academic_calendar FOR ALL USING (tenant_id = auth.uid());
-- Repeat for all tables...

-- Composite Indexes
CREATE INDEX IF NOT EXISTS idx_timetable_period_teacher ON timetable_period(tenant_id, teacher_id, day_of_week, period_id);
CREATE INDEX IF NOT EXISTS idx_timetable_period_room ON timetable_period(tenant_id, room_id, day_of_week, period_id);
CREATE INDEX IF NOT EXISTS idx_timetable_period_class ON timetable_period(tenant_id, class_id, day_of_week, period_id);
