# Galaxy ERP Enterprise AI Provider Layer (Phase 03.1F) - Implementation Documentation

This document describes the design, database schemas, model abstraction layers, validation schemas, and automated fallback routing implemented under **Phase 03.1F: Enterprise AI Provider Interface, AI Gateway & Model Abstraction Platform (EAIPI-AGMAP)**.

---

## 1. Architectural Highlights

Our enterprise-grade abstraction layer decouples the core ERP business modules (e.g., student grading, academic registries, financial tools) from third-party AI provider SDKs.

### Key Components
- **`AIProvider` Interface**: Standardizes Chat, Streaming, Embeddings, Image Analysis, and Document analysis across any LLM backend.
- **Provider Implementations**:
  - `GeminiProvider`: Modern `@google/genai` SDK integration with custom `User-Agent: aistudio-build` header.
  - `OpenAIProvider`: Native high-fidelity REST integration using the `fetch` API.
  - `ClaudeProvider`: Native Anthropic Messages API client with system message transformation.
- **`AIProviderFactory`**: Dynamically instantiates the correct provider based on system properties, tenant settings, or override options.
- **`AIServiceManager`**: Orchestrates high-availability features, including:
  - **Exponential Backoff Retries** for transient failures.
  - **Circuit Breaker** to trip and avoid cascading lag when down streams fail.
  - **Silent Fallbacks** (e.g., Gemini -> OpenAI -> Claude) when primary models time out or fail.
  - **Database Rate Limiting** to protect tenant quotas.
  - **Real-time Cost Logs & Metrics** stored directly in PostgreSQL per tenant/user.
- **`AIGateway`**: Exposes friendly, high-level developer utilities:
  - `chat()`, `summarize()`, `classify()`, `translate()`, `embeddings()`, `generateJSON<T>()`.
- **`AIController` & Express Routes**: Fully-validated API endpoints with Zod payload guards.

---

## 2. Database Schema (007_ai_provider_platform.sql)

The relational tables handle multi-tenant context (`tenant_id`) and isolate usage data via Row Level Security (RLS) policies:

1. `ai_provider_registry`: List of permitted providers.
2. `ai_model_registry`: Registered models, contexts, and token pricing heuristics.
3. `ai_usage_log`: Granular token counter, prompt mapping, and USD spent logs.
4. `ai_request_log`: Request latency tracking, request types, and detailed error tracking.
5. `ai_response_cache`: High-speed prompt-response cache.
6. `ai_api_keys`: Secure, encrypted/isolated third-party API keys.
7. `ai_rate_limits`: Rate limits tracked hourly/daily for tenant safety.
8. `ai_cost_tracking`: Budgets allocated and monthly budget spent metrics.
9. `ai_provider_health`: Latency, health ping histories, and failure rates.

---

## 3. API Routes

All endpoints are hosted under `/api/gateway/v1/ai/`:

- **`GET /providers`**: Returns active, allowed providers.
- **`GET /models`**: Returns registered models, contexts, and capabilities.
- **`POST /chat`**: Universal endpoint for single & multi-turn conversations.
- **`POST /vision`**: Image understanding (supports base64 image data).
- **`POST /ocr`**: Document extraction (supports PDF, Docx, TXT).
- **`POST /summarize`**: Summarizes long text inputs.
- **`POST /translate`**: Translates text into target languages.
- **`POST /embeddings`**: Generates high-dimension vector representations.
- **`POST /recommendation`**: Actionable strategic intervention suggestions.
- **`GET /usage`**: Audit trail for active tenant usage.
- **`GET /cost`**: Month-to-date budget metrics.
- **`GET /health`**: Health ping histories.

---

## 4. Academic Intelligence Integration

The `AcademicIntelligenceEngine` (located in `/server/services/AcademicIntelligenceEngine.ts`) has been refactored. It now routes through the secure `AIGateway` instead of invoking `GoogleGenAI` directly.

This guarantees:
- Token usages are automatically recorded in SQL.
- Rate limits and tenant budgets are honored.
- Fallback logic protects student risk prediction workflows if Google’s API is offline.

---

## 5. Testing & Verification

Comprehensive test suites are defined in **`/server/tests/aiProvider.test.ts`** and verify the following:
- Dynamic provider instantiation.
- High-fidelity mock modes when keys are not configured.
- Automated token log writing, rate limits, and budget tracking.
- Zod schema validator rules for payload integrity.
