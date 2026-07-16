-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Core Database Functions
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Standardized updated_at and version-control trigger function
CREATE OR REPLACE FUNCTION public.fn_trigger_timestamp_and_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Standardized soft-delete validation trigger function
CREATE OR REPLACE FUNCTION public.fn_trigger_soft_delete_validation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
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

-- 3. Standardized metadata structure validation
CREATE OR REPLACE FUNCTION public.fn_validate_jsonb_metadata()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.metadata IS NULL THEN
    NEW.metadata = '{}'::jsonb;
  END IF;
  IF NEW.encryption_metadata IS NULL THEN
    NEW.encryption_metadata = '{}'::jsonb;
  END IF;
  IF NEW.key_reference_fields IS NULL THEN
    NEW.key_reference_fields = '{}'::jsonb;
  END IF;
  IF NEW.pii_classification IS NULL THEN
    NEW.pii_classification = '{}'::jsonb;
  END IF;
  IF NEW.retention_metadata IS NULL THEN
    NEW.retention_metadata = '{}'::jsonb;
  END IF;
  IF NEW.audit_metadata IS NULL THEN
    NEW.audit_metadata = '{}'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
