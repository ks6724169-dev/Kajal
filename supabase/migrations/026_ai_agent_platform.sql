-- Phase 03.2W: Enterprise AI Agent, Automation, Copilot & Autonomous Operations Platform

CREATE TABLE IF NOT EXISTS ai_agent (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_provider VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    system_prompt TEXT NOT NULL,
    temperature NUMERIC(3,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_skill (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    tool_schema JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_memory (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    user_id UUID,
    context_key VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    importance_score INT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_conversation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_message (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    conversation_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_task (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority VARCHAR(50) NOT NULL,
    result JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_execution (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    task_id UUID NOT NULL,
    step_number INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    result JSONB,
    status VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_workflow (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    steps JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_reasoning (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    task_id UUID,
    execution_id UUID,
    thought_process TEXT NOT NULL,
    confidence_score NUMERIC(4,2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_decision (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    context TEXT NOT NULL,
    decision TEXT NOT NULL,
    confidence NUMERIC(4,2) NOT NULL,
    is_autonomous BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    user_id UUID NOT NULL,
    module VARCHAR(100) NOT NULL,
    suggestion TEXT NOT NULL,
    priority INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status_db VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_schedule (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    task_id UUID NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_notification (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_audit (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    context JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- RLS
ALTER TABLE ai_agent ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_agent ON ai_agent;
CREATE POLICY tenant_isolation_ai_agent ON ai_agent FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_conversation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_conversation ON ai_conversation;
CREATE POLICY tenant_isolation_ai_conversation ON ai_conversation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_task ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_task ON ai_task;
CREATE POLICY tenant_isolation_ai_task ON ai_task FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE ai_recommendation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_ai_recommendation ON ai_recommendation;
CREATE POLICY tenant_isolation_ai_recommendation ON ai_recommendation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
