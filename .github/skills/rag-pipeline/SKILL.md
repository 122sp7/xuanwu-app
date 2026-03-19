---
name: rag-pipeline
description: Design or scaffold retrieval-augmented generation ingestion, indexing, retrieval, and evaluation workflows for Xuanwu.
---

# RAG Pipeline Skill

Use this skill when the task involves knowledge ingestion, chunking, embedding, indexing, retrieval, or answer synthesis.

## What to do

1. Identify the owning module and the user-facing retrieval scenario.
2. Separate ingestion, normalization, chunking, indexing, retrieval, reranking, and answer generation responsibilities.
3. Make tenancy, access control, freshness, and observability requirements explicit.
4. Define contracts for pipeline inputs, outputs, retry behavior, and failure handling.
5. Reuse the provided templates when turning product notes into implementation work.

## Included resources

- [ingestion-checklist.md](./templates/ingestion-checklist.md)
