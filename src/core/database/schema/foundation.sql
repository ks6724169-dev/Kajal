-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base Audit Function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Organization / Tenant Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    logo_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);

-- Ensure all columns exist on organizations if created previously
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- Apply RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- School Table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);

-- Ensure all columns exist on schools if created previously
ALTER TABLE schools ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS deleted_by UUID;

CREATE INDEX IF NOT EXISTS idx_schools_org_id ON schools(organization_id);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    tenant_id UUID REFERENCES organizations(id),
    role TEXT DEFAULT 'guest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Campus Table
CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    location TEXT,
    principal_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);

-- Ensure columns exist on campuses
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS principal_id UUID REFERENCES user_profiles(id);

CREATE INDEX IF NOT EXISTS idx_campuses_org_id ON campuses(organization_id);
CREATE INDEX IF NOT EXISTS idx_campuses_school_id ON campuses(school_id);

ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_campuses_updated_at ON campuses;
CREATE TRIGGER update_campuses_updated_at BEFORE UPDATE ON campuses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


