# Phase 03.2I - Enterprise Library & Digital Knowledge Management Platform (ELDKMP)

## Overview
Phase 03.2I implements a robust Enterprise Library & Digital Knowledge Management Platform for the Galaxy ERP platform. It supports traditional library workflows (issuing, returning, reserving books, fines) as well as managing digital knowledge repositories (e-books, research papers, journals, question banks) with native AI capabilities.

---

## Architectural Components

### 1. Database Migrations (`server/database/migrations/010_library_platform.sql`)
- Created comprehensive tables: `library_book`, `library_copy`, `library_category`, `library_subcategory`, `author_master`, `publisher_master`, `library_member`, `library_card`, `library_issue`, `library_return`, `library_reservation`, `fine_master`, `shelf_master`, `rfid_registry`, `qr_registry`, `digital_resource`, `ebook_repository`, `research_repository`, `journal_repository`, `previous_year_paper`, `question_bank`, `study_material`, `book_review`, `reading_history`, `ai_book_recommendation`, `knowledge_collection`, `resource_download_log`.
- Used PostgreSQL `tsvector` columns for full-text and semantic search indexing on books and digital resources.
- Configured triggers to auto-update `search_vector` upon insert/update.
- Applied Row-Level Security (RLS) policies for complete multi-tenant isolation.
- Integrated standard audit triggers across all models.

### 2. Domain Entities (`server/entities/LibraryDomain.ts`)
- Defined strictly typed models representing physical and digital library inventory.

### 3. Repository Layer (`server/repositories/LibraryRepository.ts`)
- Defined strongly-typed repositories extending `BaseRepository`.
- Centralized query scopes to respect tenant boundaries out of the box.

### 4. Validation Engine (`server/validators/LibraryValidator.ts`)
- Configured Zod schemas ensuring complete integrity for registering books, uploading resources, issuing/returning copies, and generating fines.

### 5. Services Layer
- **`LibraryService.ts`**: Implements business rules for managing physical book inventories (Register, Issue, Return, Reserve, Fine Generation). Integrates directly with Notification Platform to alert members of actions.
- **`DigitalKnowledgeEngine.ts`**: Specialized service to handle upload and structural binding of Ebooks, Journals, and other Digital Resources, utilizing entity polymorphism.
- **`AIKnowledgeEngine.ts`**: Integrates with the pre-existing `AIGateway` to analyze a user's reading history and provide tailored book/resource recommendations.
- **`KnowledgeSearchEngine.ts`**: Handles optimized `ts_query` based text matching against digital inventories.
- **`LibraryAnalyticsEngine.ts`**: Aggregates core library metrics to power admin dashboards.

### 6. Controllers and API Gateway
- **`LibraryController.ts`**: Handles routing rules and parsing request bodies.
- **`library.ts`**: Maps explicit routes.
- Integrated into `/api/gateway/v1/library`.

---

## AI & Search Capabilities
- **Smart Search Engine**: PostgreSQL `tsvector` handles rapid matching for digital assets, scaling effectively with zero extra setup.
- **AI Recommendation Model**: Analyzes `reading_history` through `AIGateway` to intelligently predict reading paths, directly saving reasoning insights securely for audit reviews.
- Both features avoid calling external APIs directly, leveraging the secure and monitored Phase 03.1F foundation.

---

## Testing Verification
Verified using Vitest at `server/tests/library.test.ts`.

### Tested Workflows
- Registering books and digital resources.
- Core library issue and return loop (with fine tracking).
- Real-time AI book recommendations based on context history.
- Aggregating dashboard analytics.

All operations execute strictly within isolated tenant transactional scopes.
