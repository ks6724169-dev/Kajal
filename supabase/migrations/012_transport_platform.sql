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
