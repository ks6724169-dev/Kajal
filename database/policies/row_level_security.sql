-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Row Level Security (RLS) Policies
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Enable RLS across core tables
ALTER TABLE public.system_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timezones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_storage.bucket_registry ENABLE ROW LEVEL SECURITY;

-- 2. Establish baseline read policies
DROP POLICY IF EXISTS policy_system_version_read ON public.system_version;
CREATE POLICY policy_system_version_read ON public.system_version FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_migration_history_read ON public.migration_history;
CREATE POLICY policy_migration_history_read ON public.migration_history FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS policy_environment_read ON public.environment;
CREATE POLICY policy_environment_read ON public.environment FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_application_settings_read ON public.application_settings;
CREATE POLICY policy_application_settings_read ON public.application_settings FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_feature_flags_read ON public.feature_flags;
CREATE POLICY policy_feature_flags_read ON public.feature_flags FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_locales_read ON public.locales;
CREATE POLICY policy_locales_read ON public.locales FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_languages_read ON public.languages;
CREATE POLICY policy_languages_read ON public.languages FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_countries_read ON public.countries;
CREATE POLICY policy_countries_read ON public.countries FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_currencies_read ON public.currencies;
CREATE POLICY policy_currencies_read ON public.currencies FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_timezones_read ON public.timezones;
CREATE POLICY policy_timezones_read ON public.timezones FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_audit_configuration_read ON public.audit_configuration;
CREATE POLICY policy_audit_configuration_read ON public.audit_configuration FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_security_configuration_read ON public.security_configuration;
CREATE POLICY policy_security_configuration_read ON public.security_configuration FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS policy_bucket_registry_read ON core_storage.bucket_registry;
CREATE POLICY policy_bucket_registry_read ON core_storage.bucket_registry FOR SELECT USING (status = 'active');

-- Write-Once-Read-Many (WORM) constraints on audit_event_log
ALTER TABLE core_audit.audit_event_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_audit_insert_only ON core_audit.audit_event_log;
CREATE POLICY policy_audit_insert_only ON core_audit.audit_event_log FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS policy_audit_select_restricted ON core_audit.audit_event_log;
CREATE POLICY policy_audit_select_restricted ON core_audit.audit_event_log FOR SELECT USING (
  -- Restricted to Super Admins and Audit Officers
  COALESCE((auth.jwt()->'user_metadata'->>'role')::text, 'anonymous') IN ('super_admin', 'audit_officer')
);

DROP POLICY IF EXISTS policy_audit_block_updates ON core_audit.audit_event_log;
CREATE POLICY policy_audit_block_updates ON core_audit.audit_event_log FOR UPDATE USING (FALSE);

DROP POLICY IF EXISTS policy_audit_block_deletes ON core_audit.audit_event_log;
CREATE POLICY policy_audit_block_deletes ON core_audit.audit_event_log FOR DELETE USING (FALSE);
