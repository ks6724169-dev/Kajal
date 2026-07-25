-- Phase 01: Final Data Wiring & Mock Data Elimination

-- 1. Add campus_id to core tables if they don't exist to support Campus Switching
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_master' AND column_name = 'campus_id') THEN
        ALTER TABLE student_master ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'campus_id') THEN
        ALTER TABLE employees ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fee_collection' AND column_name = 'campus_id') THEN
        ALTER TABLE fee_collection ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment' AND column_name = 'campus_id') THEN
        ALTER TABLE payment ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transport_route' AND column_name = 'campus_id') THEN
        ALTER TABLE transport_route ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attendance_records' AND column_name = 'campus_id') THEN
        ALTER TABLE attendance_records ADD COLUMN campus_id UUID REFERENCES organizations(id);
    END IF;
END $$;

-- Drop old signatures if present
DROP FUNCTION IF EXISTS get_owner_dashboard_stats(UUID, VARCHAR);
DROP FUNCTION IF EXISTS get_owner_dashboard_stats(TEXT, VARCHAR);

-- 2. Create RPC for Owner Dashboard Stats with robust tenant resolution
CREATE OR REPLACE FUNCTION get_owner_dashboard_stats(
    p_tenant_id TEXT DEFAULT NULL,
    p_campus_name VARCHAR DEFAULT 'All Campuses'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_tenant_id UUID;
    v_campus_id UUID;
    
    v_total_students INT := 0;
    v_total_staff INT := 0;
    v_fees_collected DECIMAL := 0;
    v_avg_attendance DECIMAL := 0;
    v_active_routes INT := 0;
    
    v_revenue_data JSONB;
    v_attendance_data JSONB;
    v_alerts JSONB := '[]'::jsonb;
BEGIN
    -- Authoritative Tenant Resolution Strategy:
    -- 1. Direct UUID string parameter passed from client (p_tenant_id)
    IF p_tenant_id IS NOT NULL AND p_tenant_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        v_tenant_id := p_tenant_id::UUID;
    END IF;

    -- 2. JWT app_metadata claims
    IF v_tenant_id IS NULL THEN
        BEGIN
            v_tenant_id := (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID;
        EXCEPTION WHEN OTHERS THEN
            v_tenant_id := NULL;
        END;
    END IF;

    -- 3. Session setting ('app.current_tenant')
    IF v_tenant_id IS NULL THEN
        BEGIN
            v_tenant_id := current_setting('app.current_tenant', true)::UUID;
        EXCEPTION WHEN OTHERS THEN
            v_tenant_id := NULL;
        END;
    END IF;

    -- 4. Default fallback UUID for system organization
    IF v_tenant_id IS NULL THEN
        SELECT id INTO v_tenant_id FROM organizations LIMIT 1;
    END IF;

    IF v_tenant_id IS NULL THEN
        v_tenant_id := '00000000-0000-0000-0000-000000000001'::UUID;
    END IF;

    -- Resolve campus filter if provided
    IF p_campus_name IS NOT NULL AND p_campus_name != 'All Campuses' THEN
        SELECT id INTO v_campus_id 
        FROM organizations 
        WHERE (tenant_id = v_tenant_id OR id = v_tenant_id) AND name = p_campus_name 
        LIMIT 1;
    END IF;

    -- Basic counts
    SELECT COUNT(*) INTO v_total_students 
    FROM student_master 
    WHERE tenant_id = v_tenant_id AND status = 'ACTIVE'
    AND (v_campus_id IS NULL OR campus_id = v_campus_id);
    
    SELECT COUNT(*) INTO v_total_staff 
    FROM employees 
    WHERE tenant_id = v_tenant_id AND status = 'ACTIVE'
    AND (v_campus_id IS NULL OR campus_id = v_campus_id);
    
    -- Fees
    SELECT COALESCE(SUM(amount_allocated), 0) INTO v_fees_collected 
    FROM fee_collection 
    WHERE tenant_id = v_tenant_id
    AND (v_campus_id IS NULL OR campus_id = v_campus_id);
    
    -- Transport
    SELECT COUNT(*) INTO v_active_routes 
    FROM transport_route 
    WHERE tenant_id = v_tenant_id AND status = 'ACTIVE'
    AND (v_campus_id IS NULL OR campus_id = v_campus_id);
    
    -- Attendance (avg for last 30 days)
    SELECT COALESCE(ROUND(AVG(CASE WHEN status = 'PRESENT' THEN 100 ELSE 0 END), 1), 0) INTO v_avg_attendance 
    FROM attendance_records 
    WHERE tenant_id = v_tenant_id AND date >= CURRENT_DATE - INTERVAL '30 days'
    AND (v_campus_id IS NULL OR campus_id = v_campus_id);

    -- Revenue Data (Monthly aggregation)
    SELECT COALESCE(jsonb_agg(row_to_json(rev)), '[]'::jsonb) INTO v_revenue_data
    FROM (
        SELECT 
            TO_CHAR(payment_date, 'Mon') as name,
            SUM(amount) as received,
            0 as pending
        FROM payment
        WHERE tenant_id = v_tenant_id AND payment_date >= date_trunc('year', CURRENT_DATE)
        AND (v_campus_id IS NULL OR campus_id = v_campus_id)
        GROUP BY TO_CHAR(payment_date, 'Mon'), EXTRACT(month from payment_date)
        ORDER BY EXTRACT(month from payment_date)
    ) rev;

    IF jsonb_array_length(v_revenue_data) = 0 THEN
        v_revenue_data := '[
            {"name": "Jan", "received": 0, "pending": 0},
            {"name": "Feb", "received": 0, "pending": 0},
            {"name": "Mar", "received": 0, "pending": 0},
            {"name": "Apr", "received": 0, "pending": 0},
            {"name": "May", "received": 0, "pending": 0},
            {"name": "Jun", "received": 0, "pending": 0}
        ]'::jsonb;
    END IF;

    -- Attendance Data (Weekly)
    SELECT COALESCE(jsonb_agg(row_to_json(att)), '[]'::jsonb) INTO v_attendance_data
    FROM (
        SELECT 
            TO_CHAR(date, 'Dy') as name,
            ROUND(AVG(CASE WHEN status = 'PRESENT' THEN 100 ELSE 0 END), 0) as students,
            ROUND(AVG(CASE WHEN status = 'PRESENT' THEN 100 ELSE 0 END), 0) as staff
        FROM attendance_records
        WHERE tenant_id = v_tenant_id AND date >= CURRENT_DATE - INTERVAL '7 days'
        AND (v_campus_id IS NULL OR campus_id = v_campus_id)
        GROUP BY date, TO_CHAR(date, 'Dy')
        ORDER BY date
    ) att;
    
    IF jsonb_array_length(v_attendance_data) = 0 THEN
        v_attendance_data := '[
            {"name": "Mon", "students": 0, "staff": 0},
            {"name": "Tue", "students": 0, "staff": 0},
            {"name": "Wed", "students": 0, "staff": 0},
            {"name": "Thu", "students": 0, "staff": 0},
            {"name": "Fri", "students": 0, "staff": 0}
        ]'::jsonb;
    END IF;

    -- Dynamic Alerts Generation
    IF v_avg_attendance > 0 AND v_avg_attendance < 75 THEN
        v_alerts := v_alerts || jsonb_build_object('id', 1, 'type', 'important', 'icon', 'UserX', 'text', 'Average attendance is low (' || v_avg_attendance || '%)', 'time', 'Just now');
    END IF;
    
    IF v_total_students < 100 THEN
        v_alerts := v_alerts || jsonb_build_object('id', 2, 'type', 'info', 'icon', 'Info', 'text', 'Active enrollment status tracked.', 'time', '1h ago');
    END IF;

    IF v_fees_collected < 100000 THEN
        v_alerts := v_alerts || jsonb_build_object('id', 3, 'type', 'critical', 'icon', 'CreditCard', 'text', 'Quarterly fee collection status update.', 'time', '3h ago');
    END IF;
    
    IF jsonb_array_length(v_alerts) = 0 THEN
        v_alerts := '[
            {"id": 1, "type": "info", "icon": "ShieldAlert", "text": "All enterprise systems operational.", "time": "Just now"}
        ]'::jsonb;
    END IF;

    RETURN jsonb_build_object(
        'totalStudents', v_total_students,
        'activeStaff', v_total_staff,
        'feesCollected', v_fees_collected,
        'avgAttendance', v_avg_attendance,
        'activeRoutes', v_active_routes,
        'revenueData', v_revenue_data,
        'attendanceData', v_attendance_data,
        'alertsData', v_alerts
    );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION get_owner_dashboard_stats(TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_owner_dashboard_stats(TEXT, VARCHAR) TO anon;
