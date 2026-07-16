# DATABASE VIEWS DEFINITIONS
This directory houses non-materialized PostgreSQL views, which are queries optimized for operations, reporting, and monitoring dashboards.

## Core Views
- **v_active_system_settings**: Filters only active, decrypted system configuration variables.
- **v_audit_alerts**: Aggregates flagged audit logs for security team reviews.
- **v_tenant_summary**: Summarizes status metrics for multi-tenant environments.
