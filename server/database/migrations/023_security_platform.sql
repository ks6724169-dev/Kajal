-- Phase 03.2T: Enterprise Identity, Security, IAM, SSO & Zero Trust Platform

CREATE TABLE IF NOT EXISTS user_identity (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    identity_type VARCHAR(50) NOT NULL,
    identity_value VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_user_identity_tenant ON user_identity(tenant_id);

CREATE TABLE IF NOT EXISTS user_credential (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    credential_type VARCHAR(50) NOT NULL,
    credential_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_compromised BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS role (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS permission (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permission (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_role (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    scope VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    user_agent TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS trusted_device (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    device_identifier VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    trusted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    login_method VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    user_agent TEXT NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    risk_score INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS security_policy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    configuration JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS mfa_configuration (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    mfa_type VARCHAR(50) NOT NULL,
    secret_key VARCHAR(255),
    is_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS oauth_client (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    redirect_uris JSONB NOT NULL,
    grant_types JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS sso_provider (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    configuration JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS refresh_token (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    replaced_by UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS blocked_ip (
    id UUID PRIMARY KEY,
    ip_address VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_device (
    id UUID PRIMARY KEY,
    device_identifier VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_incident (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    affected_user_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS access_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_identity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_user_identity ON user_identity;
CREATE POLICY tenant_isolation_user_identity ON user_identity FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE session ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_session ON session;
CREATE POLICY tenant_isolation_session ON session FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_login_history ON login_history;
CREATE POLICY tenant_isolation_login_history ON login_history FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
