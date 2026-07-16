-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Core Database Views
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Active decrypted application settings view
CREATE OR REPLACE VIEW public.v_active_system_settings AS
SELECT 
  id,
  setting_key,
  CASE 
    WHEN is_encrypted THEN '******* [ENCRYPTED]'
    ELSE setting_value 
  END AS display_value,
  description,
  category,
  tenant_id,
  version,
  created_at
FROM public.application_settings
WHERE status = 'active' AND deleted_at IS NULL;

-- 2. Audit exception and anomaly view
CREATE OR REPLACE VIEW core_audit.v_audit_compliance_alerts AS
SELECT 
  id,
  transaction_id,
  event_timestamp,
  actor_user_id,
  action_type,
  target_schema,
  target_table,
  record_id,
  compliance_flagged,
  metadata->>'risk_rating' AS risk_rating,
  metadata->>'reason' AS flag_reason
FROM core_audit.audit_event_log
WHERE compliance_flagged = TRUE OR (metadata->>'risk_rating')::text IN ('high', 'critical');
