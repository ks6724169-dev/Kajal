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
