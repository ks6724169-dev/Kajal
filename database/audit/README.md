# SYSTEM WORM AUDITING SYSTEM
This directory manages immutable, secure Write-Once-Read-Many (WORM) audit transaction histories.

## Security Enforcements
- All table changes (inserts, updates, deletes) automatically trigger audit log captures.
- Logs are saved into `core_audit.audit_event_log`.
- No updates, modifications, or deletes are allowed on `core_audit.audit_event_log` rows to preserve chain of custody.
