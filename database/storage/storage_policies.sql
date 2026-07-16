-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Storage Policies
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Create Supabase Bucket Registries Schema reference (if not exists)
CREATE TABLE IF NOT EXISTS core_storage.bucket_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name VARCHAR(256) UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  allowed_file_extensions VARCHAR(32)[] DEFAULT ARRAY['pdf','docx','png','jpg','xlsx','zip']::VARCHAR(32)[] NOT NULL,
  max_file_size_bytes BIGINT DEFAULT 10485760 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(64) DEFAULT 'active' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 2. Define Storage Security Policies mapping (conceptually aligning with Supabase storage.objects RLS rules)
-- RLS configuration for general private attachments:
-- Only authenticated users belonging to the specific tenant can select or insert objects inside a private bucket.

-- POLICY: select_private_documents
-- FOR SELECT
-- USING (bucket_id = 'documents' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.jwt()->'user_metadata'->>'tenant_id');

-- POLICY: select_public_images
-- FOR SELECT
-- USING (bucket_id = 'images' AND status = 'active');
