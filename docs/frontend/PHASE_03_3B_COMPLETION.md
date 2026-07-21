# GALAXY ERP ENTERPRISE SUITE
## Phase 03.3B — Enterprise Authentication, Identity, Tenant Selection & Intelligent Login Experience Platform (EAITILP)

This Capstone Phase introduces the production-ready front-end authentication, multi-factor credential handshake, white-labeled tenant discoverability, and session telemetry layers.

---

### 1. Unified Architectural Capabilities

*   **Secure Ingress Credentials (`AuthService.ts`)**: Supports secure authentication handshakes, real-time keyboard CAPS LOCK warning triggers, and layout language telemetry warnings to prevent typing failures.
*   **Token Lifecycle Rotation (`TokenManager.ts`)**: Standardized secure token storage using local storage / session storage, automatic expiration audits, and JWT parsing utilities.
*   **Session Management & Telemetry (`SessionManager.ts`)**: Integrates real-time idle timeouts (15 minutes), forced sign-outs, concurrent session alerts, and active connection termination.
*   **Tenant Selection & Discovery (`TenantManager.ts`)**: Automates white-labeled portal selection, matching colors, and institution-specific branding based on subdomain or custom school code.
*   **Interactive Multi-Factor Challenges (`MFAService.ts`)**: Handles verification codes via SMS/Email OTP, authenticator app TOTPs, and 8-digit emergency recovery codes.
*   **Browser Fingerprinting (`DeviceTrustService.ts`)**: Calculates browser device fingerprints to remember trusted systems for 30 days and bypass subsequent MFA prompts.

---

### 2. UI/UX Custom Widgets Developed

1.  **`LoginForm`**: An intuitive credential entry panel, featuring a password-visibility toggle, CAPS LOCK indicators, and a password strength metric.
2.  **`MFAChallenge`**: Supports app-based TOTPs, countdown timers for OTP resends, and recovery rescue fallback forms.
3.  **`TenantSelector`**: Provides list options for institutional portals (Apex, Galaxy Tech, St. Xaviers) and a search box for quick school-code matches.
4.  **`PasswordStrength`**: Renders real-time strength bars with contextual advice for upper/lower, numeric, and special character checks.
5.  **`RememberDevice`**: Allows users to check "Trust this device" and name system connections.
6.  **`DeviceCard` & `SessionCard`**: Renders structured active device logins with IP address, browser metadata, physical location, and instant revoke action buttons.
7.  **`AuthSkeleton`**: Polished high-contrast skeleton states while loading credentials or processing handshakes.

---

### 3. Route Security Guards

*   **`AuthGuard`**: Restricts view segments to verified authenticated logins, redirecting outsiders to portals.
*   **`PermissionGuard`**: Enforces strict RBAC/ABAC capabilities (e.g., `edit_finance`, `take_attendance`) directly in the UI.
*   **`RoleGuard`**: Ensures portal views are restricted to selected role contexts.
*   **`TenantGuard`**: Scopes module cards to matched institutional types (e.g. college vs. K-12).

---

### 4. Reactive State Stores

*   **`authStore.ts`**: Subscribable singleton that keeps users, authentication statuses, active permissions, and MFA ticket variables synchronized across components.
*   **`sessionStore.ts`**: Handles concurrent login warnings and tracks active devices.
*   **`tenantStore.ts`**: Manages customer tenant contexts and provides styling assets.

---

### 5. Verification Metrics

*   **Linter Compilation Status**: Pass (`tsc --noEmit` returns `0` errors).
*   **Strict Mode Integration**: 100% compliant with React 19 rules and Tailwind CSS v4 guidelines.
