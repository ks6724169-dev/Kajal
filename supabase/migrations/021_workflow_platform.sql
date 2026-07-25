-- Phase 03.2R: Enterprise Workflow Platform Database Migration

CREATE TABLE IF NOT EXISTS workflow_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    campus_id UUID,
    name VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_workflow_master_tenant ON workflow_master(tenant_id);

CREATE TABLE IF NOT EXISTS workflow_version (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workflow_id UUID NOT NULL,
    version_number INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID,
    schema_definition JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_step (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workflow_version_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    configuration JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_transition (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workflow_version_id UUID NOT NULL,
    from_step_id UUID NOT NULL,
    to_step_id UUID NOT NULL,
    condition TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_instance (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workflow_version_id UUID NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    current_step_id UUID,
    started_by UUID NOT NULL,
    context_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_instance_step (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    instance_id UUID NOT NULL,
    step_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    outcome VARCHAR(255),
    comments TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_assignment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    instance_step_id UUID NOT NULL,
    assigned_to_user UUID,
    assigned_to_role VARCHAR(100),
    assigned_to_department UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS approval_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    instance_step_id UUID NOT NULL,
    approver_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    comments TEXT,
    action_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS approval_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    approval_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL,
    comments TEXT,
    action_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS approval_matrix (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    module VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    condition TEXT NOT NULL,
    required_role VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS business_rule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    module VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    condition_logic TEXT NOT NULL,
    action_logic TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS automation_trigger (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    condition TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS automation_action (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    trigger_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    configuration JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS workflow_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    instance_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    actor_id UUID,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS task_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(100) NOT NULL,
    entity_id UUID,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    due_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS task_assignment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    task_id UUID NOT NULL,
    assignee_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS escalation_rule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    module VARCHAR(100) NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    timeout_minutes INT NOT NULL,
    escalate_to_role VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS sla_policy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    module VARCHAR(100) NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    max_resolution_minutes INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS scheduler_job (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable RLS
ALTER TABLE workflow_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_workflow_master ON workflow_master;
CREATE POLICY tenant_isolation_workflow_master ON workflow_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE workflow_instance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_workflow_instance ON workflow_instance;
CREATE POLICY tenant_isolation_workflow_instance ON workflow_instance FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE approval_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_approval_master ON approval_master;
CREATE POLICY tenant_isolation_approval_master ON approval_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE task_master ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_task_master ON task_master;
CREATE POLICY tenant_isolation_task_master ON task_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
