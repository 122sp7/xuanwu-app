# Firebase Functions (Python)

This codebase is configured as `functions-python` in `firebase.json` with runtime `python311`.

Its role is **not** to become a second full application server.  
Its role is to be the **Firebase worker / ingestion runtime** for document processing, parsing,
taxonomy, chunking, embedding, and other heavy background responsibilities that should not live in
the Next.js request/response path.

Canonical ADR governance and migration decisions now live in
`lib/firebase/functions-python/docs/adr/README.md` and the ADR files in that directory. Treat those
documents as the source of truth for runtime boundaries, dependency policy, structure, and
replacement planning for `lib/firebase/functions`.

---

## ADR · Architecture Decision Record

### ADR-001 · Split responsibilities by runtime, not by convenience

**Status:** Accepted

**Decision**
- **Next.js** is the user-facing edge:
  - UI
  - auth/session/cookies
  - upload flows
  - Route Handlers / Server Actions
  - Genkit query orchestration
  - streaming answers back to the browser
- **functions-python** is the worker/runtime for ingestion and heavy document processing:
  - parse raw files
  - clean/normalize text
  - document taxonomy
  - chunking
  - embedding generation
  - chunk persistence / status transitions
  - internal reprocess/backfill/admin entrypoints

**Why**
- Python has stronger long-term ergonomics for document parsing and AI/data pipelines.
- Next.js should remain responsive and focused on request/response orchestration.
- Keeping user APIs in Next.js avoids spreading auth, validation, and UX logic across runtimes.

**Consequence**
- Browser-facing APIs should default to **Next.js first**.
- Python Functions should be invoked by:
  - Firebase triggers
  - internal/admin callable endpoints
  - server-to-server orchestration when background processing is required

### ADR-002 · Firestore is the canonical metadata store and the first vector store

**Status:** Accepted

**Decision**
- Store document metadata in `documents`
- Store chunk records in `chunks`
- Store embeddings alongside chunks for Firestore vector search

**Why**
- The current target is a medium-scale Firebase-native architecture.
- Firestore reduces operational complexity by acting as both application DB and vector-search
  backing store.

**Consequence**
- Do not create a second canonical document store inside functions-python.
- Python Functions prepare and write canonical ingestion outputs; Next.js reads and queries them.

### ADR-003 · Ingestion order is fixed

**Status:** Accepted

**Decision**
The ingestion pipeline order is:

1. Parse
2. Clean / normalize
3. Document-level taxonomy
4. Chunk / structure
5. Chunk-level metadata
6. Embedding
7. Persist chunks
8. Mark document ready

**Why**
- Taxonomy belongs after text extraction but before chunking so both the whole document and each
  chunk inherit stable classification context.
- Embeddings are an ingestion-time cost, not a query-time cost.

**Consequence**
- Do not embed before parsing/cleaning.
- Do not move taxonomy after query time.

### ADR-004 · Query orchestration stays in Next.js + Genkit

**Status:** Accepted

**Decision**
The query pipeline belongs in Next.js:

1. User query arrives in Next.js
2. Route Handler / Server Action validates input
3. Genkit preprocesses the query
4. Query embedding is generated
5. Firestore vector search retrieves top-k chunks
6. Context is assembled
7. Genkit/LLM generates the final answer
8. Next.js streams the response to the UI

**Why**
- Query flows are latency-sensitive and closely tied to product UX.
- Streaming, auth, request context, and conversation state are better handled in Next.js.

**Consequence**
- functions-python should **not** own chat streaming or primary query APIs.
- RAG answer generation APIs should be exposed from Next.js, not directly from Python Functions.

### ADR-005 · functions-python should expose worker APIs, not product APIs

**Status:** Accepted

**Decision**
- Primary long-term entrypoint: **Firebase-triggered background processing**
- Secondary entrypoint: **manual/internal callable for reprocess/testing/admin**

**Why**
- Public product APIs are easier to govern in one place: Next.js.
- Background workers should remain idempotent and safe to retry.

**Consequence**
- The existing `process_document_with_ai` callable is acceptable as a scaffold/manual entrypoint.
- The long-term ingestion path should prefer Storage / Firestore driven background execution.

### ADR-006 · MDDD boundaries remain strict inside functions-python

**Status:** Accepted

**Decision**
- `interfaces` receives trigger/callable payloads only
- `application` orchestrates workflows only
- `domain` holds pure entities + ports only
- `infrastructure` talks to Firebase / Google Cloud / external SDKs only

**Why**
- This keeps the worker code testable and prevents the document pipeline from collapsing into one
  giant SDK-coupled function.

**Consequence**
- Do not import Google/Firebase SDK code into `domain`.
- Do not bypass `application` from `interfaces`.

---

## Runtime Boundary: Next.js vs functions-python

### functions-python owns

- Background ingestion execution
- File download / raw binary access
- Parsing (`PDF / DOCX / HTML -> text`)
- Cleaning / normalization
- Document-level taxonomy
- Chunking / structuring
- Chunk-level metadata generation
- Embedding generation
- Writing document/chunk processing outputs to Firestore
- Updating processing status (`uploaded -> processing -> ready`)
- Reprocess / backfill / admin-safe worker entrypoints

### Next.js owns

- Upload UI and browser interaction
- Authentication / authorization
- Creating initial document metadata
- Starting uploads to Firebase Storage
- Route Handlers / Server Actions
- Query preprocessing with Genkit
- Vector search orchestration for end-user queries
- Prompt building and final answer generation
- Streaming answers to the browser
- Feedback collection, cache strategy, and product-facing APIs

### Do **not** put these in functions-python

- Browser session handling
- cookies/headers based auth
- page rendering
- conversational UI state
- primary streaming chat endpoints
- product-specific response shaping for the web UI

---

## End-to-End Target Flow

### ① Ingestion Pipeline

```text
[Next.js upload]
        ↓
[Firebase Storage raw file]
        ↓
[Firestore documents metadata: status=uploaded]
        ↓
[Cloud Functions (Python) trigger / worker]
        ↓
[Download file]
        ↓
[Parsing]
        ↓
[Cleaning]
        ↓
[Document taxonomy]
        ↓
[Chunking / structuring]
        ↓
[Chunk metadata]
        ↓
[Embedding]
        ↓
[Firestore chunks + embedding]
        ↓
[Vector index ready]
        ↓
[Document status = ready]
```

### ② Query Pipeline

```text
[Next.js user query]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit query preprocess]
        ↓
[Query embedding]
        ↓
[Firestore vector search]
        ↓
[Top-K chunks]
        ↓
[Prompt/context building]
        ↓
[Genkit LLM answer generation]
        ↓
[Next.js streaming UI response]
```

### ③ Optional enterprise enhancements

- **Hybrid retrieval**: keyword search + vector search + rerank  
  - Query-time orchestration stays in **Next.js**
  - functions-python may prepare derived fields if ingestion support is needed
- **Re-ranking**
  - Keep orchestration in **Next.js / Genkit**
- **Cache**
  - Keep query hash/cache policy in **Next.js** or shared infra
- **Feedback loop**
  - Collect via **Next.js**
  - Store in Firestore
  - Use later for ranking/prompt improvements

---

## API Placement Decision

### APIs that should live in Next.js

These are the APIs Copilot should default to when designing product-facing behavior:

- upload initialization / file submission
- document list / detail / status query
- workspace-scoped read APIs
- query / chat / RAG answer endpoints
- streaming answer endpoints
- feedback submit endpoints
- cache-aware query endpoints
- any API that depends on user auth/session or browser UX

### APIs that may live in functions-python

These are worker/admin/internal surfaces:

- Firebase Storage trigger for new raw files
- Firestore-triggered reprocess pipelines
- manual callable for internal `process_document_with_ai`
- admin HTTP/callable reindex/backfill endpoints
- scheduled maintenance tasks for ingestion/index health

### Practical rule for Copilot

If an endpoint is **used directly by the browser or Next.js page flow**, put it in **Next.js**.  
If an endpoint is **background, heavy, retryable, or admin/internal**, put it in
**functions-python**.

---

## Firestore Target Data Shape

### `documents`

- `id`
- `title`
- `status` (`uploaded | processing | ready`)
- `taxonomy`
- `createdAt`

### `chunks`

- `id`
- `docId`
- `text`
- `embedding`
- `taxonomy`
- `page`
- `chunkIndex`

---

## Current Scaffold Mapping

Current files in this codebase already map to the first Document AI slice:

- `main.py`: Firebase Functions entrypoint
- `app/bootstrap`: Firebase Admin bootstrap
- `app/config`: environment-based settings
- `app/document_ai/domain`: core command/result + ports
- `app/document_ai/application`: use-case orchestration
- `app/document_ai/infrastructure/google`: Google Document AI adapter
- `app/document_ai/infrastructure/firebase`: Firebase audit log repository
- `app/document_ai/interfaces/callables`: callable adapter

This is a **foundation**, not the full ingestion/query platform yet.

When extending the codebase, prefer adding new worker capabilities that follow the ADRs above:

- ingestion trigger
- parser adapters
- chunk/embedding persistence
- reprocess/backfill workers

Do **not** turn this codebase into a parallel Next.js app server.

---

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Local sanity check

```bash
python -m compileall -q .
```
