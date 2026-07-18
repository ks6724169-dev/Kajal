# Phase 03.2H - Enterprise Communication, Notification & Messaging Platform (ECNMP)

## Overview
Phase 03.2H implements a comprehensive communication and messaging backbone for the Galaxy ERP platform. It supports in-app notifications, internal messaging, announcements, circulars, broadcasts, and scheduling reminders, alongside queueing infrastructure for external channels like Email, SMS, WhatsApp, and Push Notifications.

---

## Architectural Components

### 1. Database Migrations (`server/database/migrations/009_communication_platform.sql`)
- Created required tables: `notification_master`, `notification_template`, `announcement_master`, `circular_master`, `conversation_master`, `message_master`, `attachment_master`, `broadcast_master`, `broadcast_recipient`, `notification_log`, `email_queue`, `sms_queue`, `whatsapp_queue`, `push_queue`, `reminder_master`, `event_invitation`, `notification_preference`, `device_token`, `delivery_status`.
- Used UUID primary keys, JSONB for unstructured data (target audiences, preferences).
- Row-Level Security (RLS) policies implemented for tenant isolation on all tables.
- Linked existing `fn_trigger_audit_logger` for comprehensive audit logging on all DML operations.

### 2. Domain Entities (`server/entities/CommunicationDomain.ts`)
- Defined all the above models extending the standard `BaseEntity`.

### 3. Repository Layer (`server/repositories/CommunicationRepository.ts`)
- Configured individual repositories for each entity extending `BaseRepository`.
- Supports pagination, soft-deletes, multi-tenancy, and optimistic locking out of the box.

### 4. Validation Engine (`server/validators/CommunicationValidator.ts`)
- Zod schemas implemented for endpoints (Send Notification, Create Announcement, Create Circular, Send Message, Send Broadcast, Schedule Reminder).

### 5. Services Layer
- **`TemplateEngine.ts`**: Provides basic variable interpolation parsing for generic notification templates.
- **`NotificationEngine.ts`**: Manages queuing mechanisms for external channels (Email, SMS, Push) and saves internal in-app notifications.
- **`MessagingEngine.ts`**: Handles internal chats (one-to-one, group) and tracks conversations. Connects to AI Gateway to suggest tone improvements for messages.
- **`ReminderEngine.ts`**: Schedules alerts with precise targeting (fee, homework, attendance).
- **`CommunicationService.ts`**: Orchestrates high-level business flows like Announcements, Circulars (with AI auto-summary), and Broadcasts.

### 6. Controllers and API Gateway
- **`CommunicationController.ts`**: Express endpoints handling requests and validating payloads.
- **`communication.ts`**: Defines routes mapping to the controller.
- Integrated into `/api/gateway/v1/communication`.

---

## AI Gateway Integration
The module securely leverages `aiGateway` from Phase 03.1F for:
- Auto-summarizing circulars upon creation.
- Translating announcements (simulated).
- Improving message tone (smart rewrite).
Business logic never connects directly to OpenAI, Gemini, or Claude, ensuring consistency, cost tracking, and security.

---

## Test Verification

Verified using Vitest at `server/tests/communication.test.ts`.

### Tested Workflows
- Sending in-app notifications.
- Creating announcements and circulars.
- Internal messaging (sending messages to conversations).
- Scheduling reminders.
- Sending broadcasts (creating broadcast messages and recipient entries).
- Queuing emails via the Notification Engine.

All tests compile, lint, build, and pass securely within isolated tenant transactions.
