# DATABASE CORE TRIGGERS
This directory catalogs triggers configured on core tables to enforce data integrity, version audits, and system workflows automatically.

## Core Operations Enforced
- **JSONB default normalization**: Validates and normalizes JSONB keys before insert/update.
- **Timestamp & Version Upgrades**: Automatically sets `updated_at` and increments `version` on change.
- **Soft Delete Compliance**: Blocks raw state changes for deleted objects.
- **Audit Logging**: Pushes historical rows into `core_audit.audit_event_log` upon INSERT, UPDATE, or DELETE.
