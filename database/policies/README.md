# DATABASE SECURITY POLICIES (ROW LEVEL SECURITY)
This folder houses standard, security-approved Row Level Security (RLS) policies enforcing multi-tenant isolation, data privacy, and access boundaries.

## Security Controls
- **RLS Activation**: All schema tables must have RLS turned on using `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
- **Tenant Isolation**: Read/write access is restricted based on `tenant_id` and verified user profiles.
- **WORM Protection**: Logs are write-once, preventing updates or deletions on audit trails.
