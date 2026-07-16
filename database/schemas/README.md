# GALAXY ERP DATABASE SCHEMAS DEFINITIONS
This folder contains SQL blueprints for schemas, defining domain isolation scopes within the GEOS database.

## Isolated Domains Setup
- **public**: Default schemas housing public registries and global lookup matrices.
- **core_audit**: Houses write-once read-many auditing and security ledger lines.
- **core_monitoring**: Manages telemetry logs, database health indices, and system metrics.
- **core_storage**: Coordinates file attachment references, storage bounds, and bucket directories.
- **core_backup**: Registers backup footprints, snapshots, and recovery verifications.
