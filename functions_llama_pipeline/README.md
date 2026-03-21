# Functions Llama Pipeline

> **Status: Beta** — This is a standalone LlamaIndex Cloud RAG pipeline that runs as a separate
> Firebase Functions codebase. It does **not** conflict with `functions-python`.

## Overview

This codebase implements all 13 layers of the RAG pipeline using:
- **LlamaParse** — Agentic OCR and document parsing (Layers 1, 2, 4)
- **LlamaIndex Core** — Chunking, embedding, indexing, retrieval, reranking, generation (Layers 7–13)
- **Firestore** — Persistent chunk storage and document lifecycle (Layer 9)
- **OpenAI** — Embedding (text-embedding-3-small) and LLM (gpt-4o-mini)
- **Cohere** — Optional reranking (rerank-english-v3.0)

## Pipeline Separation

| Field | `functions-python` | `functions_llama_pipeline` |
|-------|-------------------|--------------------------|
| Codebase ID | `functions-python` | `functions-llama-pipeline` |
| Trigger filter | `pipeline` is absent or `"default"` | `pipeline == "llama"` |
| Deploy command | `npm run deploy:functions:python` | `npm run deploy:functions:llama` |

Documents are routed by the `pipeline` field in the Firestore document record.

## Setup

### 1. Environment Variables

Add the following to your `.env` or Firebase Functions configuration:

```bash
LLAMA_CLOUD_API_KEY=llx-...         # Required — LlamaIndex Cloud API key
OPENAI_API_KEY=sk-...               # Required — OpenAI API key
COHERE_API_KEY=...                  # Optional — for Cohere reranking
LLAMA_EMBEDDING_MODEL=text-embedding-3-small
LLAMA_EMBEDDING_DIMENSIONS=1536
LLAMA_LLM_MODEL=gpt-4o-mini
LLAMA_RERANK_MODEL=rerank-english-v3.0
LLAMA_CHUNK_SIZE=512
LLAMA_CHUNK_OVERLAP=64
```

### 2. Install Dependencies

```bash
cd functions_llama_pipeline
pip install -r requirements.txt
```

### 3. Local Validation

```bash
python -m compileall -q .
```

### 4. Deploy

```bash
npm run deploy:functions:llama
```

## Firebase Functions

| Function | Type | Description |
|----------|------|-------------|
| `llama_ingest_document` | Callable | Manually trigger document ingestion |
| `llama_rag_query` | Callable | Run a RAG query with retrieval + reranking |
| `llama_ingest_on_create` | Firestore trigger | Auto-ingest documents with `pipeline="llama"` |

## Architecture

```
[Upload] → [LlamaParse OCR] → [Taxonomy] → [Preprocess] → [Chunk] → [Embed] → [Firestore]
                                                                                      ↓
[User Query] → [Embed Query] → [Vector Search] → [Filter] → [Rerank] → [LLM Generate]
```

## Directory Structure

```
functions_llama_pipeline/
├── app/
│   ├── bootstrap/firebase.py        Firebase Admin init
│   ├── config/settings.py           Environment configuration
│   └── rag_pipeline/
│       ├── domain/
│       │   ├── entities.py           Pure domain entities
│       │   └── ports.py              Protocol-typed interfaces
│       ├── application/use_cases/
│       │   ├── ingest_document.py    Ingestion orchestrator (Layers 1–9)
│       │   └── rag_query.py          Query orchestrator (Layers 10–13)
│       └── infrastructure/
│           ├── llamaindex/
│           │   ├── parser.py         LlamaParse document parser
│           │   ├── taxonomy.py       Keyword-based classifier
│           │   ├── preprocessor.py   Text normalisation
│           │   ├── chunker.py        LlamaIndex SentenceSplitter
│           │   ├── embedder.py       OpenAI embedding via LlamaIndex
│           │   └── query_engine.py   Full RAG query engine
│           └── firebase/
│               ├── storage_reader.py GCS file download
│               ├── indexer.py        Firestore chunk persistence
│               └── chunk_loader.py   Load chunks for query
├── main.py                           Firebase Functions entrypoint
├── requirements.txt
├── pyproject.toml
├── AGENT.md
└── README.md
```
