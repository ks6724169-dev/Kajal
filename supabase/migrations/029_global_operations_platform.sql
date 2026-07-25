-- Phase 03.2Z: Enterprise Global SaaS Operations, Multi-Region Cloud, Kubernetes, Edge Computing, Production Deployment & Enterprise Command Center Platform

CREATE TABLE IF NOT EXISTS global_region (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    provider VARCHAR(100) DEFAULT 'AWS',
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_cluster (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    region_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS kubernetes_cluster (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cluster_id UUID NOT NULL,
    kube_version VARCHAR(50) NOT NULL,
    api_endpoint VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'HEALTHY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS kubernetes_node (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    k8s_cluster_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'worker',
    cpu_cores INT DEFAULT 1,
    memory_gb INT DEFAULT 4,
    status VARCHAR(50) DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_environment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_production BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_release (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    env_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    version_tag VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_version (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    release_id UUID NOT NULL,
    commit_sha VARCHAR(100),
    build_url VARCHAR(500),
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deployment_strategy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) DEFAULT 'CANARY',
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS edge_location (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    ip_address VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ONLINE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS edge_cache (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    location_id UUID NOT NULL,
    key_pattern VARCHAR(255) NOT NULL,
    hit_rate NUMERIC(5,2) DEFAULT 0,
    size_mb INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS cdn_configuration (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    origin_url VARCHAR(500) NOT NULL,
    ttl_seconds INT DEFAULT 3600,
    ssl_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS service_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    version_tag VARCHAR(100) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'UP',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS service_discovery (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    service_id UUID NOT NULL,
    client_ip VARCHAR(100),
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS service_mesh (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) DEFAULT 'ISTIO',
    mtls_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS load_balancer (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    algorithm VARCHAR(50) DEFAULT 'ROUND_ROBIN',
    public_ip VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS autoscaling_policy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    cluster_id UUID NOT NULL,
    min_replicas INT DEFAULT 1,
    max_replicas INT DEFAULT 10,
    cpu_threshold INT DEFAULT 70,
    mem_threshold INT DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS global_configuration (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    config_key VARCHAR(255) NOT NULL,
    config_value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS tenant_region_mapping (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    mapped_tenant_id UUID NOT NULL,
    region_id UUID NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS production_environment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    env_id UUID NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    health_status VARCHAR(50) DEFAULT 'HEALTHY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS maintenance_schedule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS maintenance_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    performed_by VARCHAR(255),
    outcome_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS release_note (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    version_tag VARCHAR(50) NOT NULL,
    notes TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS release_channel (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS rollout_policy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    release_id UUID NOT NULL,
    percentage INT DEFAULT 10,
    step_duration_minutes INT DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS rollback_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    release_id UUID NOT NULL,
    reason TEXT NOT NULL,
    triggered_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS command_center_dashboard (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS command_center_widget (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    dashboard_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    grid_layout JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS global_operation_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    details JSONB DEFAULT '{}',
    severity VARCHAR(50) DEFAULT 'INFO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS global_alert (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'WARNING',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS compliance_policy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    standard VARCHAR(100) NOT NULL, -- e.g. 'GDPR', 'SOC2', 'ISO27001'
    rules JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS compliance_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    policy_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'PASSED',
    findings TEXT,
    audited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS disaster_status (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    region_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    recovery_point_objective_seconds INT DEFAULT 300,
    recovery_time_objective_seconds INT DEFAULT 1800,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS system_capacity (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- e.g. 'CPU', 'MEM', 'STORAGE'
    allocated INT DEFAULT 0,
    used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS infrastructure_cost (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    region_id UUID NOT NULL,
    amount_usd NUMERIC(12,2) DEFAULT 0.00,
    billing_period VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_orchestration_job (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_cluster (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    region_id UUID NOT NULL,
    gpu_type VARCHAR(100) DEFAULT 'NVIDIA-A100',
    gpu_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_model_registry_global (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    version_tag VARCHAR(50) NOT NULL,
    accuracy NUMERIC(5,4) DEFAULT 0.0000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable RLS and create tenant isolation policies for all tables
ALTER TABLE global_region ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_global_region ON global_region;
CREATE POLICY tenant_isolation_global_region ON global_region FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE deployment_cluster ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_deployment_cluster ON deployment_cluster;
CREATE POLICY tenant_isolation_deployment_cluster ON deployment_cluster FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE kubernetes_cluster ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_kubernetes_cluster ON kubernetes_cluster;
CREATE POLICY tenant_isolation_kubernetes_cluster ON kubernetes_cluster FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE kubernetes_node ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_kubernetes_node ON kubernetes_node;
CREATE POLICY tenant_isolation_kubernetes_node ON kubernetes_node FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE deployment_environment ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_deployment_environment ON deployment_environment;
CREATE POLICY tenant_isolation_deployment_environment ON deployment_environment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE deployment_release ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_deployment_release ON deployment_release;
CREATE POLICY tenant_isolation_deployment_release ON deployment_release FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE deployment_version ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_deployment_version ON deployment_version;
CREATE POLICY tenant_isolation_deployment_version ON deployment_version FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE deployment_strategy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_deployment_strategy ON deployment_strategy;
CREATE POLICY tenant_isolation_deployment_strategy ON deployment_strategy FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE edge_location ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_edge_location ON edge_location;
CREATE POLICY tenant_isolation_edge_location ON edge_location FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE edge_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_edge_cache ON edge_cache;
CREATE POLICY tenant_isolation_edge_cache ON edge_cache FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE cdn_configuration ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_cdn_configuration ON cdn_configuration;
CREATE POLICY tenant_isolation_cdn_configuration ON cdn_configuration FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE service_registry ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_service_registry ON service_registry;
CREATE POLICY tenant_isolation_service_registry ON service_registry FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE service_discovery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_service_discovery ON service_discovery;
CREATE POLICY tenant_isolation_service_discovery ON service_discovery FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE service_mesh ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_service_mesh ON service_mesh;
CREATE POLICY tenant_isolation_service_mesh ON service_mesh FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE load_balancer ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_load_balancer ON load_balancer;
CREATE POLICY tenant_isolation_load_balancer ON load_balancer FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE autoscaling_policy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_autoscaling_policy ON autoscaling_policy;
CREATE POLICY tenant_isolation_autoscaling_policy ON autoscaling_policy FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE global_configuration ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_global_configuration ON global_configuration;
CREATE POLICY tenant_isolation_global_configuration ON global_configuration FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE tenant_region_mapping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_tenant_region_mapping ON tenant_region_mapping;
CREATE POLICY tenant_isolation_tenant_region_mapping ON tenant_region_mapping FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE production_environment ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_production_environment ON production_environment;
CREATE POLICY tenant_isolation_production_environment ON production_environment FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_maintenance_schedule ON maintenance_schedule;
CREATE POLICY tenant_isolation_maintenance_schedule ON maintenance_schedule FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_maintenance_history ON maintenance_history;
CREATE POLICY tenant_isolation_maintenance_history ON maintenance_history FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE release_note ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_release_note ON release_note;
CREATE POLICY tenant_isolation_release_note ON release_note FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE release_channel ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_release_channel ON release_channel;
CREATE POLICY tenant_isolation_release_channel ON release_channel FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE rollout_policy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_rollout_policy ON rollout_policy;
CREATE POLICY tenant_isolation_rollout_policy ON rollout_policy FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE rollback_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_rollback_history ON rollback_history;
CREATE POLICY tenant_isolation_rollback_history ON rollback_history FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE command_center_dashboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_command_center_dashboard ON command_center_dashboard;
CREATE POLICY tenant_isolation_command_center_dashboard ON command_center_dashboard FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE command_center_widget ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_command_center_widget ON command_center_widget;
CREATE POLICY tenant_isolation_command_center_widget ON command_center_widget FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE global_operation_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_global_operation_log ON global_operation_log;
CREATE POLICY tenant_isolation_global_operation_log ON global_operation_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE global_alert ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_global_alert ON global_alert;
CREATE POLICY tenant_isolation_global_alert ON global_alert FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE compliance_policy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_compliance_policy ON compliance_policy;
CREATE POLICY tenant_isolation_compliance_policy ON compliance_policy FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE compliance_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_compliance_audit ON compliance_audit;
CREATE POLICY tenant_isolation_compliance_audit ON compliance_audit FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE disaster_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_disaster_status ON disaster_status;
CREATE POLICY tenant_isolation_disaster_status ON disaster_status FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE system_capacity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_system_capacity ON system_capacity;
CREATE POLICY tenant_isolation_system_capacity ON system_capacity FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE infrastructure_cost ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_infrastructure_cost ON infrastructure_cost;
CREATE POLICY tenant_isolation_infrastructure_cost ON infrastructure_cost FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_orchestration_job ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_orchestration_job ON ai_orchestration_job;
CREATE POLICY tenant_isolation_ai_orchestration_job ON ai_orchestration_job FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_cluster ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_cluster ON ai_cluster;
CREATE POLICY tenant_isolation_ai_cluster ON ai_cluster FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_model_registry_global ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_model_registry_global ON ai_model_registry_global;
CREATE POLICY tenant_isolation_ai_model_registry_global ON ai_model_registry_global FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
