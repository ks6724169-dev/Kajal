# DATABASE MIGRATION ROLLBACK
This directory contains safety rollback scripts for database migrations to help restore the previous schema state if needed.

## Rollback Guidelines
- Run safety rollbacks with care, as dropping tables can result in data loss.
- Backup all data before running schema rollbacks.
- Keep rollback scripts up-to-date with migration script schemas.
