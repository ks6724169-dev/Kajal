-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Immutable Auditing Ledgers
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Helper query to fetch transaction logs for a specific record
CREATE OR REPLACE FUNCTION core_audit.fn_get_record_audit_trail(
  p_schema_name VARCHAR(128),
  p_table_name VARCHAR(128),
  p_record_id UUID
) RETURNS TABLE (
  event_id UUID,
  event_time TIMESTAMP WITH TIME ZONE,
  action_type VARCHAR(64),
  actor_id UUID,
  old_state JSONB,
  new_state JSONB,
  compliance_flagged BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id AS event_id,
    event_timestamp AS event_time,
    audit_event_log.action_type,
    actor_user_id AS actor_id,
    audit_event_log.old_state,
    audit_event_log.new_state,
    audit_event_log.compliance_flagged
  FROM core_audit.audit_event_log
  WHERE target_schema = p_schema_name 
    AND target_table = p_table_name 
    AND record_id = p_record_id
  ORDER BY event_timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
