# Authentication Engine & Session Platform APIs

## Overview
This document describes the Phase 03.1B REST API layer for identity, authentication, and session management.

## Endpoints

### `POST /api/auth/login`
Authenticates a user via Email, Phone, or Username.
- **Payload:** `{ "email": "...", "password": "...", "device_fingerprint": "..." }`
- **Response:** `{ "token": "JWT", "refresh_token": "UUID", "user": { ... } }` or `{ "mfa_required": true }`

### `POST /api/auth/logout`
Revokes the current active session.
- **Headers:** `Authorization: Bearer <JWT>`
- **Response:** `{ "status": "ok" }`

### `POST /api/auth/mfa/verify`
Verifies a One-Time Password (OTP) or Authenticator App code.
- **Payload:** `{ "user_id": "UUID", "mfa_code": "123456" }`
- **Response:** JWT and Refresh Tokens upon success.

### `POST /api/auth/passwordless/request`
Generates and sends a Magic Link for passwordless entry.
- **Payload:** `{ "email": "..." }`

### `POST /api/auth/webauthn/register`
Generates a challenge for hardware security keys or Passkeys.
- **Headers:** `Authorization: Bearer <JWT>`

## Security Architecture
- All API routes are protected by Express middleware validating `Authorization: Bearer <JWT>`.
- JWTs carry the `tenant_id` which enforces multi-tenant row-level access in PostgreSQL.
- **Brute Force Protection:** Built into API gateway (Phase 03.1C) and local `security_events` logging.
