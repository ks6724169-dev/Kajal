-- Phase 02 Compliance Documents Storage & Metadata Enhancements

CREATE TABLE IF NOT EXISTS institution_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    organization_id VARCHAR(255) NOT NULL,
    campus_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size VARCHAR(50),
    issue_date TIMESTAMP,
    expiry_date TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(255),
    issuer VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    version VARCHAR(50) DEFAULT 'v1.0',
    deleted_at TIMESTAMP
);

-- Idempotently ensure columns exist if created from earlier migration
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='category') THEN
        ALTER TABLE institution_documents ADD COLUMN category VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='issuer') THEN
        ALTER TABLE institution_documents ADD COLUMN issuer VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='issue_date') THEN
        ALTER TABLE institution_documents ADD COLUMN issue_date TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='campus_id') THEN
        ALTER TABLE institution_documents ADD COLUMN campus_id VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='file_name') THEN
        ALTER TABLE institution_documents ADD COLUMN file_name VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='institution_documents' AND column_name='file_type') THEN
        ALTER TABLE institution_documents ADD COLUMN file_type VARCHAR(100);
    END IF;
END $$;
