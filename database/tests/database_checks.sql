-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Schema Verification Assertions
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Assertion test checking enabled extensions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN RAISE EXCEPTION 'FAIL: uuid-ossp extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN RAISE EXCEPTION 'FAIL: pgcrypto extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgvector') THEN RAISE EXCEPTION 'FAIL: pgvector extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN RAISE EXCEPTION 'FAIL: postgis extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN RAISE EXCEPTION 'FAIL: pg_trgm extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'unaccent') THEN RAISE EXCEPTION 'FAIL: unaccent extension is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'btree_gin') THEN RAISE EXCEPTION 'FAIL: btree_gin extension is missing.'; END IF;
  
  RAISE NOTICE 'SUCCESS: All 7 required PostgreSQL extensions are enabled.';
END;
$$;

-- 2. Assertion test checking foundational metadata tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_version') THEN RAISE EXCEPTION 'FAIL: system_version table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migration_history') THEN RAISE EXCEPTION 'FAIL: migration_history table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'environment') THEN RAISE EXCEPTION 'FAIL: environment table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'application_settings') THEN RAISE EXCEPTION 'FAIL: application_settings table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feature_flags') THEN RAISE EXCEPTION 'FAIL: feature_flags table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'locales') THEN RAISE EXCEPTION 'FAIL: locales table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'languages') THEN RAISE EXCEPTION 'FAIL: languages table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'countries') THEN RAISE EXCEPTION 'FAIL: countries table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'currencies') THEN RAISE EXCEPTION 'FAIL: currencies table is missing.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'timezones') THEN RAISE EXCEPTION 'FAIL: timezones table is missing.'; END IF;
  
  RAISE NOTICE 'SUCCESS: All 12 foundational metadata tables exist.';
END;
$$;
