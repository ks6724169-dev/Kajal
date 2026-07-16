# Enterprise Transaction Engine

## Overview
Galaxy ERP requires strict ACID compliance when dealing with billing, enrollments, and audit logs. The `TransactionManager` abstracts the `pg` transaction lifecycle.

## Features
- **Strict Scope Lifecycle:** Enforces `.commit()` or `.rollback()`. Attempting to start nested transactions without Savepoints yields errors.
- **Savepoints:** Supported to allow partial rollback of batch tasks without failing the parent transaction.
- **Isolation Levels:** Supports dynamic transition to `SERIALIZABLE` or `REPEATABLE READ` for financial ledgers.
- **Connection Release Security:** Guaranteed `client.release()` ensures pool exhaustion is impossible under high load.
