-- GALAXY ERP: Phone Lookup RPC for Phase 8 Passwordless Mobile Login

CREATE OR REPLACE FUNCTION public.lookup_institutions_by_phone(p_phone text)
RETURNS TABLE (
    tenant_id uuid,
    school_id uuid,
    name text,
    code text,
    type text,
    city text,
    state text,
    logo text,
    role text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.tenant_id,
        s.id as school_id,
        s.name::text,
        COALESCE(s.school_unique_id, '')::text as code,
        COALESCE(s.institution_type, 'school')::text as type,
        COALESCE(s.city, '')::text,
        COALESCE(s.state, '')::text,
        COALESCE(s.logo, '')::text,
        u.user_type::text as role
    FROM public.universal_user u
    JOIN public.schools s ON (u.tenant_id = s.id OR u.tenant_id = s.tenant_id)
    WHERE u.phone = p_phone
      AND u.status = 'active'
      AND (s.is_deleted = false OR s.is_deleted IS NULL);
END;
$$;

-- Grant execution to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.lookup_institutions_by_phone(text) TO anon, authenticated;
