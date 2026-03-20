# Functions-Python Agent Contract

## Mission
- This directory is the **Firebase Python worker runtime** for document ingestion and heavy AI/data
  processing.
- Treat **Next.js** as the user-facing application edge.
- Treat **functions-python** as the background worker / internal callable / trigger execution layer.
- Treat it as the repository's only Firebase Functions runtime after the retirement of
  `libs/firebase/functions`.
- Read `docs/adr/README.md` plus accepted ADRs before changing runtime boundaries, dependencies,
  structure, or migration strategy.

## Dependency Direction
- `interfaces -> application -> domain <- infrastructure`
- `bootstrap` and `config` support the runtime but do not replace the core layer boundaries.
- `domain` must remain pure: no Firebase SDK, Google SDK, HTTP framework, or file-system coupling.

## Ownership Boundary

### functions-python owns
- parsing raw files
- cleaning / normalization
- document-level taxonomy
- chunking / structuring
- chunk metadata generation
- embedding generation
- Firestore chunk persistence
- document status transitions for ingestion
- background retryable jobs
- reprocess / backfill / admin-safe worker entrypoints

### Next.js owns
- browser-facing APIs
- upload UX
- auth/session-aware endpoints
- Route Handlers / Server Actions
- Genkit query orchestration
- vector-search request orchestration
- prompt building and streamed answers
- feedback collection and product response shaping

## API Placement Rule
- If the browser or page flow calls it directly, put it in **Next.js**.
- If it is background, retryable, heavy, or admin/internal, put it in **functions-python**.

## Pipeline Contract

### Ingestion
- Next.js uploads file and creates `documents` metadata
- functions-python reads the raw file and performs:
  1. parse
  2. clean
  3. taxonomy
  4. chunk
  5. chunk metadata
  6. embedding
  7. Firestore writes
  8. mark document ready

### Query
- Query orchestration stays in Next.js:
  - query preprocess
  - query embedding
  - Firestore vector search
  - prompt assembly
  - Genkit LLM response
  - streaming UI response

## Guardrails For Copilot
- Do not add chat streaming endpoints here.
- Do not move auth/session logic into this codebase.
- Do not bypass `application` from `interfaces`.
- Do not put SDK-specific code into `domain`.
- Do not reintroduce `libs/firebase/functions` as a second Firebase runtime.

## Current Runtime Slice
- `main.py` holds the Firebase entrypoints.
- `app/document_ai` is the first vertical slice.
- The current implementation should be treated as a **foundation** for worker-side document
  processing, not as the full platform.

## Validation
- Preferred local validation:
  - `python -m compileall -q .`
- Repository-level validation remains at project root:
  - `npm run lint`
  - `npm run build`
