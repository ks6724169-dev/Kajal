const fs = require('fs');
let content = fs.readFileSync('supabase/migrations/020_owner_dashboard.sql', 'utf8');

const alertsLogic = `
    -- Alerts Logic
    DECLARE
        v_alerts JSONB := '[]'::jsonb;
    BEGIN
        IF v_avg_attendance < 75 THEN
            v_alerts := v_alerts || jsonb_build_object('id', 1, 'type', 'important', 'icon', 'UserX', 'text', 'Average attendance is critically low (' || v_avg_attendance || '%)', 'time', 'Just now');
        END IF;
        
        IF v_total_students < 100 THEN
            v_alerts := v_alerts || jsonb_build_object('id', 2, 'type', 'info', 'icon', 'Info', 'text', 'Student enrollment is low, run admission campaigns', 'time', '1h ago');
        END IF;

        IF v_fees_collected < 100000 THEN
            v_alerts := v_alerts || jsonb_build_object('id', 3, 'type', 'critical', 'icon', 'CreditCard', 'text', 'Fee collection is below quarterly target', 'time', '3h ago');
        END IF;
        
        IF jsonb_array_length(v_alerts) = 0 THEN
            v_alerts := '[
                {"id": 1, "type": "info", "icon": "ShieldAlert", "text": "All systems operational. No critical issues detected.", "time": "Just now"}
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
`;

// Replace from 'RETURN jsonb_build_object' to the end of the block
content = content.replace(/RETURN jsonb_build_object\([\s\S]*?\);[\s\S]*?END;/m, alertsLogic.trim());

fs.writeFileSync('supabase/migrations/020_owner_dashboard.sql', content);
