-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Backup Verification Procedures
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Register a newly completed snapshot file
CREATE OR REPLACE FUNCTION core_backup.fn_register_snapshot_backup(
  p_snapshot_name VARCHAR(256),
  p_size_bytes BIGINT,
  p_destination_url TEXT,
  p_checksum VARCHAR(128),
  p_compression VARCHAR(32) DEFAULT 'gzip'
) RETURNS UUID AS $$
DECLARE
  v_new_id UUID;
BEGIN
  INSERT INTO core_backup.snapshot_registry (
    snapshot_name,
    size_bytes,
    backup_destination_url,
    checksum_hash,
    compression_method,
    status
  ) VALUES (
    p_snapshot_name,
    p_size_bytes,
    p_destination_url,
    p_checksum,
    p_compression,
    'completed'
  ) RETURNING id INTO v_new_id;
  
  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
