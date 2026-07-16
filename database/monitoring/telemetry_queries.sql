-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Monitoring Telemetry Queries
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Query to track table storage sizes and record counts
CREATE OR REPLACE VIEW core_monitoring.v_table_storage_statistics AS
SELECT
  schemaname AS schema_name,
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_storage_size,
  pg_size_pretty(pg_relation_size(relid)) AS table_data_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS indexes_storage_size,
  n_live_tup AS estimated_live_tuples,
  n_dead_tup AS estimated_dead_tuples
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- 2. Function to log a database exception manually
CREATE OR REPLACE FUNCTION core_monitoring.fn_log_db_error(
  p_error_code VARCHAR(32),
  p_error_msg TEXT,
  p_stack_trace TEXT,
  p_severity VARCHAR(32) DEFAULT 'error',
  p_calling_function VARCHAR(256) DEFAULT NULL,
  p_actor_user_id UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO core_monitoring.db_error_logs (
    error_code,
    error_message,
    stack_trace,
    severity,
    calling_function,
    actor_user_id
  ) VALUES (
    p_error_code,
    p_error_msg,
    p_stack_trace,
    p_severity,
    p_calling_function,
    p_actor_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
