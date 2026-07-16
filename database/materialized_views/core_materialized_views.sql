-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Core Materialized Views
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Daily audit pre-aggregated summary
CREATE MATERIALIZED VIEW core_audit.mv_daily_audit_summary AS
SELECT 
  event_timestamp::date AS audit_date,
  target_schema,
  target_table,
  action_type,
  COUNT(*) AS transaction_count,
  COUNT(DISTINCT actor_user_id) AS active_actors_count
FROM core_audit.audit_event_log
GROUP BY event_timestamp::date, target_schema, target_table, action_type;

-- Unique index required to allow CONCURRENT refreshes
CREATE UNIQUE INDEX idx_mv_daily_audit_uid ON core_audit.mv_daily_audit_summary (audit_date, target_schema, target_table, action_type);

-- Refresh function
CREATE OR REPLACE FUNCTION core_audit.fn_refresh_audit_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY core_audit.mv_daily_audit_summary;
END;
$$ LANGUAGE plpgsql;
