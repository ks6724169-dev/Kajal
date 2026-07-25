-- Phase 02 Institution & Organization Management Migrations

CREATE TABLE IF NOT EXISTS organization_branding (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    logo_url VARCHAR(255),
    primary_color VARCHAR(50) DEFAULT '#4f46e5',
    secondary_color VARCHAR(50) DEFAULT '#0f172a',
    theme_mode VARCHAR(50) DEFAULT 'light',
    font_family VARCHAR(100) DEFAULT 'Plus Jakarta Sans',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS institution_documents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'Registration', 'Accreditation', 'TaxCert', 'Other'
    file_url VARCHAR(255) NOT NULL,
    file_size VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID,
    expiry_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    version INT DEFAULT 1,
    deleted_at TIMESTAMP
);

-- Enable RLS and Tenant Isolation Policies
ALTER TABLE organization_branding ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON organization_branding;
CREATE POLICY tenant_isolation_policy ON organization_branding FOR ALL USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
);

ALTER TABLE institution_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON institution_documents;
CREATE POLICY tenant_isolation_policy ON institution_documents FOR ALL USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
);
