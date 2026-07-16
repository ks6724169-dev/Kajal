-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1B
-- DATABASE MIGRATION: 00002_identity_and_auth_core.sql
-- TARGET SYSTEM: GEOS v12.0 Enterprise Core
-- CLASSIFICATION: Enterprise Secret (RESTRICTED)

-- ==========================================
-- 1. MULTI-TENANT CORE REGISTRIES
-- ==========================================

-- 1.1 Tenant Registry
CREATE TABLE public.tenant_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_code VARCHAR(64) UNIQUE NOT NULL,
  tenant_name VARCHAR(256) NOT NULL,
  domain_name VARCHAR(256) UNIQUE,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  subscription_tier VARCHAR(64) DEFAULT 'enterprise' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 1.2 Organization Registry
CREATE TABLE public.organization_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenant_registry(id) ON DELETE RESTRICT,
  org_code VARCHAR(64) UNIQUE NOT NULL,
  org_name VARCHAR(256) NOT NULL,
  tax_id VARCHAR(128),
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 1.3 Campus Registry
CREATE TABLE public.campus_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenant_registry(id) ON DELETE RESTRICT,
  organization_id UUID NOT NULL REFERENCES public.organization_registry(id) ON DELETE RESTRICT,
  campus_code VARCHAR(64) UNIQUE NOT NULL,
  campus_name VARCHAR(256) NOT NULL,
  address_line1 TEXT,
  city VARCHAR(128),
  state VARCHAR(128),
  country_iso VARCHAR(2) REFERENCES public.countries(iso_alpha2),
  timezone VARCHAR(128) REFERENCES public.timezones(timezone_name),
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 1.4 Academic Session Binding
CREATE TABLE public.academic_session_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenant_registry(id) ON DELETE RESTRICT,
  campus_id UUID NOT NULL REFERENCES public.campus_registry(id) ON DELETE RESTRICT,
  session_code VARCHAR(64) NOT NULL,
  session_name VARCHAR(128) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  UNIQUE (tenant_id, campus_id, session_code)
);


-- ==========================================
-- 2. UNIVERSAL USER REGISTRY
-- ==========================================
CREATE TABLE public.universal_user (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenant_registry(id) ON DELETE RESTRICT,
  email VARCHAR(256) UNIQUE NOT NULL,
  phone VARCHAR(64) UNIQUE,
  username VARCHAR(128) UNIQUE,
  user_type VARCHAR(64) NOT NULL, -- e.g. student, teacher, parent, staff, super_admin, ai_agent
  password_hash VARCHAR(256), -- For local auth if not using Supabase fully, though usually handled by auth.users
  status VARCHAR(64) DEFAULT 'pending_verification' NOT NULL,
  verification_status VARCHAR(64) DEFAULT 'unverified' NOT NULL,
  mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL,
  mfa_status VARCHAR(64) DEFAULT 'disabled' NOT NULL,
  webauthn_keys JSONB DEFAULT '[]'::jsonb NOT NULL,
  recovery_keys JSONB DEFAULT '[]'::jsonb NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_password_change_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INT DEFAULT 0 NOT NULL,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  encryption_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  key_reference_fields JSONB DEFAULT '{}'::jsonb NOT NULL,
  pii_classification JSONB DEFAULT '{}'::jsonb NOT NULL,
  retention_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  audit_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Replace the placeholder function from 03.1A
CREATE OR REPLACE FUNCTION public.fn_handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.universal_user (id, email, user_type, tenant_id, metadata)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    (NEW.raw_user_meta_data->>'tenant_id')::uuid,
    '{"synced_via_auth_hook": true}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 3. ROLE & PERMISSION PLATFORM
-- ==========================================

CREATE TABLE public.role_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenant_registry(id) ON DELETE RESTRICT,
  role_code VARCHAR(64) NOT NULL,
  role_name VARCHAR(128) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE NOT NULL,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID,
  version INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  UNIQUE (tenant_id, role_code)
);

CREATE TABLE public.permission_registry (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  permission_code VARCHAR(128) UNIQUE NOT NULL,
  permission_name VARCHAR(128) NOT NULL,
  module_name VARCHAR(64) NOT NULL,
  action_type VARCHAR(64) NOT NULL, -- create, read, update, delete, approve, etc.
  description TEXT,
  is_system BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.role_permissions (
  role_id UUID REFERENCES public.role_registry(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permission_registry(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by UUID,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.universal_user(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.role_registry(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organization_registry(id) ON DELETE RESTRICT,
  campus_id UUID REFERENCES public.campus_registry(id) ON DELETE RESTRICT,
  is_primary BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by UUID,
  PRIMARY KEY (user_id, role_id, organization_id, campus_id)
);

CREATE TABLE public.user_permissions (
  user_id UUID REFERENCES public.universal_user(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permission_registry(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organization_registry(id) ON DELETE RESTRICT,
  campus_id UUID REFERENCES public.campus_registry(id) ON DELETE RESTRICT,
  is_revoked BOOLEAN DEFAULT FALSE NOT NULL, -- For overriding role permissions (Deny)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by UUID,
  PRIMARY KEY (user_id, permission_id, organization_id, campus_id)
);


-- ==========================================
-- 4. SESSION PLATFORM & SECURITY EVENTS
-- ==========================================

CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.universal_user(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenant_registry(id),
  session_token VARCHAR(512) UNIQUE NOT NULL,
  refresh_token VARCHAR(512) UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_id UUID,
  geo_location JSONB,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

CREATE TABLE public.trusted_devices (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.universal_user(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(256) NOT NULL,
  device_name VARCHAR(128),
  device_type VARCHAR(64),
  os_info VARCHAR(128),
  browser_info VARCHAR(128),
  trust_score INT DEFAULT 50 NOT NULL,
  is_trusted BOOLEAN DEFAULT FALSE NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE (user_id, device_fingerprint)
);

CREATE TABLE public.security_events (
  id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  user_id UUID REFERENCES public.universal_user(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.tenant_registry(id),
  event_type VARCHAR(128) NOT NULL, -- login_success, login_failed, mfa_failed, impossible_travel
  severity VARCHAR(32) DEFAULT 'info' NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  geo_location JSONB,
  risk_score INT DEFAULT 0,
  details JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ==========================================
-- 5. INDEXES & CONSTRAINTS
-- ==========================================
CREATE INDEX idx_tenant_code ON public.tenant_registry (tenant_code);
CREATE INDEX idx_org_tenant ON public.organization_registry (tenant_id);
CREATE INDEX idx_campus_org ON public.campus_registry (organization_id);
CREATE INDEX idx_academic_session_current ON public.academic_session_registry (campus_id) WHERE is_current = TRUE;

CREATE INDEX idx_univ_user_email ON public.universal_user (email);
CREATE INDEX idx_univ_user_tenant ON public.universal_user (tenant_id);

CREATE INDEX idx_session_user ON public.user_sessions (user_id);
CREATE INDEX idx_session_token ON public.user_sessions (session_token);

CREATE INDEX idx_security_events_user ON public.security_events (user_id);
CREATE INDEX idx_security_events_type ON public.security_events (event_type);

-- ==========================================
-- 6. AUDIT & METADATA TRIGGERS
-- ==========================================

-- tenant_registry
CREATE TRIGGER tr_tenant_metadata BEFORE INSERT OR UPDATE ON public.tenant_registry FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_tenant_timestamp BEFORE UPDATE ON public.tenant_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_tenant_audit AFTER INSERT OR UPDATE OR DELETE ON public.tenant_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- organization_registry
CREATE TRIGGER tr_org_metadata BEFORE INSERT OR UPDATE ON public.organization_registry FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_org_timestamp BEFORE UPDATE ON public.organization_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_org_audit AFTER INSERT OR UPDATE OR DELETE ON public.organization_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- campus_registry
CREATE TRIGGER tr_campus_metadata BEFORE INSERT OR UPDATE ON public.campus_registry FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_campus_timestamp BEFORE UPDATE ON public.campus_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_campus_audit AFTER INSERT OR UPDATE OR DELETE ON public.campus_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- universal_user
CREATE TRIGGER tr_user_metadata BEFORE INSERT OR UPDATE ON public.universal_user FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_user_timestamp BEFORE UPDATE ON public.universal_user FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_user_audit AFTER INSERT OR UPDATE OR DELETE ON public.universal_user FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();

-- role_registry
CREATE TRIGGER tr_role_metadata BEFORE INSERT OR UPDATE ON public.role_registry FOR EACH ROW EXECUTE FUNCTION public.fn_validate_jsonb_metadata();
CREATE TRIGGER tr_role_timestamp BEFORE UPDATE ON public.role_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_timestamp_and_version();
CREATE TRIGGER tr_role_audit AFTER INSERT OR UPDATE OR DELETE ON public.role_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();


-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.tenant_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_session_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universal_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Base Tenant Isolation Policies (Assuming auth.jwt()->'user_metadata'->>'tenant_id' is set)
CREATE POLICY policy_tenant_isolation_org ON public.organization_registry 
  FOR ALL USING (tenant_id::text = current_setting('request.jwt.claims', true)::json->'user_metadata'->>'tenant_id');

CREATE POLICY policy_tenant_isolation_campus ON public.campus_registry 
  FOR ALL USING (tenant_id::text = current_setting('request.jwt.claims', true)::json->'user_metadata'->>'tenant_id');

CREATE POLICY policy_tenant_isolation_user ON public.universal_user 
  FOR ALL USING (tenant_id::text = current_setting('request.jwt.claims', true)::json->'user_metadata'->>'tenant_id');

-- ==========================================
-- 8. SEED DATA (ROLES & PERMISSIONS)
-- ==========================================
INSERT INTO public.role_registry (tenant_id, role_code, role_name, is_system_role) VALUES
  (NULL, 'super_admin', 'Super Administrator', TRUE),
  (NULL, 'school_owner', 'School Owner', TRUE),
  (NULL, 'principal', 'Principal', TRUE),
  (NULL, 'vice_principal', 'Vice Principal', TRUE),
  (NULL, 'teacher', 'Teacher', TRUE),
  (NULL, 'student', 'Student', TRUE),
  (NULL, 'parent', 'Parent', TRUE),
  (NULL, 'finance', 'Finance Officer', TRUE),
  (NULL, 'hr', 'HR Manager', TRUE),
  (NULL, 'transport', 'Transport Manager', TRUE),
  (NULL, 'hostel', 'Hostel Warden', TRUE),
  (NULL, 'library', 'Chief Librarian', TRUE),
  (NULL, 'security', 'Security Officer', TRUE),
  (NULL, 'inventory', 'Inventory Manager', TRUE),
  (NULL, 'ai_agent', 'AI System Agent', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.permission_registry (permission_code, permission_name, module_name, action_type) VALUES
  ('identity.users.create', 'Create Users', 'Identity', 'create'),
  ('identity.users.read', 'Read Users', 'Identity', 'read'),
  ('identity.users.update', 'Update Users', 'Identity', 'update'),
  ('identity.users.delete', 'Delete Users', 'Identity', 'delete'),
  ('identity.roles.manage', 'Manage Roles', 'Identity', 'update'),
  ('tenant.settings.manage', 'Manage Tenant Settings', 'Tenant', 'update'),
  ('security.audit.read', 'Read Audit Logs', 'Security', 'read')
ON CONFLICT DO NOTHING;
