---
description: 'Project-specific instructions for the xuanwu-app Firebase Python worker runtime.'
applyTo: 'py_fn/**/*.py'
---

# Xuanwu App py_fn Instructions

These instructions apply to the `py_fn/` runtime only.

## Overview

`py_fn/` is the Firebase Python worker runtime for ingestion and heavy processing. Next.js owns the user-facing application edge. **Do not turn `py_fn/` into a second product web server.**

## Architecture

Keep dependency direction `interfaces -> application -> domain <- infrastructure`. Keep `domain/` pure (no Firebase/Google SDK specifics, HTTP framework logic, or file-system coupling). 

Bootstrap and config in `app/bootstrap` and `app/config`. Vertical slices in `app/<bounded-context>/` with clear layer boundaries.

## Ingestion Pipeline Contract

Preserve established order (do not reorder without updating ADRs):
**Parse → Clean → Taxonomy → Chunk → Chunk metadata → Embedding → Firestore writes → Mark ready**

## Runtime Ownership

| Responsibility | Owner |
| --- | --- |
| Browser-facing APIs, upload UX, auth, session, Route Handlers, Server Actions, query orchestration, prompt assembly, streamed responses | **Next.js** |
| Parsing, cleaning, normalization, document-level taxonomy, chunking, chunk metadata, embedding, Firestore persistence, document status transitions, background/retryable/reprocess/admin jobs | **`py_fn/`** |

**Rule**: If the browser or page flow calls it directly → Next.js. If background, retryable, heavy, or admin/internal → `py_fn/`.

## Guardrails & Validation

**Do not**:
- Add chat streaming endpoints
- Move auth or session logic into this runtime
- Bypass `application` layer from `interfaces`
- Reintroduce legacy `libs/firebase/functions`

**Validate**:
- Local: `python -m compileall -q .` in `py_fn/`
- Repository: `npm run lint` and `npm run build` from project root
- Before changing boundaries: Read `py_fn/docs/decision-architecture/adr/README.md` and accepted ADRs

## Documentation Update Rules

- Update `py_fn/README.md` when worker responsibilities, setup, or runtime contracts change.
- Update ADRs when changing ingestion order, runtime ownership, persistence rules, or platform boundaries.
- Keep terminology aligned with the existing ingestion, taxonomy, chunk, embedding, and document-status vocabulary already used in the repo.
