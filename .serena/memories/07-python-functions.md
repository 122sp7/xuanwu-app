# Python Cloud Functions

**Location:** `lib/firebase/functions-python/`  
**Runtime:** Python (Firebase Functions v2)  
**Deploy:** `npm run deploy:functions:python`  
**Verified:** 2026-03-19

## Architecture Pattern

Python functions follow the same **MDDD + Hexagonal** pattern as the TypeScript codebase:
- `domain/` — entities.py, ports.py
- `application/` — use-case Python files
- `infrastructure/` — adapters (Firebase Firestore, Google APIs, Upstash)
- `interfaces/callables/` — Firebase callable function entry points

## Top-Level Structure

```
lib/firebase/functions-python/
├── app/
│   ├── bootstrap/         firebase.py — Firebase Admin SDK init
│   ├── config/            settings.py — environment config
│   ├── rag_ingestion/     RAG ingestion bounded context (full MDDD)
│   └── document_ai/       Document AI bounded context (full MDDD)
├── tests/                 Python test suite
├── docs/adr/              7 Python ADRs (ADR-001 ~ ADR-007)
├── main.py                Function entry point registration
├── pyproject.toml         Python project config
├── requirements.txt       Production dependencies
├── requirements-dev.txt   Dev dependencies
└── AGENTS.md              Agent instructions for Python functions
```

---

## Bounded Context: `rag_ingestion`

**Purpose:** Process uploaded RAG documents (chunk, embed, classify, store)

### Domain
- `entities.py` — RagDocument, RagChunk
- `ports.py` — IDocumentRepository, IChunker, IEmbedder, IParser, ITaxonomyClassifier

### Application
- `process_uploaded_document.py` — `ProcessUploadedDocumentUseCase`

### Infrastructure
| Sub-path | Adapter | Description |
|----------|---------|-------------|
| `infrastructure/default/` | `chunker.py` | Text chunking adapter |
| `infrastructure/default/` | `embedder.py` | Embedding model adapter |
| `infrastructure/default/` | `parser.py` | Document parser adapter |
| `infrastructure/default/` | `taxonomy_classifier.py` | Auto classification |
| `infrastructure/firebase/` | `document_repository.py` | Firestore document store |

### Interface
- `interfaces/callables/process_uploaded_rag_document.py` — Firebase callable entry point

---

## Bounded Context: `document_ai`

**Purpose:** Process documents using Google Document AI with audit logging

### Domain
- `entities.py` — Document, ProcessingResult
- `ports.py` — IDocumentAIProcessor, IAuditLogRepository

### Application
- `process_document_with_ai.py` — `ProcessDocumentWithAIUseCase`

### Infrastructure
| Sub-path | Adapter | Description |
|----------|---------|-------------|
| `infrastructure/firebase/` | `audit_log_repository.py` | Firestore audit log |
| `infrastructure/google/` | `document_ai_processor.py` | Google Document AI API adapter |

### Interface
- `interfaces/callables/process_document_with_ai.py` — Firebase callable entry point

---

## Integration with TypeScript

- Python functions are invoked via Firebase callable functions
- TypeScript code calls them through `lib/firebase/functions.ts`
- Contracts defined in `docs/adr/` (Python ADRs) and `docs/adr/ADR-011` (Genkit flow contract)
- RAG ingestion contract: `docs/reference/development-contracts/rag-ingestion-contract.md`

## Key ADR Decisions

| ADR | Decision summary |
|-----|-----------------|
| ADR-002 | Python handles CPU-intensive document parsing; TypeScript handles orchestration |
| ADR-003 | langchain, google-cloud-documentai, firebase-admin as core deps |
| ADR-005 | Migrated from TypeScript Cloud Functions to Python for parser + RAG |
| ADR-006 | Full enterprise RAG: chunker → embedder → Upstash Vector |
| ADR-007 | Firestore collections: `rag_documents`, `rag_chunks` |
