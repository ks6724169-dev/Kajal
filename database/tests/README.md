# DATABASE SCHEMA VERIFICATION TESTS
This folder contains automated test assertions validating database structures, extensions registration, trigger functions, and row level security configurations.

## Test Strategy
- Checks if all 7 required PostgreSQL extensions are enabled.
- Asserts that all 12 global metadata tables exist.
- Validates that RLS is active on public registries.
- Verifies that soft delete triggers function correctly and block unauthorized un-deletes.
