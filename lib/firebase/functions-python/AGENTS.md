# Functions-Python Agent Contract

## Mission
- This directory is the **Firebase Python worker runtime** for document ingestion and heavy AI/data
  processing.
- Treat **Next.js** as the user-facing application edge.
- Treat **functions-python** as the background worker / internal callable / trigger execution layer.

## Dependency Direction
- `interfaces -> application -> domain <- infrastructure`
- `bootstrap` and `config` support the runtime but do not replace the core layer boundaries.
- `domain` must remain pure: no Firebase SDK, Google SDK, HTTP framework, or file-system coupling.

## Ownership Boundary

### functions-python owns
- parsing raw files
- cleaning / normalization
- document-level taxonomy
- chunking / structuring
- chunk metadata generation
- embedding generation
- Firestore chunk persistence
- document status transitions for ingestion
- background retryable jobs
- reprocess / backfill / admin-safe worker entrypoints

### Next.js owns
- browser-facing APIs
- upload UX
- auth/session-aware endpoints
- Route Handlers / Server Actions
- Genkit query orchestration
- vector-search request orchestration
- prompt building and streamed answers
- feedback collection and product response shaping

## API Placement Rule
- If the browser or page flow calls it directly, put it in **Next.js**.
- If it is background, retryable, heavy, or admin/internal, put it in **functions-python**.

## Pipeline Contract

### Ingestion
- Next.js uploads file and creates `documents` metadata
- functions-python reads the raw file and performs:
  1. parse
  2. clean
  3. taxonomy
  4. chunk
  5. chunk metadata
  6. embedding
  7. Firestore writes
  8. mark document ready

### Query
- Query orchestration stays in Next.js:
  - query preprocess
  - query embedding
  - Firestore vector search
  - prompt assembly
  - Genkit LLM response
  - streaming UI response

## Guardrails For Copilot
- Do not add chat streaming endpoints here.
- Do not move auth/session logic into this codebase.
- Do not bypass `application` from `interfaces`.
- Do not put SDK-specific payloads into `domain`.
- Prefer idempotent worker design because triggers and retries are expected.

## Current Implemented Slice
- `process_document_with_ai` callable
- Document AI settings loading
- Google Document AI processor adapter
- Firebase audit log repository
- MDDD scaffolding for future ingestion expansion

## Preferred Next Extensions
1. Storage-triggered ingestion entrypoint
2. parser/cleaning adapters
3. chunk persistence + embedding persistence
4. reprocess/backfill worker APIs
5. ingestion status/audit observability
