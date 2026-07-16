# DATABASE CORE FUNCTIONS
This folder defines reusable PostgreSQL plpgsql functions used across the GEOS database environment.

## Key Functions
- `fn_trigger_timestamp_and_version()`: Updates timestamps and increments version on update.
- `fn_trigger_soft_delete_validation()`: Blocks direct rollbacks of soft-deleted records.
- `fn_validate_jsonb_metadata()`: Initializes jsonb metadata to protect queries from null errors.
- `fn_trigger_audit_logger()`: Automatically intercepts operations to populate audit events log.
