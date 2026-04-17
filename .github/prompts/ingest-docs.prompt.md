---
name: ingest-docs
description: Ingest and normalize documents for downstream chunking and embedding workflows.
applyTo: 'py_fn/**/*.py'
agent: Doc Ingest Agent
argument-hint: Provide source format, target pipeline, and quality constraints.
---

# Ingest Docs

## Workflow

1. Convert/normalize sources to markdown when needed.
2. Preserve source metadata and traceability.
3. Validate structure quality for chunking.
4. Output ingestion summary and loss-risk notes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill xuanwu-rag-runtime-boundary
#use skill liteparse
#use skill llamaparse
