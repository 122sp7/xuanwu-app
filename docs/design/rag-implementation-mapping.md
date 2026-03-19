# RAG Implementation Mapping (Flow -> Folder -> Dependency)

This guide maps each flow section in `docs/design/rag-enterprise-e2e.mermaid` to concrete implementation locations in this repo.

## 1) ① Ingestion Pipeline - where to implement

### 1.1 Next.js upload + trigger side

Owner: Next.js

Place code in these layers:
- interfaces layer: add/extend upload API facade under `interfaces/rest`
- infrastructure layer: Storage + Firestore adapters under `infrastructure/firebase` and module-level `modules/*/infrastructure/firebase`
- app layer: upload page/form orchestration under `app/(shell)`

Existing anchors:
- `interfaces/rest/apiRouter.ts`
- `infrastructure/firebase/client.ts`
- `infrastructure/firebase/admin.ts`

Node dependencies to use:
- `firebase` (Storage upload + Firestore metadata)
- `zod` (UploadRequest validation)
- `axios` (if trigger worker through HTTP/Callable gateway)

### 1.2 functions-python document parsing side

Owner: functions-python

Place code in these layers (already scaffolded):
- interfaces: callable payload parsing and request validation
- application: use-case orchestration (parse -> normalize -> taxonomy -> chunk -> persist)
- domain: entities + ports for strict contracts
- infrastructure/google: Document AI adapter
- infrastructure/firebase: Firestore write model and audit logs

Existing anchors:
- `lib/firebase/functions-python/main.py`
- `lib/firebase/functions-python/app/document_ai/interfaces/callables/process_document_with_ai.py`
- `lib/firebase/functions-python/app/document_ai/application/use_cases/process_document_with_ai.py`
- `lib/firebase/functions-python/app/document_ai/domain/entities.py`
- `lib/firebase/functions-python/app/document_ai/domain/ports.py`
- `lib/firebase/functions-python/app/document_ai/infrastructure/google/document_ai_processor.py`
- `lib/firebase/functions-python/app/document_ai/infrastructure/firebase/audit_log_repository.py`

Python dependencies to use:
- `firebase-functions`
- `firebase-admin`
- `google-cloud-documentai`
- `google-cloud-documentai-toolbox`
- `google-cloud-storage`
- `google-cloud-firestore`
- `langchain-text-splitters`

Dependency source:
- `lib/firebase/functions-python/requirements.txt`

### 1.3 Recommended ingestion implementation split (direct coding checklist)

1. Upload endpoint (Next.js): validate input, upload raw file, create `documents` metadata with `status=uploaded`.
2. Worker trigger contract: pass `organizationId`, `workspaceId`, `sourceFileName`, `mimeType`, `contentBase64` (or storage reference in next iteration).
3. Document AI parse in functions-python adapter.
4. Application layer orchestrates normalize -> taxonomy -> chunk.
5. Persist chunk vectors and document status transitions (`processing` -> `ready`/`failed`).
6. Keep the current skeleton embedding dimension aligned with `firestore.indexes.json` until a real embedding model is selected; update both together when moving beyond the deterministic scaffold.
7. Write traces/audit logs for retry and observability.

## 2) ② Query Pipeline - where to implement

Owner: Next.js + knowledge-core adapters

Place code in these layers:
- interfaces/app route: query entry in app/API boundary
- core application layer: query orchestration use-case(s)
- core infrastructure layer: vector/redis retrieval adapters

Existing anchors:
- `core/knowledge-core/interfaces/api/knowledge.controller.ts`
- `core/knowledge-core/infrastructure/repositories/upstash-knowledge.repository.ts`
- `core/knowledge-core/infrastructure/persistence/upstash-vector.ts`

Dependencies to use:
- `genkit`
- `@genkit-ai/google-genai`
- `@tanstack/react-query`
- `@upstash/vector`
- `@upstash/redis`

## 3) ③ Optional enterprise enhancements - where to implement

### 3.1 Hybrid retrieval / rerank
- Implement in `core/knowledge-core/infrastructure/repositories` adapters.
- Reuse `@upstash/vector` and extend with keyword channel in same adapter boundary.

### 3.2 Cache / feedback loop
- Cache: `@upstash/redis` in infrastructure persistence.
- Feedback: Firestore adapter in module-level `modules/*/infrastructure/firebase`.

## 4) Dependency package matrix (quick start)

### 4.1 Already available in Node package.json
- `firebase`
- `genkit`
- `@genkit-ai/google-genai`
- `zod`
- `axios`
- `@tanstack/react-query`
- `@upstash/redis`
- `@upstash/vector`
- `xstate`
- `zustand`

Source:
- `package.json`

### 4.2 Already available in functions-python requirements
- `firebase-functions`
- `firebase-admin`
- `google-cloud-documentai`
- `google-cloud-documentai-toolbox`
- `google-cloud-aiplatform`
- `google-cloud-storage`
- `google-cloud-firestore`
- `langchain-text-splitters`

Source:
- `lib/firebase/functions-python/requirements.txt`

## 5) Deployment commands for this flow

- `npm run deploy:functions:python`
- `npm run deploy:firestore:indexes`
- `npm run deploy:rules`

Source:
- `package.json`

## 6) Suggested implementation order (small, reviewable slices)

1. Ingestion contract finalization (payload + status lifecycle).
2. functions-python parse and Firestore write-back completion.
3. Query use-case path with basic vector retrieval.
4. Observability (traces/latency/cost) and retry queue.
5. Optional hybrid retrieval, cache, and feedback loop.

## 7) Organization / workspace scope and vector efficiency

In Xuanwu, the organization is the tenant boundary and the workspace is the working set boundary.

- Store `organizationId` on every document and chunk to keep the canonical corpus reusable across the organization.
- Store `workspaceId` on every document and chunk to support narrower workspace-only retrieval when the user is operating in one workspace.
- Compute embeddings once during ingestion, then reuse them for both workspace-level and organization-level retrieval.

This maximizes benefit because the same embedded corpus can serve:

1. workspace-focused retrieval with tighter filters and lower prompt noise
2. organization-wide retrieval for shared knowledge reuse
3. taxonomy-filtered retrieval to reduce vector-search cost and context size

Vectors do not lower the overall benefit when they are generated once in ingestion and reused at query time. Efficiency drops only when the system re-embeds too often, skips organization/workspace filters, or sends too many irrelevant chunks into generation.
