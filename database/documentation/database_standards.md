# GALAXY ERP DATABASE PRODUCTION STANDARDS
## Document Reference: GE-P03.1A-EDFIP-DOCS

---

## 1. Database Naming Standards

### 1.1 Table Names
- Must be written in lowercase with snake_case formatting (e.g. `system_version`, `audit_event_log`).
- Tables in the default public schema represent global configurations, master data, or lookup matrices.
- Subdomain isolation is achieved using schema prefixes where applicable (e.g., `core_audit.*`, `core_monitoring.*`, `core_storage.*`).

### 1.2 Column Names
- All columns must use lowercase snake_case formatting (e.g. `iso_alpha2`, `utc_offset_seconds`).
- Column abbreviations must remain consistent across the environment (e.g., use `id`, not `ID` or `uuid`; use `created_at` consistently).

### 1.3 Primary Keys
- Every table MUST implement a single `id` column of type `UUID` as its primary key.
- The default value must be generated using `public.uuid_generate_v4()`.

### 1.4 Audit Columns
- Every operational or configuration table must declare the following standardized audit tracking columns:
  - `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
  - `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
  - `deleted_at` TIMESTAMP WITH TIME ZONE NULL
  - `created_by` UUID NULL
  - `updated_by` UUID NULL
  - `tenant_id` UUID NULL
  - `organization_id` UUID NULL
  - `campus_id` UUID NULL
  - `version` INT DEFAULT 1 NOT NULL
  - `status` VARCHAR(50) DEFAULT 'active' NOT NULL
  - `metadata` JSONB DEFAULT '{}'::jsonb NOT NULL

### 1.5 Security Metadata
- Every configuration or metadata table must declare the following security parameters:
  - `encryption_metadata` JSONB DEFAULT '{}'::jsonb NOT NULL
  - `key_reference_fields` JSONB DEFAULT '{}'::jsonb NOT NULL
  - `pii_classification` JSONB DEFAULT '{}'::jsonb NOT NULL
  - `retention_metadata` JSONB DEFAULT '{}'::jsonb NOT NULL
  - `audit_metadata` JSONB DEFAULT '{}'::jsonb NOT NULL

---

## 2. PostgreSQL Extensions
The following seven extensions are registered by default on the cluster to support advanced enterprise operations:
1. `uuid-ossp`: High-performance UUIDv4 generators.
2. `pgcrypto`: In-database hashing and encryption algorithms.
3. `pgvector`: High-density semantic vectors for the AI command workspace.
4. `postgis`: Geographical, topological, and spatial calculations.
5. `pg_trgm`: Trigram indexes supporting fast text searches.
6. `unaccent`: Removes accents from string fields for uniform parsing.
7. `btree_gin`: B-Tree index support for generalized GIN operations.

---

## 3. Row Level Security (RLS) Rules
- RLS must be activated on every table.
- Default policies must allow reads for active records and restrict updates/deletes to authorized system accounts.
- Audit event tables must use Write-Once-Read-Many (WORM) configurations blocking edits and deletes under all circumstances.

---

## 4. Developer Migration Guide
1. Create a new SQL migration script inside `/database/migrations/` using chronological naming conventions (e.g. `00002_identity_and_auth_core.sql`).
2. Implement corresponding rollback scripts inside `/database/rollback/`.
3. Include standard triggers for timestamp syncing, version increments, and auditing on all tables created.
4. Run validation tests inside `/database/tests/database_checks.sql` to confirm successful compilation before submitting PRs.
