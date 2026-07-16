-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE MIGRATION: 00001_initial_database_foundation.sql
-- TARGET SYSTEM: GEOS v12.0 Enterprise Core
-- CLASSIFICATION: Enterprise Secret (RESTRICTED)

-- ==========================================
-- 1. POSTGRESQL EXTENSIONS CONFIGURATION
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gin" WITH SCHEMA public;

-- ==========================================
-- 2. SCHEMA ISOLATION ARCHITECTURE
-- ==========================================
CREATE SCHEMA IF NOT EXISTS core_audit;
CREATE SCHEMA IF NOT EXISTS core_monitoring;
CREATE SCHEMA IF NOT EXISTS core_storage;
CREATE SCHEMA IF NOT EXISTS core_backup;

-- ==========================================
-- 3. REUSABLE PostgreSQL FUNCTIONS
-- ==========================================

-- Standardized updated_at and version-control trigger function
CREATE OR REPLACE FUNCTION public.fn_trigger_timestamp_and_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Standardized soft-delete validation trigger function
CREATE OR REPLACE FUNCTION public.fn_trigger_soft_delete_validation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    -- Block raw un-delete unless explicitly permitted via custom flag
    IF NOT COALESCE((NEW.metadata->>'allow_undelete')::boolean, false) THEN
      RAISE EXCEPTION 'Hard rollback of soft-deleted records is strictly prohibited without explicit clearance.';
    END IF;
  END IF;
  
  IF NEW.deleted_at IS NOT NULL THEN
    NEW.status = 'deleted';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Standardized metadata structure validation
CREATE OR REPLACE FUNCTION public.fn_validate_jsonb_metadata()
RETURNS TRIGGER AS $$
DECLARE
  new_json jsonb;
BEGIN
  -- Convert NEW record to jsonb
  new_json := to_jsonb(NEW);

  -- For each field, if it exists in the record, initialize to '{}' if null
  IF new_json ? 'metadata' AND (new_json->>'metadata' IS NULL OR new_json->>'metadata' = '') THEN
    new_json := jsonb_set(new_json, '{metadata}', '{}'::jsonb);
  END IF;
  
  IF new_json ? 'encryption_metadata' AND (new_json->>'encryption_metadata' IS NULL OR new_json->>'encryption_metadata' = '') THEN
    new_json := jsonb_set(new_json, '{encryption_metadata}', '{}'::jsonb);
  END IF;

  IF new_json ? 'key_reference_fields' AND (new_json->>'key_reference_fields' IS NULL OR new_json->>'key_reference_fields' = '') THEN
    new_json := jsonb_set(new_json, '{key_reference_fields}', '{}'::jsonb);
  END IF;

  IF new_json ? 'pii_classification' AND (new_json->>'pii_classification' IS NULL OR new_json->>'pii_classification' = '') THEN
    new_json := jsonb_set(new_json, '{pii_classification}', '{}'::jsonb);
  END IF;

  IF new_json ? 'retention_metadata' AND (new_json->>'retention_metadata' IS NULL OR new_json->>'retention_metadata' = '') THEN
    new_json := jsonb_set(new_json, '{retention_metadata}', '{}'::jsonb);
  END IF;

  IF new_json ? 'audit_metadata' AND (new_json->>'audit_metadata' IS NULL OR new_json->>'audit_metadata' = '') THEN
    new_json := jsonb_set(new_json, '{audit_metadata}', '{}'::jsonb);
  END IF;

  -- Populate the NEW record from the modified jsonb
  NEW := jsonb_populate_record(NEW, new_json);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 4. FOUNDATIONAL AUDIT LOGGING SCHEMA
-- ==========================================
CREATE TABLE core_audit.audit_event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID DEFAULT gen_random_uuid(),
  event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  actor_user_id UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  action_type VARCHAR(64) NOT NULL, -- INSERT, UPDATE, DELETE, ACCESS
  target_schema VARCHAR(128) NOT NULL,
  target_table VARCHAR(128) NOT NULL,
  record_id UUID NOT NULL,
  old_state JSONB,
  new_state JSONB,
  client_ip VARCHAR(45),
  user_agent VARCHAR(512),
  compliance_flagged BOOLEAN DEFAULT FALSE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Reusable auditing trigger function
CREATE OR REPLACE FUNCTION public.fn_trigger_audit_logger()
RETURNS TRIGGER AS $$
DECLARE
  old_r JSONB := NULL;
  new_r JSONB := NULL;
  t_id UUID := NULL;
  org_id UUID := NULL;
  cam_id UUID := NULL;
  u_id UUID := NULL;
  rec_id UUID := NULL;
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    old_r := to_jsonb(OLD);
    new_r := to_jsonb(NEW);
    t_id := (new_r->>'tenant_id')::uuid;
    org_id := (new_r->>'organization_id')::uuid;
    cam_id := (new_r->>'campus_id')::uuid;
    u_id := (new_r->>'updated_by')::uuid;
    rec_id := (new_r->>'id')::uuid;
  ELSIF (TG_OP = 'INSERT') THEN
    new_r := to_jsonb(NEW);
    t_id := (new_r->>'tenant_id')::uuid;
    org_id := (new_r->>'organization_id')::uuid;
    cam_id := (new_r->>'campus_id')::uuid;
    u_id := (new_r->>'created_by')::uuid;
    rec_id := (new_r->>'id')::uuid;
  ELSIF (TG_OP = 'DELETE') THEN
    old_r := to_jsonb(OLD);
    t_id := (old_r->>'tenant_id')::uuid;
    org_id := (old_r->>'organization_id')::uuid;
    cam_id := (old_r->>'campus_id')::uuid;
    u_id := COALESCE((old_r->>'updated_by')::uuid, (old_r->>'deleted_by')::uuid);
    rec_id := (old_r->>'id')::uuid;
  END IF;

  INSERT INTO core_audit.audit_event_log (
    action_type,
    target_schema,
    target_table,
    record_id,
    old_state,
    new_state,
    tenant_id,
    organization_id,
    campus_id,
    actor_user_id
  ) VALUES (
    TG_OP,
    TG_TABLE_SCHEMA,
    TG_TABLE_NAME,
    COALESCE(rec_id, (old_r->>'id')::uuid, (new_r->>'id')::uuid),
    old_r,
    new_r,
    t_id,
    org_id,
    cam_id,
    u_id
  );
  
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 5. FOUNDATIONAL GLOBAL METADATA TABLES
-- ==========================================

-- 5.1 System Version
CREATE TABLE public.system_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  major INT NOT NULL,
  minor INT NOT NULL,
  patch INT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  description TEXT,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  CONSTRAINT system_version_semver UNIQUE (major, minor, patch)
);

-- 5.2 Migration History
CREATE TABLE public.migration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name VARCHAR(256) UNIQUE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  duration_ms INT NOT NULL,
  status VARCHAR(64) DEFAULT 'completed' NOT NULL,
  error_message TEXT,
  checksum_hash VARCHAR(128) NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.3 Environment Configuration
CREATE TABLE public.environment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  env_name VARCHAR(64) UNIQUE NOT NULL,
  provider VARCHAR(128) NOT NULL,
  is_production BOOLEAN DEFAULT FALSE NOT NULL,
  current_region VARCHAR(64) NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.4 Application Settings
CREATE TABLE public.application_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(128) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE NOT NULL,
  category VARCHAR(128) DEFAULT 'general' NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.5 Feature Flags
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name VARCHAR(128) UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT FALSE NOT NULL,
  description TEXT,
  rollout_percentage INT DEFAULT 100 NOT NULL,
  rules_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.6 Locales
CREATE TABLE public.locales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_code VARCHAR(32) UNIQUE NOT NULL,
  locale_name VARCHAR(128) NOT NULL,
  native_name VARCHAR(128),
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.7 Languages
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_iso VARCHAR(16) UNIQUE NOT NULL,
  language_name VARCHAR(128) NOT NULL,
  native_name VARCHAR(128),
  text_direction VARCHAR(8) DEFAULT 'ltr' NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.8 Countries
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iso_alpha2 VARCHAR(2) UNIQUE NOT NULL,
  iso_alpha3 VARCHAR(3) UNIQUE NOT NULL,
  numeric_code VARCHAR(8) UNIQUE NOT NULL,
  country_name VARCHAR(128) NOT NULL,
  official_name VARCHAR(256),
  capital_city VARCHAR(128),
  top_level_domain VARCHAR(16),
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.9 Currencies
CREATE TABLE public.currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code VARCHAR(3) UNIQUE NOT NULL,
  currency_name VARCHAR(128) NOT NULL,
  currency_symbol VARCHAR(16) NOT NULL,
  decimal_digits INT DEFAULT 2 NOT NULL,
  usd_exchange_rate NUMERIC(18, 6) DEFAULT 1.000000 NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.10 Timezones
CREATE TABLE public.timezones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timezone_name VARCHAR(128) UNIQUE NOT NULL,
  utc_offset_seconds INT NOT NULL,
  is_dst BOOLEAN DEFAULT FALSE NOT NULL,
  abbreviation VARCHAR(16) NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.11 Audit Configurations
CREATE TABLE public.audit_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table_name VARCHAR(128) UNIQUE NOT NULL,
  logging_active BOOLEAN DEFAULT TRUE NOT NULL,
  retention_days_limit INT DEFAULT 90 NOT NULL,
  audit_log_level VARCHAR(64) DEFAULT 'full' NOT NULL,
  excluded_fields_payload JSONB DEFAULT '[]'::jsonb NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 5.12 Security Parameters Configuration
CREATE TABLE public.security_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_name VARCHAR(128) UNIQUE NOT NULL,
  parameter_val TEXT NOT NULL,
  threat_risk_level VARCHAR(64) DEFAULT 'medium' NOT NULL,
  requires_strong_encryption BOOLEAN DEFAULT TRUE NOT NULL,
  classification_label VARCHAR(64) DEFAULT 'confidential' NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  version INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- ==========================================
-- 6. DYNAMIC INDEX ARRAYS FOR HIGH SPEED READS
-- ==========================================

-- System Version Indexing
CREATE INDEX idx_sysver_semver ON public.system_version (major, minor, patch);

-- Migration Indexing
CREATE INDEX idx_mighis_name ON public.migration_history (migration_name);

-- Application Settings
CREATE INDEX idx_appset_key ON public.application_settings (setting_key);

-- Feature Flags GIN on Rules payload
CREATE INDEX idx_featflag_name ON public.feature_flags (flag_name);
CREATE INDEX idx_featflag_rules_gin ON public.feature_flags USING gin (rules_payload);

-- Locale / Lang / Country Indices
CREATE INDEX idx_locale_code ON public.locales (locale_code);
CREATE INDEX idx_lang_iso ON public.languages (language_iso);
CREATE INDEX idx_country_iso2_iso3 ON public.countries (iso_alpha2, iso_alpha3);
CREATE INDEX idx_curr_code ON public.currencies (currency_code);
CREATE INDEX idx_timezone_name ON public.timezones (timezone_name);

-- Common GIN Indices on metadata to support schemaless telemetry queries
CREATE INDEX idx_sysver_meta_gin ON public.system_version USING gin (metadata);
CREATE INDEX idx_mighis_meta_gin ON public.migration_history USING gin (metadata);
CREATE INDEX idx_appset_meta_gin ON public.application_settings USING gin (metadata);
CREATE INDEX idx_featflag_meta_gin ON public.feature_flags USING gin (metadata);

-- Common Tenant Isolation indices
CREATE INDEX idx_sysver_tenant ON public.system_version (tenant_id);
CREATE INDEX idx_mighis_tenant ON public.migration_history (tenant_id);
CREATE INDEX idx_env_tenant ON public.environment (tenant_id);
CREATE INDEX idx_appset_tenant ON public.application_settings (tenant_id);
CREATE INDEX idx_featflag_tenant ON public.feature_flags (tenant_id);
CREATE INDEX idx_locales_tenant ON public.locales (tenant_id);
CREATE INDEX idx_languages_tenant ON public.languages (tenant_id);
CREATE INDEX idx_countries_tenant ON public.countries (tenant_id);
CREATE INDEX idx_currencies_tenant ON public.currencies (tenant_id);
CREATE INDEX idx_timezones_tenant ON public.timezones (tenant_id);
CREATE INDEX idx_auditcfg_tenant ON public.audit_configuration (tenant_id);
CREATE INDEX idx_seccfg_tenant ON public.security_configuration (tenant_id);

-- ==========================================
-- 7. ATTACH REUSABLE TRIGGERS TO ALL TABLES
-- ==========================================

-- List of standard metadata tables for triggering metadata default payloads, version logs, and auditing
-- Table: system_version
CREATE TRIGGER tr_sysver_metadata_default BEFORE INSERT OR UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_sysver_timestamp_version BEFORE UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_sysver_soft_delete BEFORE INSERT OR UPDATE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_sysver_audit AFTER INSERT OR UPDATE OR DELETE ON public.system_version FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: migration_history
CREATE TRIGGER tr_mighis_metadata_default BEFORE INSERT OR UPDATE ON public.migration_history FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_mighis_timestamp_version BEFORE UPDATE ON public.migration_history FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_mighis_soft_delete BEFORE INSERT OR UPDATE ON public.migration_history FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_mighis_audit AFTER INSERT OR UPDATE OR DELETE ON public.migration_history FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: environment
CREATE TRIGGER tr_env_metadata_default BEFORE INSERT OR UPDATE ON public.environment FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_env_timestamp_version BEFORE UPDATE ON public.environment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_env_soft_delete BEFORE INSERT OR UPDATE ON public.environment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_env_audit AFTER INSERT OR UPDATE OR DELETE ON public.environment FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: application_settings
CREATE TRIGGER tr_appset_metadata_default BEFORE INSERT OR UPDATE ON public.application_settings FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_appset_timestamp_version BEFORE UPDATE ON public.application_settings FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_appset_soft_delete BEFORE INSERT OR UPDATE ON public.application_settings FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_appset_audit AFTER INSERT OR UPDATE OR DELETE ON public.application_settings FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: feature_flags
CREATE TRIGGER tr_featflag_metadata_default BEFORE INSERT OR UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_featflag_timestamp_version BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_featflag_soft_delete BEFORE INSERT OR UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_featflag_audit AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: locales
CREATE TRIGGER tr_locales_metadata_default BEFORE INSERT OR UPDATE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_locales_timestamp_version BEFORE UPDATE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_locales_soft_delete BEFORE INSERT OR UPDATE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_locales_audit AFTER INSERT OR UPDATE OR DELETE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: languages
CREATE TRIGGER tr_languages_metadata_default BEFORE INSERT OR UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_languages_timestamp_version BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_languages_soft_delete BEFORE INSERT OR UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_languages_audit AFTER INSERT OR UPDATE OR DELETE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: countries
CREATE TRIGGER tr_countries_metadata_default BEFORE INSERT OR UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_countries_timestamp_version BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_countries_soft_delete BEFORE INSERT OR UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_countries_audit AFTER INSERT OR UPDATE OR DELETE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: currencies
CREATE TRIGGER tr_currencies_metadata_default BEFORE INSERT OR UPDATE ON public.currencies FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_currencies_timestamp_version BEFORE UPDATE ON public.currencies FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_currencies_soft_delete BEFORE INSERT OR UPDATE ON public.currencies FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_currencies_audit AFTER INSERT OR UPDATE OR DELETE ON public.currencies FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: timezones
CREATE TRIGGER tr_timezones_metadata_default BEFORE INSERT OR UPDATE ON public.timezones FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_timezones_timestamp_version BEFORE UPDATE ON public.timezones FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_timezones_soft_delete BEFORE INSERT OR UPDATE ON public.timezones FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_timezones_audit AFTER INSERT OR UPDATE OR DELETE ON public.timezones FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: audit_configuration
CREATE TRIGGER tr_auditcfg_metadata_default BEFORE INSERT OR UPDATE ON public.audit_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_auditcfg_timestamp_version BEFORE UPDATE ON public.audit_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_auditcfg_soft_delete BEFORE INSERT OR UPDATE ON public.audit_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_auditcfg_audit AFTER INSERT OR UPDATE OR DELETE ON public.audit_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- Table: security_configuration
CREATE TRIGGER tr_seccfg_metadata_default BEFORE INSERT OR UPDATE ON public.security_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_seccfg_timestamp_version BEFORE UPDATE ON public.security_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_seccfg_soft_delete BEFORE INSERT OR UPDATE ON public.security_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_seccfg_audit AFTER INSERT OR UPDATE OR DELETE ON public.security_configuration FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- ==========================================
-- 8. STORAGE FOUNDATION REGISTRY (SUPABASE SIMULATED)
-- ==========================================
CREATE TABLE core_storage.bucket_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name VARCHAR(256) UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  allowed_file_extensions VARCHAR(32)[] DEFAULT ARRAY['pdf','docx','png','jpg','xlsx','zip']::VARCHAR(32)[] NOT NULL,
  max_file_size_bytes BIGINT DEFAULT 10485760 NOT NULL, -- Default 10MB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  tenant_id UUID,
  organization_id UUID,
  campus_id UUID,
  version INT DEFAULT 1 NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Register Core Buckets
INSERT INTO core_storage.bucket_registry (bucket_name, is_public, allowed_file_extensions, max_file_size_bytes)
VALUES 
  ('documents', FALSE, ARRAY['pdf','docx','txt']::VARCHAR(32)[], 20971520),
  ('images', TRUE, ARRAY['png','jpg','jpeg','webp','svg']::VARCHAR(32)[], 5242880),
  ('media', TRUE, ARRAY['mp4','mp3','wav']::VARCHAR(32)[], 104857600),
  ('reports', FALSE, ARRAY['pdf','xlsx','csv']::VARCHAR(32)[], 20971520),
  ('backups', FALSE, ARRAY['sql','zip','tar.gz']::VARCHAR(32)[], 5368709120),
  ('ai-files', FALSE, ARRAY['json','jsonb','pt','h5','csv','txt']::VARCHAR(32)[], 104857600),
  ('temporary-files', FALSE, ARRAY['tmp','download','pdf','xlsx','png']::VARCHAR(32)[], 52428800),
  ('archives', FALSE, ARRAY['zip','7z','tar.gz']::VARCHAR(32)[], 1073741824);

-- Trigger triggers on core_storage.bucket_registry
CREATE TRIGGER tr_bucket_metadata_default BEFORE INSERT OR UPDATE ON core_storage.bucket_registry FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_bucket_timestamp_version BEFORE UPDATE ON core_storage.bucket_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_bucket_soft_delete BEFORE INSERT OR UPDATE ON core_storage.bucket_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_soft_delete_validation();
CREATE TRIGGER tr_bucket_audit AFTER INSERT OR UPDATE OR DELETE ON core_storage.bucket_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- ==========================================
-- 9. MONITORING FOUNDATION SCHEMA
-- ==========================================
CREATE TABLE core_monitoring.db_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  cpu_usage_pct NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
  memory_usage_pct NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
  disk_usage_pct NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
  active_connections_count INT DEFAULT 0 NOT NULL,
  transaction_latency_ms INT DEFAULT 0 NOT NULL,
  cache_hit_ratio NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
  errors_logged_count INT DEFAULT 0 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

CREATE TABLE core_monitoring.db_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  error_code VARCHAR(32) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  severity VARCHAR(32) DEFAULT 'error' NOT NULL, -- warning, error, critical
  calling_function VARCHAR(256),
  calling_query TEXT,
  actor_user_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- ==========================================
-- 10. BACKUP & SNAPSHOT REGISTRY
-- ==========================================
CREATE TABLE core_backup.snapshot_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_name VARCHAR(256) NOT NULL,
  snapshot_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  size_bytes BIGINT NOT NULL,
  backup_destination_url TEXT NOT NULL,
  compression_method VARCHAR(32) DEFAULT 'gzip' NOT NULL,
  status VARCHAR(64) DEFAULT 'verified' NOT NULL, -- completed, running, failed, verified
  checksum_hash VARCHAR(128) NOT NULL,
  restorable BOOLEAN DEFAULT TRUE NOT NULL,
  verified_by_user_id UUID,
  verification_date TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- ==========================================
-- 11. BASE SECURITY POLICIES (RLS CORES)
-- ==========================================

-- Enable Row Level Security (RLS) across all core metadata tables
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

-- Establish baseline policies
CREATE POLICY policy_system_version_read ON public.system_version FOR SELECT USING (status = 'active');
CREATE POLICY policy_migration_history_read ON public.migration_history FOR SELECT USING (TRUE);
CREATE POLICY policy_environment_read ON public.environment FOR SELECT USING (status = 'active');
CREATE POLICY policy_application_settings_read ON public.application_settings FOR SELECT USING (status = 'active');
CREATE POLICY policy_feature_flags_read ON public.feature_flags FOR SELECT USING (status = 'active');
CREATE POLICY policy_locales_read ON public.locales FOR SELECT USING (status = 'active');
CREATE POLICY policy_languages_read ON public.languages FOR SELECT USING (status = 'active');
CREATE POLICY policy_countries_read ON public.countries FOR SELECT USING (status = 'active');
CREATE POLICY policy_currencies_read ON public.currencies FOR SELECT USING (status = 'active');
CREATE POLICY policy_timezones_read ON public.timezones FOR SELECT USING (status = 'active');
CREATE POLICY policy_audit_configuration_read ON public.audit_configuration FOR SELECT USING (status = 'active');
CREATE POLICY policy_security_configuration_read ON public.security_configuration FOR SELECT USING (status = 'active');
CREATE POLICY policy_bucket_registry_read ON core_storage.bucket_registry FOR SELECT USING (status = 'active');
