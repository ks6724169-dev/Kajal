# Enterprise Shared Services

## Purpose
The `server/shared/` directory contains cross-cutting concerns and platform utilities used by all business modules. Code here must never depend on a specific business module (e.g., no imports from `server/modules/student/`).

## Principles
- **DRY:** All common logic (encryption, file uploads, notifications, pagination) lives here.
- **Abstraction:** Third-party libraries should be wrapped in provider interfaces.
- **Multi-Tenant:** Shared utilities must respect the active tenant context where applicable.
