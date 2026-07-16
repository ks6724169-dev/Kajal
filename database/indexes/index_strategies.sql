-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Index Strategies
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Primary B-Tree Indexes on unique columns and lookup values
CREATE UNIQUE INDEX IF NOT EXISTS idx_sysver_semver_composite ON public.system_version (major, minor, patch);
CREATE INDEX IF NOT EXISTS idx_appset_key_lookup ON public.application_settings (setting_key);

-- 2. Foreign Key Indexes to optimize cascading triggers and relational joins
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_ref ON core_audit.audit_event_log (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_ref ON core_audit.audit_event_log (tenant_id);

-- 3. GIN (Generalized Inverted Index) on metadata blocks for schemaless telemetry queries
CREATE INDEX IF NOT EXISTS idx_sysver_metadata_gin ON public.system_version USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_appset_metadata_gin ON public.application_settings USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_featflags_rules_gin ON public.feature_flags USING gin (rules_payload);

-- 4. Trigram Text Indexes for natural language searches
CREATE INDEX IF NOT EXISTS idx_countries_name_trgm ON public.countries USING gin (country_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_languages_name_trgm ON public.languages USING gin (language_name gin_trgm_ops);
