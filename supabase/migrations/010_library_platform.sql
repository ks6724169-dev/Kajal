-- Phase 03.2I Enterprise Library & Digital Knowledge Management Platform Migrations

CREATE TABLE IF NOT EXISTS library_category (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_subcategory (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category_id UUID NOT NULL REFERENCES library_category(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS author_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS publisher_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_book (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    category_id UUID REFERENCES library_category(id),
    subcategory_id UUID REFERENCES library_subcategory(id),
    author_id UUID REFERENCES author_master(id),
    publisher_id UUID REFERENCES publisher_master(id),
    edition VARCHAR(50),
    language VARCHAR(50),
    pages INT,
    price DECIMAL(10, 2),
    description TEXT,
    cover_image_url VARCHAR(255),
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS shelf_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    shelf_number VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_copy (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_book(id),
    barcode VARCHAR(100) UNIQUE,
    shelf_id UUID REFERENCES shelf_master(id),
    condition VARCHAR(50) DEFAULT 'GOOD', -- 'GOOD', 'DAMAGED', 'LOST'
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_member (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL, -- Reference to user
    member_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'TEACHER', 'STAFF'
    max_books_allowed INT DEFAULT 2,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_card (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    card_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_issue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    copy_id UUID NOT NULL REFERENCES library_copy(id),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    is_returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_return (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    issue_id UUID NOT NULL REFERENCES library_issue(id),
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    condition_on_return VARCHAR(50),
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS library_reservation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    book_id UUID NOT NULL REFERENCES library_book(id),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS fine_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    issue_id UUID REFERENCES library_issue(id),
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS rfid_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    copy_id UUID REFERENCES library_copy(id),
    rfid_tag VARCHAR(255) UNIQUE NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS qr_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'BOOK', 'COPY', 'MEMBER'
    entity_id UUID NOT NULL,
    qr_code_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS digital_resource (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL, -- 'EBOOK', 'RESEARCH_PAPER', 'JOURNAL', 'STUDY_MATERIAL', 'PREVIOUS_PAPER', 'QUESTION_BANK', 'VIDEO', 'AUDIO'
    category_id UUID REFERENCES library_category(id),
    author_id UUID REFERENCES author_master(id),
    file_url VARCHAR(255) NOT NULL,
    file_size INT,
    search_vector TSVECTOR,
    published_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ebook_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    isbn VARCHAR(50),
    format VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS research_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    doi VARCHAR(100),
    abstract TEXT,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS journal_repository (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    volume VARCHAR(50),
    issue VARCHAR(50),
    issn VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS previous_year_paper (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    examination VARCHAR(100),
    subject VARCHAR(100),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    subject VARCHAR(100),
    topic VARCHAR(100),
    difficulty_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS study_material (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    class_name VARCHAR(50),
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS book_review (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_book(id),
    member_id UUID NOT NULL REFERENCES library_member(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    book_id UUID REFERENCES library_book(id),
    resource_id UUID REFERENCES digital_resource(id),
    read_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_book_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES library_member(id),
    recommended_books JSONB NOT NULL,
    recommended_resources JSONB,
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS knowledge_collection (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    curator_id UUID,
    resources JSONB, -- Array of resource IDs or book IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS resource_download_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES digital_resource(id),
    member_id UUID NOT NULL REFERENCES library_member(id),
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lib_book_tenant ON library_book(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_copy_tenant ON library_copy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_issue_tenant ON library_issue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lib_resrv_tenant ON library_reservation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dig_res_tenant ON digital_resource(tenant_id);

-- TSVector Update Triggers for Search
CREATE OR REPLACE FUNCTION lib_book_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
     setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('english', coalesce(new.isbn,'')), 'B') ||
     setweight(to_tsvector('english', coalesce(new.description,'')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER lib_book_tsvectorupdate BEFORE INSERT OR UPDATE
    ON library_book FOR EACH ROW EXECUTE PROCEDURE lib_book_search_trigger();

CREATE OR REPLACE FUNCTION dig_res_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
     setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('english', coalesce(new.description,'')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER dig_res_tsvectorupdate BEFORE INSERT OR UPDATE
    ON digital_resource FOR EACH ROW EXECUTE PROCEDURE dig_res_search_trigger();

-- Row-Level Security (RLS)
ALTER TABLE library_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_subcategory ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_copy ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_issue ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_return ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_reservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfid_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE previous_year_paper ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_book_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_download_log ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
DECLARE
    table_name text;
    policy_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'library_category', 'library_subcategory', 'author_master', 'publisher_master',
            'library_book', 'shelf_master', 'library_copy', 'library_member', 'library_card',
            'library_issue', 'library_return', 'library_reservation', 'fine_master',
            'rfid_registry', 'qr_registry', 'digital_resource', 'ebook_repository',
            'research_repository', 'journal_repository', 'previous_year_paper',
            'question_bank', 'study_material', 'book_review', 'reading_history',
            'ai_book_recommendation', 'knowledge_collection', 'resource_download_log'
          )
    LOOP
        policy_name := 'tenant_isolation_' || table_name;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = policy_name) THEN
            EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = current_setting(''app.current_tenant'')::UUID)', policy_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Audit Triggers
DO $$
DECLARE
    table_name text;
    trigger_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'library_category', 'library_subcategory', 'author_master', 'publisher_master',
            'library_book', 'shelf_master', 'library_copy', 'library_member', 'library_card',
            'library_issue', 'library_return', 'library_reservation', 'fine_master',
            'rfid_registry', 'qr_registry', 'digital_resource', 'ebook_repository',
            'research_repository', 'journal_repository', 'previous_year_paper',
            'question_bank', 'study_material', 'book_review', 'reading_history',
            'ai_book_recommendation', 'knowledge_collection', 'resource_download_log'
          )
    LOOP
        trigger_name := 'tr_' || table_name || '_audit';
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
            EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger()', trigger_name, table_name);
        END IF;
    END LOOP;
END $$;
