-- Phase 03.2A Master Data Migrations

CREATE TABLE IF NOT EXISTS master_references (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id UUID,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX idx_master_ref_tenant_type ON master_references(tenant_id, type);

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    address JSONB,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE UNIQUE INDEX idx_org_code_tenant ON organizations(code, tenant_id) WHERE deleted_at IS NULL;

-- Audit Triggers (mocked for this phase)
-- Security RLS
ALTER TABLE master_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_master_ref ON master_references FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_organizations ON organizations FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
