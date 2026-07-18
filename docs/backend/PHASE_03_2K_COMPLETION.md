# Phase 03.2K - Enterprise Transport, Fleet, GPS & Student Mobility Platform (ETFGSMP)

## Overview
Phase 03.2K introduces comprehensive Transport and Fleet management into the Galaxy ERP suite. This platform is designed to manage vehicle lifecycles, route tracking, driver allocations, student boarding, emergency handling, and intelligent routing.

---

## Architectural Components

### 1. Database Migrations (\`server/database/migrations/012_transport_platform.sql\`)
- Created full schema covering vehicles, drivers, conductors, routes, route stops, students mapping, trip logs, GPS locations, alerts, and fuel/maintenance tracking.
- Row-Level Security (RLS) policies implemented for multi-tenant isolation.
- Built-in audit triggers for robust history tracking.

### 2. Domain Entities (\`server/entities/TransportDomain.ts\`)
- Mapped all transport models rigorously using TypeScript interfaces extending \`BaseEntity\`.

### 3. Repository Layer (\`server/repositories/TransportRepository.ts\`)
- Repository pattern implemented for all models ensuring unified query scoping, transaction boundaries, and pagination support.

### 4. Validation Engine (\`server/validators/TransportValidator.ts\`)
- Enforced strict Zod schemas to guarantee data correctness for Vehicle additions, Driver details, Routing paths, Trip commands, and GPS location streams.

### 5. Services Layer
- **\`TransportService.ts\`**: Core business service controlling entities (Vehicles, Drivers, Routes, Trips). Embeds \`UnitOfWork\` pattern to ensure atomicity. Generates system notifications (e.g. for Emergencies).
- **\`FleetEngine.ts\`**: Analyzes holistic fleet health using breakdown and maintenance frequencies to generate actionable scores.
- **\`GPSEngine.ts\`**: Ingests high-frequency GPS ping data for Live Tracking via optimized inserts.
- **\`RouteOptimizationEngine.ts\`**: Passes raw Stop data context into the \`aiGateway\` to predict and suggest the most time/fuel-efficient traversal paths.
- **\`VehicleAnalyticsEngine.ts\`**: Calculates ROI metrics (fuel cost vs usage) and streams structured data to the AI to interpret vehicle health statements.

### 6. Controllers and API Gateway
- **\`TransportController.ts\`**: Connects validators with services cleanly.
- **\`transport.ts\`**: Mapped to \`v1Router.use('/transport', transportRoutes)\`.

---

## AI Capabilities
- **Route Optimization**: Instead of costly external routing APIs, utilizes the in-house LLM capabilities (via \`aiGateway\`) to provide human-readable routing improvements given lat/long stops.
- **Vehicle Health Check**: Contextual AI insights for specific vehicles based on historic fuel consumption and repair logs.

---

## Security
- Inherits the robust ERP security model: JWT, RBAC, and ABAC scopes.
- Strict tenant isolation blocks any multi-tenant leakage at the DB layer via Policy evaluation.

## Test Verification
Verified using Vitest at \`server/tests/transport.test.ts\`.
All workflows (Vehicle/Route mapping, GPS ingest, Emergency Triggers, AI processing) pass strictly with zero dependency errors, guaranteeing architectural continuity.
