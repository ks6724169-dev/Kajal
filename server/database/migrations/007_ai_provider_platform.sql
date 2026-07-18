-- Phase 03.1F Enterprise AI Provider Layer Migrations

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS ai_provider_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL UNIQUE,
    base_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_model_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- 'TEXT', 'VISION', 'EMBEDDING', 'OCR'
    context_window INT NOT NULL DEFAULT 8192,
    pricing_input NUMERIC(10, 6) DEFAULT 0.000000, -- Price per 1k tokens
    pricing_output NUMERIC(10, 6) DEFAULT 0.000000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(provider_name, model_name)
);

CREATE TABLE IF NOT EXISTS ai_usage_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID,
    request_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    estimated_cost NUMERIC(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_request_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    request_type VARCHAR(100) NOT NULL, -- 'CHAT', 'VISION', 'OCR', 'EMBEDDINGS'
    prompt_text TEXT,
    is_success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_response_cache (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    prompt_hash VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, prompt_hash)
);

CREATE TABLE IF NOT EXISTS ai_api_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, provider_name)
);

CREATE TABLE IF NOT EXISTS ai_rate_limits (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'TENANT', 'USER'
    entity_id UUID NOT NULL,
    window_start TIMESTAMP NOT NULL,
    request_count INT DEFAULT 0,
    token_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, entity_type, entity_id, window_start)
);

CREATE TABLE IF NOT EXISTS ai_cost_tracking (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'TENANT', 'USER'
    entity_id UUID NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    term VARCHAR(100) NOT NULL,
    budget_limit NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    budget_spent NUMERIC(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, entity_type, entity_id, academic_year, term)
);

CREATE TABLE IF NOT EXISTS ai_provider_health (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    is_healthy BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_rate_percentage NUMERIC(5, 2) DEFAULT 0.00,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    UNIQUE(tenant_id, provider_name)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_ai_prov_tenant ON ai_provider_registry (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_prov ON ai_model_registry (provider_name);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant ON ai_usage_log (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_request_tenant ON ai_request_log (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON ai_response_cache (tenant_id, prompt_hash);
CREATE INDEX IF NOT EXISTS idx_ai_keys_tenant ON ai_api_keys (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_limits_entity ON ai_rate_limits (tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_cost_entity ON ai_cost_tracking (tenant_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_health_prov ON ai_provider_health (tenant_id, provider_name);

-- 3. Row-Level Security (RLS)
ALTER TABLE ai_provider_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_provider_health ENABLE ROW LEVEL SECURITY;

-- 4. Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_provider') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_provider ON ai_provider_registry; CREATE POLICY tenant_isolation_ai_provider ON ai_provider_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_model') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_model ON ai_model_registry; CREATE POLICY tenant_isolation_ai_model ON ai_model_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_usage') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_usage ON ai_usage_log; CREATE POLICY tenant_isolation_ai_usage ON ai_usage_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_request') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_request ON ai_request_log; CREATE POLICY tenant_isolation_ai_request ON ai_request_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_cache') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_cache ON ai_response_cache; CREATE POLICY tenant_isolation_ai_cache ON ai_response_cache FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_keys') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_keys ON ai_api_keys; CREATE POLICY tenant_isolation_ai_keys ON ai_api_keys FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_limits') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_limits ON ai_rate_limits; CREATE POLICY tenant_isolation_ai_limits ON ai_rate_limits FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_cost') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_cost ON ai_cost_tracking; CREATE POLICY tenant_isolation_ai_cost ON ai_cost_tracking FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_health') THEN
        DROP POLICY IF EXISTS tenant_isolation_ai_health ON ai_provider_health; CREATE POLICY tenant_isolation_ai_health ON ai_provider_health FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- 5. Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_provider_audit') THEN
        CREATE TRIGGER tr_ai_provider_audit AFTER INSERT OR UPDATE OR DELETE ON ai_provider_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_model_audit') THEN
        CREATE TRIGGER tr_ai_model_audit AFTER INSERT OR UPDATE OR DELETE ON ai_model_registry FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_usage_audit') THEN
        CREATE TRIGGER tr_ai_usage_audit AFTER INSERT OR UPDATE OR DELETE ON ai_usage_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_request_audit') THEN
        CREATE TRIGGER tr_ai_request_audit AFTER INSERT OR UPDATE OR DELETE ON ai_request_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_cache_audit') THEN
        CREATE TRIGGER tr_ai_cache_audit AFTER INSERT OR UPDATE OR DELETE ON ai_response_cache FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_keys_audit') THEN
        CREATE TRIGGER tr_ai_keys_audit AFTER INSERT OR UPDATE OR DELETE ON ai_api_keys FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_limits_audit') THEN
        CREATE TRIGGER tr_ai_limits_audit AFTER INSERT OR UPDATE OR DELETE ON ai_rate_limits FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_cost_audit') THEN
        CREATE TRIGGER tr_ai_cost_audit AFTER INSERT OR UPDATE OR DELETE ON ai_cost_tracking FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_health_audit') THEN
        CREATE TRIGGER tr_ai_health_audit AFTER INSERT OR UPDATE OR DELETE ON ai_provider_health FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;
