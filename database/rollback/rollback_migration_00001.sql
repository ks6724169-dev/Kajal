-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Migration 00001 Rollback Script
-- TARGET SYSTEM: GEOS v12.0 Core
-- WARNING: DROPPING TABLES DESTROYS ALL ENCLOSED RECORDS. RUN WITH CAUTION.

-- 1. Drop Security Policies
DROP POLICY IF EXISTS policy_system_version_read ON public.system_version;
DROP POLICY IF EXISTS policy_migration_history_read ON public.migration_history;
DROP POLICY IF EXISTS policy_environment_read ON public.environment;
DROP POLICY IF EXISTS policy_application_settings_read ON public.application_settings;
DROP POLICY IF EXISTS policy_feature_flags_read ON public.feature_flags;
DROP POLICY IF EXISTS policy_locales_read ON public.locales;
DROP POLICY IF EXISTS policy_languages_read ON public.languages;
DROP POLICY IF EXISTS policy_countries_read ON public.countries;
DROP POLICY IF EXISTS policy_currencies_read ON public.currencies;
DROP POLICY IF EXISTS policy_timezones_read ON public.timezones;
DROP POLICY IF EXISTS policy_audit_configuration_read ON public.audit_configuration;
DROP POLICY IF EXISTS policy_security_configuration_read ON public.security_configuration;
DROP POLICY IF EXISTS policy_bucket_registry_read ON core_storage.bucket_registry;

-- 2. Drop Core Tables
DROP TABLE IF EXISTS core_backup.snapshot_registry CASCADE;
DROP TABLE IF EXISTS core_monitoring.db_error_logs CASCADE;
DROP TABLE IF EXISTS core_monitoring.db_health_metrics CASCADE;
DROP TABLE IF EXISTS core_storage.bucket_registry CASCADE;
DROP TABLE IF EXISTS public.security_configuration CASCADE;
DROP TABLE IF EXISTS public.audit_configuration CASCADE;
DROP TABLE IF EXISTS public.timezones CASCADE;
DROP TABLE IF EXISTS public.currencies CASCADE;
DROP TABLE IF EXISTS public.countries CASCADE;
DROP TABLE IF EXISTS public.languages CASCADE;
DROP TABLE IF EXISTS public.locales CASCADE;
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.application_settings CASCADE;
DROP TABLE IF EXISTS public.environment CASCADE;
DROP TABLE IF EXISTS public.migration_history CASCADE;
DROP TABLE IF EXISTS public.system_version CASCADE;
DROP TABLE IF EXISTS core_audit.audit_event_log CASCADE;

-- 3. Drop Core Schemas
DROP SCHEMA IF EXISTS core_backup CASCADE;
DROP SCHEMA IF EXISTS core_storage CASCADE;
DROP SCHEMA IF EXISTS core_monitoring CASCADE;
DROP SCHEMA IF EXISTS core_audit CASCADE;

-- 4. Drop Reusable Functions
DROP FUNCTION IF EXISTS public.fn_trigger_timestamp_and_version() CASCADE;
DROP FUNCTION IF EXISTS public.fn_trigger_soft_delete_validation() CASCADE;
DROP FUNCTION IF EXISTS public.fn_validate_jsonb_metadata() CASCADE;
DROP FUNCTION IF EXISTS public.fn_trigger_audit_logger() CASCADE;
