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
