# Wiki Module — Implementation Guide

> Answers the five key questions for `modules/wiki`:
>
> 1. How to implement upload/delete (基礎功能)
> 2. How to use Document-AI
> 3. How to use OpenAI Embeddings (`/v1/embeddings`)
> 4. How to use Upstash (Vector + Redis)
> 5. What runs through `functions-python` and what doesn't

---

## Architecture Overview

```
Browser / UI
  │
  ├─ Next.js (Server Actions / Route Handlers)
  │   ├─ Upload init + binary → Firebase Storage
  │   ├─ Register metadata → Firestore documents{status:uploaded}
  │   ├─ RAG query → embed query → vector search → LLM (Genkit)
  │   └─ Ad-hoc embedding → OpenAI /v1/embeddings
  │
  └─ Firestore trigger (documents.status=uploaded)
      └─ functions-python (Cloud Functions)
          ├─ Parse (Document AI / fallback)
          ├─ Clean → Taxonomy → Chunk
          ├─ Embed (OpenAI text-embedding-3-small)
          └─ Persist chunks → status:ready
```

---

## 1. Upload / Delete (基礎功能)

### Upload Flow (3 stages)

The upload is split across **modules/file** (binary + metadata) and **modules/wiki** (domain model):

```typescript
// Stage 1: Initialize upload — get storage path and upload token
import { uploadInitFile } from '@/modules/file'

const initResult = await uploadInitFile({
  workspaceId, organizationId, actorAccountId,
  fileName: 'policy.pdf', mimeType: 'application/pdf', sizeBytes: 1024000,
})
// → { fileId, versionId, uploadPath, uploadToken, expiresAtISO }

// Stage 2: Upload binary to Firebase Storage (client-side)
import { ref, uploadBytesResumable } from '@integration-firebase/storage'
const storageRef = ref(storage, initResult.data.uploadPath)
await uploadBytesResumable(storageRef, fileBlob)

// Stage 3a: Complete upload — marks file active + registers RAG document
import { uploadCompleteFile } from '@/modules/file'
await uploadCompleteFile({
  workspaceId, organizationId, actorAccountId,
  fileId: initResult.data.fileId,
  versionId: initResult.data.versionId,
})
// → Firestore documents{status:uploaded} triggers functions-python worker

// Stage 3b: Create wiki document entity (optional, for wiki-side tracking)
import { uploadWikiDocument } from '@/modules/wiki'
await uploadWikiDocument({
  title: 'Company Policy',
  content: '',  // content populated by ingestion worker
  organizationId,
  workspaceId,
})
```

### Delete (Archive) Flow

```typescript
import { deleteWikiDocument } from '@/modules/wiki'

// Archives the document — sets status to ARCHIVED, excluded from retrieval
const result = await deleteWikiDocument(documentId)
```

### Server Actions Available

| Action | File | Purpose |
|--------|------|---------|
| `uploadWikiDocument` | `interfaces/_actions/wiki-document.actions.ts` | Create wiki document entity |
| `deleteWikiDocument` | `interfaces/_actions/wiki-document.actions.ts` | Archive wiki document |
| `embedWikiDocument` | `interfaces/_actions/wiki-document.actions.ts` | Ad-hoc embed via OpenAI |
| `callDocumentAi` | `interfaces/_actions/wiki-document.actions.ts` | Invoke Document AI via Cloud Function |
| `createWikiPage` | `interfaces/_actions/wiki-page.actions.ts` | Create wiki page |
| `archiveWikiPage` | `interfaces/_actions/wiki-page.actions.ts` | Archive wiki page |
| `updateWikiPage` | `interfaces/_actions/wiki-page.actions.ts` | Update wiki page |

---

## 2. How to Use Document-AI

Document AI runs **exclusively in functions-python** as a Cloud Function callable.

### Architecture

```
Next.js                          functions-python
  │                                │
  │ httpsCallable(                 │ @https_fn.on_call()
  │   'process_document_with_ai',  │ def process_document_with_ai(req):
  │   { contentBase64, fileName }  │   → GoogleCloudDocumentAiProcessor
  │ )                              │   → OCR extraction + classification
  │                                │   → returns { text, document_type, confidence }
```

### Calling from Next.js (Server Action)

```typescript
import { callDocumentAi } from '@/modules/wiki'

const result = await callDocumentAi({
  contentBase64: btoa(fileContent),
  fileName: 'invoice.pdf',
  mimeType: 'application/pdf',
})

if (result.ok) {
  console.log(result.text)          // Extracted text
  console.log(result.documentType)  // Classification result
  console.log(result.confidence)    // Classification confidence
}
```

### Calling from Client Components (Direct)

```typescript
import { functionsApi, getFirebaseFunctions } from '@integration-firebase/functions'

const functions = getFirebaseFunctions()
const processDoc = functionsApi.httpsCallable(functions, 'process_document_with_ai')

const { data } = await processDoc({
  content_base64: btoa(fileContent),
  file_name: 'invoice.pdf',
  mime_type: 'application/pdf',
})
```

### functions-python Implementation

Location: `functions-python/app/document_ai/`

```
document_ai/
├── domain/
│   ├── entities.py      — DocumentAiProcessCommand, DocumentAiProcessResult, DocumentAiClassifyResult
│   └── ports.py         — DocumentAiProcessorPort, DocumentAiClassifierPort, DocumentAiAuditLogRepositoryPort
├── application/
│   └── use_cases/process_document_with_ai.py  — ProcessDocumentWithAIUseCase
├── infrastructure/
│   ├── google/document_ai_processor.py   — OCR Extractor via Document AI
│   ├── google/document_ai_classifier.py  — Document classifier via Document AI
│   └── firebase/audit_log_repository.py  — Firestore audit log
└── interfaces/
    └── callables/process_document_with_ai.py  — Firebase callable handler
```

---

## 3. How to Use OpenAI Embeddings (`/v1/embeddings`)

### Next.js Side (TypeScript)

The `OpenAIEmbeddingRepository` in `infrastructure/repositories/` calls the OpenAI API directly using native `fetch`:

```typescript
import { OpenAIEmbeddingRepository } from '@/modules/wiki'

// Requires OPENAI_API_KEY environment variable
const embedder = new OpenAIEmbeddingRepository(process.env.OPENAI_API_KEY!)

// Single text embedding
const embedding = await embedder.embed({ text: 'What is our refund policy?' })
console.log(embedding.values)      // number[] (1536 dimensions)
console.log(embedding.model)       // 'text-embedding-3-small'
console.log(embedding.dimensions)  // 1536

// Batch embedding (max 20 at a time)
const embeddings = await embedder.embedBatch([
  { text: 'Document chunk 1', documentId: 'doc_abc123' },
  { text: 'Document chunk 2', documentId: 'doc_abc123' },
])
```

### Server Action Wrapper

```typescript
import { embedWikiDocument } from '@/modules/wiki'

// Embeds the document content and returns a CommandResult
const result = await embedWikiDocument(documentId)
```

### Configuration

| Parameter | Default | Notes |
|-----------|---------|-------|
| Model | `text-embedding-3-small` | Configurable in constructor |
| Dimensions | `1536` | Must match Upstash Vector + Firestore index |
| Max batch | `20` | OpenAI rate limit |
| API URL | `https://api.openai.com/v1/embeddings` | Standard endpoint |
| API Key | `OPENAI_API_KEY` env var | Required at runtime |

### functions-python Side (Python)

Location: `functions-python/app/rag_ingestion/infrastructure/openai/embedder.py`

```python
from app.rag_ingestion.infrastructure.openai.embedder import OpenAiEmbedder

embedder = OpenAiEmbedder(settings)
vectors = embedder.embed(chunks)  # list[tuple[float, ...]]
```

The Python embedder uses the `openai` SDK and processes chunks in batches during the ingestion pipeline.

---

## 4. How to Use Upstash (Vector + Redis)

### Upstash Vector — Provisioning Guide

Create a new Vector index at <https://console.upstash.com/vector> with the following settings:

| Setting | Recommended Value | Notes |
|---------|-------------------|-------|
| **Region** | `us-east-1` (Washington D.C.) | Match your Vercel deployment region. Options: `us-east-1` (lad1), `eu-west-1` (dub1), `us-central1` (GCP Iowa) |
| **Index Type** | `DENSE` | Standard float vector embeddings. Alternatives: `SPARSE` (BM25-style), `HYBRID` (dense + sparse) |
| **Dense Embedding Model** | `None` | We use OpenAI `text-embedding-3-small` externally. Alternatives: `BGE_SMALL_EN_V1_5` (384d), `BGE_BASE_EN_V1_5` (768d), `BGE_LARGE_EN_V1_5` (1024d), `BGE_M3` (1024d, multilingual) |
| **Dimensions** | `1536` | Must match the OpenAI `text-embedding-3-small` output dimension |
| **Similarity Function** | `COSINE` | Default; works with normalised embeddings. Alternatives: `DOT_PRODUCT`, `EUCLIDEAN` |
| **Sparse Embedding Model** | `None` | Only needed for `SPARSE`/`HYBRID` index types. Options: `BM25`, `BGE_M3` |

### Upstash Vector — Semantic Search

Client instances are centralised in `@integration-upstash` and re-exported through the wiki persistence layer for module-boundary hygiene.

```typescript
// Module-level client (delegates to @integration-upstash singleton)
import { vectorIndex } from '../../infrastructure/persistence/upstash-vector'

// Upsert a document embedding
await vectorIndex.upsert([{
  id: documentId,
  vector: embedding.values,
  metadata: {
    documentId, organizationId, workspaceId,
    title: 'Policy Document',
    category: 'regulations',
    scope: 'organization',
  },
}])

// Query for similar documents
const results = await vectorIndex.query({
  vector: queryEmbedding.values,
  topK: 5,
  includeMetadata: true,
  filter: 'organizationId = "org_123"',
})
```

### Upstash Redis — Document Storage + Cache

```typescript
import { redisClient } from '../../infrastructure/persistence/upstash-redis'

// Store a document
await redisClient.set('wiki:doc:doc_abc123', JSON.stringify(record))

// Retrieve a document
const doc = await redisClient.get('wiki:doc:doc_abc123')

// Maintain organization membership sets
await redisClient.sadd('wiki:org:org_123', 'doc_abc123')
const orgDocs = await redisClient.smembers('wiki:org:org_123')
```

### Repository Implementations

| Repository | Purpose | Backend |
|------------|---------|---------|
| `UpstashWikiDocumentRepository` | Document CRUD + vector search | Vector + Redis |
| `UpstashRetrievalRepository` | RAG retrieval (searchByVector, searchByMetadata) | Vector + Redis |
| `InMemoryWikiDocumentRepository` | Development/testing stub | In-memory Map |

### Environment Variables

All Upstash credentials are read from the **same** set of environment variables across the entire application. See `.env.example` at the repository root for the full list and provisioning instructions.

```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Upstash Vector
UPSTASH_VECTOR_REST_URL=https://your-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-vector-token

# Upstash QStash (used by Workflow SDK)
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-current-signing-key
QSTASH_NEXT_SIGNING_KEY=your-next-signing-key
```

---

## 5. What Runs Through `functions-python` vs Next.js

### functions-python Owns (Background + High CPU/IO)

| Capability | Location | Trigger |
|------------|----------|---------|
| Document parsing (PDF/DOCX/HTML) | `rag_ingestion/` | Firestore `documents.status=uploaded` |
| Text cleaning + normalization | `rag_ingestion/` | Part of ingestion pipeline |
| Taxonomy classification | `rag_ingestion/` | Part of ingestion pipeline |
| Chunking (deterministic) | `rag_ingestion/` | Part of ingestion pipeline |
| Bulk embedding (OpenAI) | `rag_ingestion/` | Part of ingestion pipeline |
| Chunk persistence to Firestore | `rag_ingestion/` | Part of ingestion pipeline |
| Status transitions (uploaded→processing→ready/failed) | `rag_ingestion/` | Worker lifecycle |
| Document AI OCR extraction | `document_ai/` | `process_document_with_ai` callable |
| Document AI classification | `document_ai/` | `process_document_with_ai` callable |
| Reprocess / backfill / maintenance | `rag_ingestion/` | Admin callable or manual trigger |

### Next.js Owns (Browser-Facing + Auth-Coupled)

| Capability | Location | Entry Point |
|------------|----------|-------------|
| File upload initialization | `modules/file` | `uploadInitFile` Server Action |
| Binary upload to Storage | Client-side | Firebase Storage SDK |
| Upload completion + RAG registration | `modules/file` | `uploadCompleteFile` Server Action |
| Wiki document CRUD | `modules/wiki` | Server Actions |
| Ad-hoc embedding (lightweight) | `modules/wiki` | `embedWikiDocument` Server Action |
| RAG query orchestration | `modules/wiki` | `GetRAGAnswerUseCase` |
| Query embedding | `modules/wiki` | `OpenAIEmbeddingRepository` |
| Vector search | `modules/wiki` | `UpstashRetrievalRepository` |
| Prompt assembly + LLM | `modules/ai` | Genkit flows |
| Streaming UI response | `modules/ai` | Route Handlers |
| Auth/session/cookies | `modules/identity` | Middleware |
| Document AI invocation | `modules/wiki` | `callDocumentAi` Server Action (wraps callable) |

### Decision Heuristic

```
Is it browser-called, needs auth/session, streams UI, or is Genkit-coupled?
  → Place in Next.js

Is it background work, high CPU/IO, replayable, Storage/Firestore-triggered, or admin/reprocess?
  → Place in functions-python
```

### Deployment

```bash
# Deploy Python Cloud Functions
npm run deploy:functions:python

# Deploy Firestore indexes (required before first embedding write)
npm run deploy:firestore:indexes

# Deploy Firestore rules
npm run deploy:rules
```

---

## Module Structure

```
modules/wiki/
├── domain/
│   ├── entities/           WikiDocument, WikiPage, WorkspaceKnowledgeSummary
│   ├── repositories/       IWikiDocumentRepository, IWikiPageRepository, IEmbeddingRepository, IRetrievalRepository
│   ├── services/           deriveKnowledgeSummary (pure function)
│   └── value-objects/      Taxonomy, Embedding, Vector, AccessControl, SearchFilter, etc.
├── application/
│   └── use-cases/          CreateWikiDocument, CreateWikiPage, ArchiveWikiPage, UpdateWikiPage,
│                           GetRAGAnswer, SearchWikiDocuments, GetWorkspaceKnowledgeSummary
├── infrastructure/
│   ├── repositories/       UpstashWikiDocumentRepository, UpstashRetrievalRepository,
│   │                       OpenAIEmbeddingRepository, InMemory* (dev/test)
│   ├── persistence/        Upstash Vector + Redis clients, config
│   └── default/            DefaultWorkspaceKnowledgeRepository (cross-module)
└── interfaces/
    ├── _actions/           wiki-page.actions.ts, wiki-document.actions.ts
    ├── queries/            wiki.queries.ts, knowledge.queries.ts
    ├── components/         WikiHubView, WikiPageView, RagSearchBar, etc.
    ├── api/                WikiController (HTTP facade)
    └── view-models/        WorkspaceEntry
```
