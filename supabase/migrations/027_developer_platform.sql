-- Phase 03.2X: Enterprise Developer Platform

CREATE TABLE IF NOT EXISTS developer_account (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS api_application (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    developer_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS api_key (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    application_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    scopes JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS oauth_client (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    application_id UUID NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    redirect_uris JSONB NOT NULL,
    grant_types JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS webhook (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    application_id UUID NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    events JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS plugin (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    developer_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS plugin_marketplace (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    plugin_id UUID NOT NULL,
    category VARCHAR(100),
    price NUMERIC(10,2) DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS developer_organization (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, domain VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_secret (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, secret_hash VARCHAR, expires_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_scope (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, description VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_token (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, token_hash VARCHAR, expires_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS oauth_authorization (id UUID PRIMARY KEY, tenant_id UUID, client_id UUID, user_id UUID, scopes JSONB, code_hash VARCHAR, expires_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS oauth_refresh_token (id UUID PRIMARY KEY, tenant_id UUID, client_id UUID, user_id UUID, token_hash VARCHAR, expires_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS webhook_delivery (id UUID PRIMARY KEY, tenant_id UUID, webhook_id UUID, event_id UUID, payload JSONB, status VARCHAR, response_code INT, response_body TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS webhook_log (id UUID PRIMARY KEY, tenant_id UUID, webhook_id UUID, message TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS event_bus (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, description TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS event_subscription (id UUID PRIMARY KEY, tenant_id UUID, event_bus_id UUID, webhook_id UUID, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS plugin_version (id UUID PRIMARY KEY, tenant_id UUID, plugin_id UUID, version_name VARCHAR, manifest JSONB, code_url VARCHAR, is_published BOOLEAN, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS plugin_installation (id UUID PRIMARY KEY, tenant_id UUID, plugin_id UUID, version_id UUID, target_tenant_id UUID, status VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS plugin_permission (id UUID PRIMARY KEY, tenant_id UUID, plugin_id UUID, scope VARCHAR, is_granted BOOLEAN, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS extension (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, type VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS sdk_release (id UUID PRIMARY KEY, tenant_id UUID, language VARCHAR, version_name VARCHAR, url VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS sdk_download (id UUID PRIMARY KEY, tenant_id UUID, sdk_id UUID, developer_id UUID, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_usage (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, endpoint VARCHAR, request_count INT, error_count INT, date TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_quota (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, limit_per_day INT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_rate_limit (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, limit_per_second INT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_billing (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, amount NUMERIC, currency VARCHAR, status VARCHAR, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS sandbox_environment (id UUID PRIMARY KEY, tenant_id UUID, application_id UUID, name VARCHAR, config JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS developer_activity (id UUID PRIMARY KEY, tenant_id UUID, developer_id UUID, action VARCHAR, details JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS developer_notification (id UUID PRIMARY KEY, tenant_id UUID, developer_id UUID, message TEXT, is_read BOOLEAN, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS api_documentation (id UUID PRIMARY KEY, tenant_id UUID, title VARCHAR, content TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS openapi_schema (id UUID PRIMARY KEY, tenant_id UUID, version_name VARCHAR, schema JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS graphql_schema (id UUID PRIMARY KEY, tenant_id UUID, version_name VARCHAR, schema_definition TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS integration_template (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, provider VARCHAR, config JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), deleted_at TIMESTAMP WITH TIME ZONE, created_by UUID, updated_by UUID, version INT DEFAULT 1, status_db VARCHAR(50) DEFAULT 'ACTIVE');

ALTER TABLE developer_account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_developer_account ON developer_account;
CREATE POLICY tenant_isolation_developer_account ON developer_account FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE api_application ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_api_application ON api_application;
CREATE POLICY tenant_isolation_api_application ON api_application FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE plugin ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_plugin ON plugin;
CREATE POLICY tenant_isolation_plugin ON plugin FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
