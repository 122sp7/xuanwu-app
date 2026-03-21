# Functions-Llama-Pipeline Agent Contract

## Mission
- This directory is the **LlamaIndex Cloud RAG pipeline** — a **beta** Firebase Functions
  Python codebase that implements all 13 RAG layers using LlamaParse + LlamaIndex.
- It is **separate** from `functions-python` and does **not** conflict with it.
- Documents tagged with `pipeline="llama"` are processed by this codebase.
- Documents without the pipeline field (or `pipeline="default"`) are processed by `functions-python`.

## Architecture
```
functions_llama_pipeline/
├── app/
│   ├── bootstrap/         Firebase Admin SDK init
│   ├── config/            Environment settings (LLAMA_CLOUD_API_KEY, etc.)
│   └── rag_pipeline/
│       ├── domain/        Entities + Ports (pure Python)
│       ├── application/   Use cases (IngestDocument, RagQuery)
│       ├── infrastructure/
│       │   ├── llamaindex/  LlamaParse, Chunker, Embedder, Query Engine
│       │   └── firebase/    Firestore indexer, Storage reader, Chunk loader
│       └── interfaces/    Firebase callable handlers
├── tests/
├── main.py               Firebase Functions entrypoint
├── requirements.txt
├── pyproject.toml
└── AGENT.md              This file
```

## Dependency Direction
- `interfaces -> application -> domain <- infrastructure`
- `domain` is pure Python (no SDK imports).

## 13-Layer Coverage
| # | Layer | Implementation |
|---|-------|---------------|
| 1 | Document Upload | IngestDocumentCommand (receives storage_path) |
| 2 | OCR | LlamaParse agentic tier |
| 3 | Ingestion Layer | IngestDocumentUseCase orchestrator |
| 4 | Parsing & Structuring | LlamaParse Markdown output |
| 5 | Knowledge Modeling | SimpleTaxonomyClassifier (keyword-based) |
| 6 | Text Preprocessing | LlamaTextPreprocessor (normalisation) |
| 7 | Text Chunking | LlamaIndex SentenceSplitter |
| 8 | Embedding | OpenAI text-embedding-3-small via LlamaIndex |
| 9 | Indexing | Firestore batch write (same schema as functions-python) |
| 10 | Semantic Retrieval | LlamaIndex VectorStoreIndex |
| 11 | Constraint & Filtering | org/workspace/taxonomy filters |
| 12 | Reranking | Cohere Rerank or LLM Rerank fallback |
| 13 | Reasoning & Generation | OpenAI LLM via LlamaIndex query engine |

## Validation
```bash
cd functions_llama_pipeline
python -m compileall -q .
```

## Deploy
```bash
npm run deploy:functions:llama
```
