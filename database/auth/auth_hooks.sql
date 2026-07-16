-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Auth Synchronizer Hooks
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Synchronizer function triggered upon a new auth registration in Supabase auth.users
CREATE OR REPLACE FUNCTION public.fn_handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile directly into custom universal user registry to complete connection
  -- (Note: 'public.universal_user' is defined inside Phase 02.2 and created in Phase 03.1B)
  -- This function is prepared to execute cleanly once that profile exists.
  
  -- INSERT INTO public.universal_user (id, email, user_role, tenant_id, metadata)
  -- VALUES (
  --   NEW.id,
  --   NEW.email,
  --   COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
  --   (NEW.raw_user_meta_data->>'tenant_id')::uuid,
  --   '{"synced_via_auth_hook": true}'::jsonb
  -- );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger registration on Supabase auth schema
-- CREATE TRIGGER tr_on_auth_user_created
-- AFTER INSERT ON auth.users
-- FOR EACH ROW EXECUTE FUNCTION public.fn_handle_new_auth_user();
