---
description: 'Project-specific instructions for the xuanwu-app Firebase Python worker runtime.'
applyTo: 'functions-python/**/*.py'
---

# Xuanwu App Functions-Python Instructions

These instructions apply to the `functions-python/` runtime only.

## Mission

- Treat `functions-python/` as the Firebase Python worker runtime for ingestion and heavy processing.
- Treat Next.js as the user-facing application edge.
- Do not turn `functions-python/` into a second product web server.

## Architecture Rules

- Keep the dependency direction `interfaces -> application -> domain <- infrastructure`.
- Keep `domain/` pure. Do not import Firebase SDK specifics, Google SDK specifics, HTTP framework logic, or file-system coupling into domain code.
- Put Firebase entrypoints in `main.py`.
- Keep bootstrap and config support code in `app/bootstrap` and `app/config`.
- Keep vertical slices inside `app/<bounded-context>/` with clear layer boundaries.

## Runtime Ownership

### `functions-python` owns

- parsing raw files
- cleaning and normalization
- document-level taxonomy
- chunking and structuring
- chunk metadata generation
- embedding generation
- Firestore persistence for ingestion outputs
- document status transitions for ingestion
- background, retryable, reprocess, and admin-safe jobs

### Next.js owns

- browser-facing APIs
- upload UX
- auth and session-aware endpoints
- Route Handlers and Server Actions
- query orchestration and prompt assembly
- streamed UI responses

## API Placement Rule

- If the browser or page flow calls it directly, put it in Next.js.
- If it is background, retryable, heavy, or admin/internal, put it in `functions-python/`.

## Ingestion Pipeline Contract

Preserve the established ingestion order:

1. parse
2. clean
3. taxonomy
4. chunk
5. chunk metadata
6. embedding
7. Firestore writes
8. mark document ready

Do not reorder this pipeline without updating the corresponding ADR and runtime documentation.

## Guardrails

- Do not add chat streaming endpoints here.
- Do not move auth or session logic into this runtime.
- Do not bypass `application` from `interfaces`.
- Do not reintroduce legacy `libs/firebase/functions`.
- Read `functions-python/docs/adr/README.md` and accepted ADRs before changing runtime boundaries.

## Validation

- Preferred local validation inside `functions-python/`:
  - `python -m compileall -q .`
- Repository-level validation from the project root:
  - `npm run lint`
  - `npm run build`

## Documentation Update Rules

- Update `functions-python/README.md` when worker responsibilities, setup, or runtime contracts change.
- Update ADRs when changing ingestion order, runtime ownership, persistence rules, or platform boundaries.
- Keep terminology aligned with the existing ingestion, taxonomy, chunk, embedding, and document-status vocabulary already used in the repo.
