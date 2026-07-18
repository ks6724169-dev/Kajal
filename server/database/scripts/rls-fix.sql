-- STRICT RLS FIX TEMPLATE
-- Purpose: Force Enable Row Level Security on ALL tables in the public schema
-- Target: Eliminate RLS Advisor Warnings and Ensure Data Isolation

DO $$
DECLARE
    r RECORD;
    tenant_policy_count INT := 0;
BEGIN
    RAISE NOTICE '🚀 Starting Strict RLS Enforcement...';

    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations', 'audit_log') -- Skip system tables if necessary
    ) LOOP
        -- 1. Enable RLS
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
        RAISE NOTICE '✅ Enabled RLS for table: %', r.tablename;
        
        -- 2. Create Tenant Isolation Policy (FOR ALL)
        -- This policy ensures that a user can only access records matching their tenant_id
        EXECUTE '
            DO $policy$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = ' || quote_literal(r.tablename) || ' AND policyname = ''tenant_isolation_policy'') THEN
                    CREATE POLICY tenant_isolation_policy ON public.' || quote_ident(r.tablename) || '
                    FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID);
                END IF;
            END $policy$;
        ';
        
        tenant_policy_count := tenant_policy_count + 1;
    END LOOP;

    RAISE NOTICE '🛡️  RLS Enforcement Complete. % tables secured.', tenant_policy_count;
END $$;
