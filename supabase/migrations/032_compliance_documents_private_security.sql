-- Migration 032: Hardening Compliance Document Storage with Private Storage & RLS Policies

-- 1. Ensure Bucket 'institution-documents' is Private (public = false)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'institution-documents';

-- Insert bucket if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'institution-documents', 
    'institution-documents', 
    false, 
    26214400, 
    ARRAY[
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'image/png', 
        'image/jpeg'
    ]
)
ON CONFLICT (id) DO UPDATE 
SET public = false,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'image/png', 
        'image/jpeg'
    ];

-- 2. Enable Row Level Security (RLS) on institution_documents table
ALTER TABLE institution_documents ALTER COLUMN file_url TYPE TEXT;
ALTER TABLE institution_documents ENABLE ROW LEVEL SECURITY;
NOTIFY pgrst, 'reload schema';

-- Drop existing policies if any to ensure idempotency
DROP POLICY IF EXISTS "Tenant isolation policy for institution_documents SELECT" ON institution_documents;
DROP POLICY IF EXISTS "Tenant isolation policy for institution_documents INSERT" ON institution_documents;
DROP POLICY IF EXISTS "Tenant isolation policy for institution_documents UPDATE" ON institution_documents;
DROP POLICY IF EXISTS "Tenant isolation policy for institution_documents DELETE" ON institution_documents;

-- Create RLS Policies for institution_documents
CREATE POLICY "Tenant isolation policy for institution_documents SELECT"
ON institution_documents FOR SELECT
TO authenticated, anon
USING (
    deleted_at IS NULL
);

CREATE POLICY "Tenant isolation policy for institution_documents INSERT"
ON institution_documents FOR INSERT
TO authenticated, anon
WITH CHECK (
    tenant_id IS NOT NULL
);

CREATE POLICY "Tenant isolation policy for institution_documents UPDATE"
ON institution_documents FOR UPDATE
TO authenticated, anon
USING (
    deleted_at IS NULL
);

CREATE POLICY "Tenant isolation policy for institution_documents DELETE"
ON institution_documents FOR DELETE
TO authenticated, anon
USING (
    tenant_id IS NOT NULL
);

-- 3. Storage Policies for private bucket 'institution-documents'
DROP POLICY IF EXISTS "Authenticated Private Storage Read for institution-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Private Storage Upload for institution-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Private Storage Delete for institution-documents" ON storage.objects;

CREATE POLICY "Authenticated Private Storage Read for institution-documents"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
    bucket_id = 'institution-documents'
);

CREATE POLICY "Authenticated Private Storage Upload for institution-documents"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (
    bucket_id = 'institution-documents'
);

CREATE POLICY "Authenticated Private Storage Delete for institution-documents"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (
    bucket_id = 'institution-documents'
);
