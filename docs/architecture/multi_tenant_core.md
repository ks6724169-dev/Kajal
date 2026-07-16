# Multi-Tenant Core Architecture

## Overview
Galaxy ERP operates on a strictly partitioned Multi-Tenant database core. Data isolation is maintained structurally via Foreign Keys and functionally via Row Level Security (RLS).

## Hierarchical Structure
1. **Tenant (`tenant_registry`)**: The highest level. Represents an entire school district, chain of schools, or isolated corporate entity.
2. **Organization (`organization_registry`)**: A specific legal entity or trust operating under the tenant.
3. **Campus (`campus_registry`)**: Physical or virtual locations (e.g., "North Campus", "South Campus") under the organization.
4. **Universal User (`universal_user`)**: A globally unique identity per tenant. Cross-tenant access is STRICTLY disabled by design to prevent data bleeds.

## Row Level Security (RLS) Implementation
All read/write operations must provide a `tenant_id` context. 
The PostgreSQL policies enforce this at the database level:
```sql
CREATE POLICY policy_tenant_isolation ON public.universal_user 
FOR ALL USING (tenant_id::text = current_setting('request.jwt.claims', true)::json->'user_metadata'->>'tenant_id');
```
This ensures a buggy backend API can never leak data from Tenant A to Tenant B.

## Audit Strategy (WORM)
Every change to tenant configurations triggers `core_audit.audit_event_log` inserts.
Updates or Deletions on the audit log itself are universally DENIED by RLS.
