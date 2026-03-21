# Python Cloud Functions

**Location:** `libs/firebase/functions-python/`  
**Runtime:** Python (Firebase Functions v2)  
**Deploy:** `npm run deploy:functions:python`  
**Verified:** 2026-03-20

## Architecture Pattern

Python functions follow the same **MDDD + Hexagonal** pattern as the TypeScript codebase:
- `domain/` — entities.py, ports.py
- `application/` — use-case Python files
- `infrastructure/` — adapters (Firebase Firestore, Google APIs, default)
- `interfaces/callables/` — Firebase callable function entry points

## Top-Level Structure

```
libs/firebase/functions-python/
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
└── AGENT.md              Agent instructions for Python functions
```

---

## Bounded Context: `rag_ingestion`

**Purpose:** Process uploaded RAG documents (chunk, embed, classify, store)

### Domain
- `entities.py` — RagChunk, RagChunkDraft, ProcessUploadedDocumentCommand, ProcessUploadedDocumentResult
- `ports.py` — RagParserPort, RagChunkerPort, RagTaxonomyClassifierPort, RagEmbedderPort, RagDocumentRepositoryPort, **ProcessedTextWriterPort** (new)

### Application
- `process_uploaded_document.py` — `ProcessUploadedDocumentUseCase` (accepts optional `text_writer: ProcessedTextWriterPort`)

### Infrastructure
| Sub-path | Adapter | Description |
|----------|---------|-------------|
| `infrastructure/default/` | `chunker.py` | Text chunking adapter |
| `infrastructure/default/` | `embedder.py` | Deterministic 4-dim scaffold embedder |
| `infrastructure/default/` | `parser.py` | PassthroughRagParser (text fallback) |
| `infrastructure/default/` | `taxonomy_classifier.py` | Keyword-based taxonomy classifier |
| `infrastructure/firebase/` | `document_repository.py` | Firestore — mark_processing, save_ready (writes indexedAtISO + chunkCount), mark_failed |
| `infrastructure/firebase/` | `storage_reader.py` | `FirebaseStorageReader` — `read_bytes()` and `read_text()`; alias `FirebaseStorageTextReader` kept for compat |
| `infrastructure/firebase/` | `processed_text_writer.py` | **NEW** — writes extracted text to Storage + patches Firestore indexedAtISO, chunkCount, extractedTextStoragePath |
| `infrastructure/google/` | `document_ai_parser.py` | **NEW** — `DocumentAiRagParser` uses OCR Extractor, reads binary from Storage |
| `infrastructure/google/` | `document_ai_taxonomy_classifier.py` | **NEW** — `DocumentAiTaxonomyClassifier` uses OCR Classifier, maps entity type to taxonomy |

### Interface
- `interfaces/callables/process_uploaded_rag_document.py` — wires Document AI adapters when `DOCUMENTAI_PROJECT_ID` is set; falls back to passthrough otherwise

---

## Bounded Context: `document_ai`

**Purpose:** Process documents using Google Document AI with audit logging (used for client-callable OCR)

### Domain
- `entities.py` — `DocumentAiProcessCommand`, `DocumentAiProcessResult`, **`DocumentAiClassifyResult`** (new — document_type, confidence, raw_entity_types)
- `ports.py` — `DocumentAiProcessorPort`, **`DocumentAiClassifierPort`** (new), `DocumentAiAuditLogRepositoryPort`

### Application
- `process_document_with_ai.py` — `ProcessDocumentWithAIUseCase`

### Infrastructure
| Sub-path | Adapter | Description |
|----------|---------|-------------|
| `infrastructure/firebase/` | `audit_log_repository.py` | Firestore audit log |
| `infrastructure/google/` | `document_ai_processor.py` | **OCR Extractor** (`1516a32299c1709e`) via `ocr_extractor_resource` |
| `infrastructure/google/` | `document_ai_classifier.py` | **NEW** — **OCR Classifier** (`17f1013111dec644`) via `ocr_classifier_resource` |

### Interface
- `interfaces/callables/process_document_with_ai.py` — Firebase callable entry point

---

## Settings (`config/settings.py`)

`DocumentAiSettings` now has two processor IDs:
- `ocr_extractor_processor_id` — env `DOCUMENTAI_OCR_EXTRACTOR_PROCESSOR_ID` → default `1516a32299c1709e`
- `ocr_classifier_processor_id` — env `DOCUMENTAI_OCR_CLASSIFIER_PROCESSOR_ID` → default `17f1013111dec644`
- Both in region `asia-southeast1` (env `DOCUMENTAI_LOCATION`)
- `DOCUMENTAI_PROJECT_ID` is required; controls whether Document AI pipeline is activated

Legacy `DOCUMENTAI_PROCESSOR_ID` still supported as fallback for the extractor.

---

## Storage Paths After Processing

| Type | Path |
|------|------|
| Raw upload | (set by TypeScript upload-init) |
| Extracted text | `organizations/{orgId}/workspaces/{wsId}/extracted/{documentId}.txt` |

---

## Firestore Fields Written by `save_ready`

Beyond `status=ready` and `taxonomy`, the repository now also writes:
- `chunkCount` — total chunk count
- `indexedAtISO` — ISO-8601 timestamp when indexing completed
- `updatedAtISO` — ISO-8601 timestamp

These align with the TypeScript-side `RagDocumentRecord` metadata fields.

---

## Integration with TypeScript

- Python functions are invoked via Firebase callable functions or Firestore triggers
- TypeScript code calls them through `libs/firebase/functions.ts`
- Contracts defined in `docs/adr/` (Python ADRs)
- RAG ingestion contract: `docs/reference/development-contracts/rag-ingestion-contract.md`

## Key ADR Decisions

| ADR | Decision summary |
|-----|-----------------|
| ADR-002 | Python handles CPU-intensive document parsing; TypeScript handles orchestration |
| ADR-003 | langchain, google-cloud-documentai, firebase-admin as core deps |
| ADR-005 | Migrated from TypeScript Cloud Functions to Python for parser + RAG |
| ADR-006 | Full enterprise RAG: chunker → embedder → Upstash Vector |
| ADR-007 | Firestore collections: `knowledge_base/{org}/workspaces/{ws}/{documents|chunks}` |
