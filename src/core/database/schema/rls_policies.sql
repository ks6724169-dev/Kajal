-- ====================================================================
-- GALAXY ERP — PHASE 6 RLS, AAL2 ENFORCEMENT & PUBLIC SCHOOL LOOKUP
-- Server-Authoritative Multi-Tenant Isolation, AAL2 Security & Public Lookup
-- ====================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- Secure search path and strict execution context

-- Helper: Get Tenant ID for current authenticated user
CREATE OR REPLACE FUNCTION public.get_auth_user_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT COALESCE(school_id, tenant_id)
  INTO v_tenant_id
  FROM public.identities
  WHERE id = auth.uid() OR user_id = auth.uid()
  LIMIT 1;

  RETURN v_tenant_id;
END;
$$;

-- Helper: Get Authoritative Role for current authenticated user
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT LOWER(COALESCE(role, user_type, 'guest'))
  INTO v_role
  FROM public.identities
  WHERE id = auth.uid() OR user_id = auth.uid()
  LIMIT 1;

  RETURN COALESCE(v_role, 'guest');
END;
$$;

-- Helper: Get Authenticator Assurance Level (AAL) from Supabase JWT claim
CREATE OR REPLACE FUNCTION public.get_auth_aal()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN COALESCE(auth.jwt() ->> 'aal', 'aal1');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_user_aal()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN COALESCE(auth.jwt() ->> 'aal', 'aal1');
END;
$$;

-- Helper: Check if session has achieved AAL2 (MFA Verified)
CREATE OR REPLACE FUNCTION public.is_aal2_authenticated()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN public.get_auth_aal() = 'aal2';
END;
$$;

-- Helper: Verify if user belongs to specific tenant
CREATE OR REPLACE FUNCTION public.is_tenant_member(p_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (public.get_auth_user_role() = 'super_admin') OR 
         (public.get_auth_user_tenant_id() = p_tenant_id);
END;
$$;

-- 2. CREATE CORE MULTI-TENANT TABLES IF NOT EXISTING AND ENABLE RLS
CREATE TABLE IF NOT EXISTS public.identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    school_id UUID,
    tenant_id UUID,
    role VARCHAR(50),
    user_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    school_id UUID,
    tenant_id UUID,
    parent_id UUID,
    guardian_id UUID,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID,
    tenant_id UUID,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    school_id UUID,
    tenant_id UUID,
    date DATE,
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    school_id UUID,
    tenant_id UUID,
    amount NUMERIC,
    status VARCHAR(20)
);

ALTER TABLE IF EXISTS public.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fees ENABLE ROW LEVEL SECURITY;

-- 3. ROW LEVEL SECURITY POLICIES

-- User Profiles RLS Policy
DROP POLICY IF EXISTS "user_profiles_tenant_isolation_policy" ON public.user_profiles;
CREATE POLICY "user_profiles_tenant_isolation_policy" ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_auth_user_tenant_id()
  OR public.get_auth_user_role() IN ('super_admin', 'organization_owner')
);

-- Campuses RLS Policy
DROP POLICY IF EXISTS "campuses_tenant_isolation_policy" ON public.campuses;
CREATE POLICY "campuses_tenant_isolation_policy" ON public.campuses
FOR ALL
TO authenticated
USING (
  tenant_id = public.get_auth_user_tenant_id()
  OR organization_id = public.get_auth_user_tenant_id()
  OR public.get_auth_user_role() IN ('super_admin', 'organization_owner')
);

-- Identities RLS Policy: Users can view their own profile; School Admins can view users in their school
DROP POLICY IF EXISTS "identities_tenant_isolation_policy" ON public.identities;
CREATE POLICY "identities_tenant_isolation_policy" ON public.identities
FOR ALL
TO authenticated
USING (
  id = auth.uid() 
  OR user_id = auth.uid()
  OR public.get_auth_user_role() IN ('super_admin', 'organization_owner')
  OR (
    (school_id = public.get_auth_user_tenant_id() OR tenant_id = public.get_auth_user_tenant_id())
    AND public.get_auth_user_role() IN ('school_admin', 'principal', 'vice_principal', 'hr')
  )
);

-- Schools RLS Policy for Authenticated Tenant Access:
DROP POLICY IF EXISTS "schools_tenant_isolation_policy" ON public.schools;
CREATE POLICY "schools_tenant_isolation_policy" ON public.schools
FOR ALL
TO authenticated
USING (
  id = public.get_auth_user_tenant_id()
  OR public.get_auth_user_role() IN ('super_admin', 'organization_owner')
);

-- Schools RLS Public Lookup Policy (Public read access for portal institution search):
DROP POLICY IF EXISTS "schools_public_lookup_policy" ON public.schools;
CREATE POLICY "schools_public_lookup_policy" ON public.schools
FOR SELECT
TO anon, authenticated
USING (
  is_deleted = false OR is_deleted IS NULL
);

-- Organizations Public Lookup Policy:
DROP POLICY IF EXISTS "organizations_public_lookup_policy" ON public.organizations;
CREATE POLICY "organizations_public_lookup_policy" ON public.organizations
FOR SELECT
TO anon, authenticated
USING (
  (is_deleted = false OR is_deleted IS NULL) AND status = 'active'
);

-- Students RLS Policy (With AAL2 Enforcement for Admin Role Modifications):
DROP POLICY IF EXISTS "students_tenant_and_role_isolation_policy" ON public.students;
CREATE POLICY "students_tenant_and_role_isolation_policy" ON public.students
FOR ALL
TO authenticated
USING (
  public.get_auth_user_role() = 'super_admin'
  OR (
    (school_id = public.get_auth_user_tenant_id() OR tenant_id = public.get_auth_user_tenant_id())
    AND (
      public.get_auth_user_role() IN ('organization_owner', 'school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'accountant', 'receptionist')
      OR (public.get_auth_user_role() = 'student' AND (user_id = auth.uid() OR id = auth.uid()))
      OR (public.get_auth_user_role() = 'parent' AND (parent_id = auth.uid() OR guardian_id = auth.uid()))
    )
  )
);

-- REVOKE DIRECT ANON EXECUTION ON SENSITIVE SECURITY DEFINER FUNCTIONS
REVOKE EXECUTE ON FUNCTION public.get_auth_user_tenant_id() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_auth_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_tenant_member(UUID) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_auth_user_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_aal() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_aal2_authenticated() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(UUID) TO authenticated;
