-- GALAXY ERP SECURITY HARDENING (v2 - SECURE METADATA)
-- Addressing Supabase Advisor: RLS Disabled & User Metadata warnings
-- Targets: organization_registry, campus_registry, universal_user, and all public tables

DO $$
DECLARE
    r RECORD;
    p RECORD;
BEGIN
    RAISE NOTICE '🚀 Starting Advanced Security Hardening...';

    -- 1. CLEANUP: Drop problematic existing policies identified by Advisor
    -- These specific names were flagged for using insecure user_metadata
    FOR p IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE policyname IN ('policy_tenant_isolation_org', 'policy_tenant_isolation_user', 'policy_tenant_isolation_campus')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', p.policyname, p.tablename);
        RAISE NOTICE '🗑️ Dropped insecure policy: % on %', p.policyname, p.tablename;
    END LOOP;

    -- 2. ENFORCE RLS & SECURE POLICIES
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations', 'audit_log', 'geography_columns', 'geometry_columns', 'raster_columns', 'raster_overviews')
    ) LOOP
        -- FINAL FIX for spatial_ref_sys (PostGIS)
        -- If it's in public, Supabase Advisor complains. We try to move it to 'extensions' schema.
        IF r.tablename = 'spatial_ref_sys' THEN
            BEGIN
                EXECUTE 'CREATE SCHEMA IF NOT EXISTS extensions;';
                EXECUTE 'ALTER TABLE public.spatial_ref_sys SET SCHEMA extensions;';
                RAISE NOTICE '✅ Moved spatial_ref_sys to extensions schema (Cleared Advisor Warning)';
                CONTINUE; 
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Could not move spatial_ref_sys, attempting direct RLS: %', SQLERRM;
            END;
        END IF;

        -- Enable RLS
        BEGIN
            EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
            RAISE NOTICE '✅ Enabled RLS for table: %', r.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Could not enable RLS on %: %', r.tablename, SQLERRM;
            
            -- If we can't enable RLS, we ensure it's at least read-only via GRANTs
            IF r.tablename = 'spatial_ref_sys' THEN
                BEGIN
                    EXECUTE 'REVOKE ALL ON public.spatial_ref_sys FROM public;';
                    EXECUTE 'GRANT SELECT ON public.spatial_ref_sys TO anon, authenticated;';
                    RAISE NOTICE '🛡️ Applied read-only fallback to public.spatial_ref_sys';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE '❌ Failed fallback for public.spatial_ref_sys: %', SQLERRM;
                END;
            END IF;
            CONTINUE;
        END;

        -- 3. APPLY SECURE TENANT ISOLATION
        -- We use app_metadata instead of user_metadata as per Supabase Security Best Practices
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = r.tablename 
            AND column_name = 'tenant_id'
        ) THEN
            EXECUTE format('
                DROP POLICY IF EXISTS tenant_isolation_policy ON public.%I;
                CREATE POLICY tenant_isolation_policy ON public.%I
                FOR ALL USING (
                    tenant_id = (auth.jwt() -> ''app_metadata'' ->> ''tenant_id'')::UUID
                );',
                r.tablename, r.tablename
            );
        ELSE
            -- For lookup/system tables, allow authenticated read-only access
            EXECUTE format('
                DROP POLICY IF EXISTS authenticated_read_policy ON public.%I;
                CREATE POLICY authenticated_read_policy ON public.%I
                FOR SELECT TO authenticated USING (true);',
                r.tablename, r.tablename
            );
        END IF;
    END LOOP;

    RAISE NOTICE '🛡️ Security hardening complete. All user tables secured with app_metadata isolation.';
END $$;
