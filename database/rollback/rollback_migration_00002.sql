-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1B
-- DATABASE COMPONENT: Migration 00002 Rollback Script
-- TARGET SYSTEM: GEOS v12.0 Core

DROP POLICY IF EXISTS policy_tenant_isolation_org ON public.organization_registry;
DROP POLICY IF EXISTS policy_tenant_isolation_campus ON public.campus_registry;
DROP POLICY IF EXISTS policy_tenant_isolation_user ON public.universal_user;

DROP TABLE IF EXISTS public.security_events CASCADE;
DROP TABLE IF EXISTS public.trusted_devices CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.user_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permission_registry CASCADE;
DROP TABLE IF EXISTS public.role_registry CASCADE;
DROP TABLE IF EXISTS public.universal_user CASCADE;
DROP TABLE IF EXISTS public.academic_session_registry CASCADE;
DROP TABLE IF EXISTS public.campus_registry CASCADE;
DROP TABLE IF EXISTS public.organization_registry CASCADE;
DROP TABLE IF EXISTS public.tenant_registry CASCADE;
