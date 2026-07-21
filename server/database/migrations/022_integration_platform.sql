-- Phase 03.2S: Enterprise API Integration Platform

CREATE TABLE IF NOT EXISTS integration_provider (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    campus_id UUID,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    provider_type VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_integration_provider_tenant ON integration_provider(tenant_id);

CREATE TABLE IF NOT EXISTS api_connector (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    configuration JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS oauth_credential (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scopes JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS api_key (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS webhook_endpoint (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    url VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    events JSONB NOT NULL,
    direction VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS webhook_event (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    endpoint_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS sync_job (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    job_name VARCHAR(255) NOT NULL,
    sync_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'QUEUED'
);

CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    job_id UUID NOT NULL,
    level VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS data_mapping (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    source_entity VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    field_mappings JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS integration_health (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    connector_id UUID NOT NULL,
    last_check_at TIMESTAMP WITH TIME ZONE NOT NULL,
    latency_ms INT,
    error_rate NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'HEALTHY'
);

CREATE TABLE IF NOT EXISTS retry_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    retry_count INT DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS dead_letter_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    original_queue_id UUID NOT NULL,
    reason TEXT NOT NULL,
    payload JSONB NOT NULL,
    failed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable RLS
ALTER TABLE integration_provider ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_integration_provider ON integration_provider;
CREATE POLICY tenant_isolation_integration_provider ON integration_provider FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE api_connector ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_api_connector ON api_connector;
CREATE POLICY tenant_isolation_api_connector ON api_connector FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE webhook_endpoint ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_webhook_endpoint ON webhook_endpoint;
CREATE POLICY tenant_isolation_webhook_endpoint ON webhook_endpoint FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE sync_job ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_sync_job ON sync_job;
CREATE POLICY tenant_isolation_sync_job ON sync_job FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
