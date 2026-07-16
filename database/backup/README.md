# DATABASE BACKUP SNAPSHOTS REGISTRY
This folder holds procedures, verification matrices, and registration tables to manage database backups.

## Backup Verification
- Backups are registered inside `core_backup.snapshot_registry` upon completion.
- Integrity hashes (SHA-256) are calculated and matched during restoration checks.
- Verification audits are executed regularly to confirm that backups are readable and valid.
