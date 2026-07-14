# API Layer

This folder is the front-end boundary for all server communication. Modules should call typed service functions from here instead of calling `fetch` directly. The layer centralizes base URLs, tenant headers, request IDs, JSON parsing, and normalized API errors so the SaaS can grow behind a gateway/BFF without rewriting feature modules.
