# DATABASE MATERIALIZED VIEWS
This folder houses PostgreSQL materialized views, which are physically cached query outputs designed to speed up read-heavy dashboards.

## Refreshes
- Materialized views require scheduled triggers or jobs to run `REFRESH MATERIALIZED VIEW ...` to update their data.
- **mv_daily_system_stats**: Caches daily database metrics for faster monitoring dashboards.
- **mv_audit_summary**: Pre-aggregates daily audit counts by table and action type.
