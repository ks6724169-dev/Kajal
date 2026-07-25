-- Phase 03.2Q: Analytics Platform Database Migration

-- dashboard
CREATE TABLE IF NOT EXISTS dashboard (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    campus_id UUID,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    layout JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_dashboard_tenant ON dashboard(tenant_id);

-- dashboard_widget
CREATE TABLE IF NOT EXISTS dashboard_widget (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    dashboard_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    data_source VARCHAR(255),
    configuration JSONB,
    position JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- kpi
CREATE TABLE IF NOT EXISTS kpi (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    value NUMERIC(15,2) NOT NULL,
    unit VARCHAR(50),
    target_value NUMERIC(15,2),
    trend VARCHAR(50),
    percentage_change NUMERIC(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- analytics_snapshot
CREATE TABLE IF NOT EXISTS analytics_snapshot (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    snapshot_date TIMESTAMP WITH TIME ZONE NOT NULL,
    metrics JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- report
CREATE TABLE IF NOT EXISTS report (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    parameters JSONB,
    generated_url TEXT,
    report_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- report_schedule
CREATE TABLE IF NOT EXISTS report_schedule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    report_id UUID NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    recipients JSONB NOT NULL,
    next_run_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- executive_insight
CREATE TABLE IF NOT EXISTS executive_insight (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    date_generated TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- prediction
CREATE TABLE IF NOT EXISTS prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    predicted_value NUMERIC(15,2) NOT NULL,
    confidence_score NUMERIC(5,2),
    prediction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    timeframe VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- trend_analysis
CREATE TABLE IF NOT EXISTS trend_analysis (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    trend_direction VARCHAR(50) NOT NULL,
    historical_data JSONB,
    analysis_text TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- alert_rule
CREATE TABLE IF NOT EXISTS alert_rule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    threshold NUMERIC(15,2) NOT NULL,
    notification_channels JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- alert_history
CREATE TABLE IF NOT EXISTS alert_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    rule_id UUID NOT NULL,
    triggered_value NUMERIC(15,2) NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    alert_status VARCHAR(50) DEFAULT 'UNREAD',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- usage_analytics
CREATE TABLE IF NOT EXISTS usage_analytics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- system_metrics
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    value NUMERIC(15,2) NOT NULL,
    unit VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- performance_benchmark
CREATE TABLE IF NOT EXISTS performance_benchmark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    benchmark_value NUMERIC(15,2) NOT NULL,
    current_value NUMERIC(15,2) NOT NULL,
    comparison VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable RLS
ALTER TABLE dashboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_dashboard ON dashboard;
CREATE POLICY tenant_isolation_dashboard ON dashboard FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE report ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_report ON report;
CREATE POLICY tenant_isolation_report ON report FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
