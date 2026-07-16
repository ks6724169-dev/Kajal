-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Schema Definitions
-- TARGET SYSTEM: GEOS v12.0 Core

-- Schema boundaries segregation
CREATE SCHEMA IF NOT EXISTS core_audit;
CREATE SCHEMA IF NOT EXISTS core_monitoring;
CREATE SCHEMA IF NOT EXISTS core_storage;
CREATE SCHEMA IF NOT EXISTS core_backup;

COMMENT ON SCHEMA public IS 'Enterprise core general schema containing metadata registries and global lookups.';
COMMENT ON SCHEMA core_audit IS 'Immutable auditing repository for logging transaction histories and system alterations.';
COMMENT ON SCHEMA core_monitoring IS 'Telemetry monitoring schema storing CPU logs, query latencies, and error codes.';
COMMENT ON SCHEMA core_storage IS 'Storage registry schema tracking file attachments and dynamic asset bounds.';
COMMENT ON SCHEMA core_backup IS 'System backup snapshots registry tracking database state footprints and checksums.';
