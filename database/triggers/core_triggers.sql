-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Base Database Triggers
-- TARGET SYSTEM: GEOS v12.0 Core

-- Template for registering triggers on a metadata table (example for system_version)
-- Every database entity table must run these four base security triggers:

-- 1. Metadata Validation
-- CREATE TRIGGER tr_sysver_metadata_default BEFORE INSERT OR UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();

-- 2. Timestamp and Version Incrementor
-- CREATE TRIGGER tr_sysver_timestamp_version BEFORE UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();

-- 3. Soft Delete Bounds Check
-- CREATE TRIGGER tr_sysver_soft_delete BEFORE INSERT OR UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();

-- 4. Audit Log Interception
-- CREATE TRIGGER tr_sysver_audit AFTER INSERT OR UPDATE OR DELETE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
