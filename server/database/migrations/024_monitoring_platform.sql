-- Phase 03.2U: Enterprise Monitoring, Observability, Logging, Health Check, Performance & DevOps Platform

CREATE TABLE IF NOT EXISTS system_health (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_check_at TIMESTAMP WITH TIME ZONE NOT NULL,
    details JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS service_health (
    id UUID PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    latency_ms INT,
    last_check_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS application_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    level VARCHAR(50) NOT NULL,
    module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS error_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    error_code VARCHAR(100),
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_metric (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    value NUMERIC(15,2) NOT NULL,
    unit VARCHAR(50),
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_metric (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS database_metric (
    id UUID PRIMARY KEY,
    query_name VARCHAR(255) NOT NULL,
    execution_time_ms INT NOT NULL,
    rows_returned INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    alert_name VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS incident (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    assigned_to UUID,
    root_cause TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS incident_timeline (
    id UUID PRIMARY KEY,
    incident_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    actor_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_window (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_history (
    id UUID PRIMARY KEY,
    version VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    deployed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deployed_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feature_flag (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS monitoring_dashboard (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
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

-- Enable RLS
ALTER TABLE application_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_application_log ON application_log;
CREATE POLICY tenant_isolation_application_log ON application_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE alert ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_alert ON alert;
CREATE POLICY tenant_isolation_alert ON alert FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE incident ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_incident ON incident;
CREATE POLICY tenant_isolation_incident ON incident FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE feature_flag ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_feature_flag ON feature_flag;
CREATE POLICY tenant_isolation_feature_flag ON feature_flag FOR ALL USING (tenant_id IS NULL OR tenant_id = current_setting('app.current_tenant')::UUID);
