# Phase 03.2L - Enterprise Hostel, Accommodation, Mess & Residential Management Platform (EHAMRMP)

## Overview
Phase 03.2L implements the complete Hostel and Residential management infrastructure for Galaxy ERP. This phase covers everything from hostel building taxonomy (building, block, floor, room, bed) to student allocations, visitor tracking, mess management, and facility complaints.

---

## Architectural Components

### 1. Database Migrations (`server/database/migrations/013_hostel_platform.sql`)
- Highly normalized schema mapping physical layouts and workflows.
- Tables include: `hostel_master`, `hostel_building`, `hostel_floor`, `hostel_block`, `hostel_room`, `hostel_bed`, `hostel_allocation`, `hostel_transfer`, `hostel_leave`, `visitor_master`, `visitor_pass`, `gate_pass`, `hostel_complaint`, `hostel_maintenance`, `hostel_inventory`, `hostel_staff`, `warden_master`, `hostel_fee`, `mess_master`, `mess_plan`, `meal_menu`, `meal_attendance`, `laundry_master`, `laundry_transaction`, `room_inspection`, `electricity_reading`, `water_consumption`, `hostel_notice`.
- Includes UUID PKs, Row-Level Security (RLS) for tenant isolation, and audit triggers.

### 2. Domain Entities (`server/entities/HostelDomain.ts`)
- TypeScript models mirroring the DB tables using strict typings extended from `BaseEntity`.

### 3. Repository Layer (`server/repositories/HostelRepository.ts`)
- Robust repository implementations ensuring built-in tenant boundary validation and optimistic locking mechanisms for concurrent room allocations.

### 4. Validation Engine (`server/validators/HostelValidator.ts`)
- Zod schema validation ensuring safety on inputs for operations such as Room Creation, Bed Allocation, Room Transfer, Visitor Registration, and Leave Processing.

### 5. Services Layer
- **`HostelService.ts`**: Orchestrates standard operations like adding buildings/rooms, processing leaves, gate passes, complaints, and laundry logs.
- **`HostelAllocationEngine.ts`**: Safely manages bed state transitions (Vacant <-> Occupied). Ensures atomic bed locking during allocations and transfers.
- **`MessEngine.ts`**: Manages mess plans, daily meal menus, and tracks real-time consumption attendance.
- **`HostelAnalyticsEngine.ts`**: Aggregates raw occupancy and maintenance data into actionable analytics reports.

### 6. Controllers and API Gateway
- **`HostelController.ts`**: Mounts all functional entry points, tying Zod validators to the backend services safely.
- **`hostel.ts`**: Declared routes under `/api/gateway/v1/hostel`.

---

## AI Capabilities
- **Smart Allocation Suggestion**: Uses `aiGateway` to interpret student criteria (e.g. "quiet room", "near stairs") against a dataset of vacant beds to recommend the best fit.
- **Occupancy Forecasting**: Analyzes the generated occupancy report to predict next-semester capacity requirements.
- **Meal Recommendation**: Reviews the current weekly meal menu and suggests nutritional improvements.

---

## Security
- Fully embraces the existing UnitOfWork, RLS, and Tenant Isolation architectures. 
- A student cannot allocate themselves a room. Security middleware in the Gateway ensures only Warden/Hostel Admin scopes access allocation endpoints (role definitions managed at Gateway level).

## Test Verification
- Tested via `server/tests/hostel.test.ts`.
- Validates the atomic bed booking constraint (prevents double-booking).
- Exercises full flow: Hostel -> Building -> Floor -> Room -> Bed -> Allocation -> Transfer.
- Invokes AI routes securely without breaking context boundaries.
- All tests executed successfully in an isolated test database.
