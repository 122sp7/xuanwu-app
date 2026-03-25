---
description: 'Rules for MarkItDown-assisted document conversion in RAG workflows under Xuanwu runtime boundaries.'
applyTo: '{docs,py_fn,.github}/**/*.{md,py}'
---

# MarkItDown RAG Rules

## Workflow intent

Use MarkItDown conversion to normalize source documents into markdown before chunking and embedding workflows.

## Boundary rules

- Keep ingestion and parsing responsibilities inside `py_fn` pipelines.
- Keep user-facing orchestration and route logic in Next.js module interfaces.
- Do not mix authentication/session behavior into Python ingestion code.

## Validation expectations

1. Verify converted markdown structure is usable for downstream chunking.
2. Keep source metadata traceable so retrieval citations remain auditable.
3. Document any format-loss risk for manual follow-up.