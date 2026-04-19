---
description: 'Rules for Python Cloud Functions worker responsibilities and boundaries.'
applyTo: 'fn/**/*.py'
---

# Cloud Functions

## Ownership

- `fn/` handles parsing, cleaning, taxonomy, chunking, embedding, and background jobs.
- Do not add browser-facing chat/auth/session logic in `fn/`.

## Runtime Decision Rule

- If called directly from page or browser flow, keep it in Next.js.
- If heavy, retryable, admin/internal, or long-running, keep it in `fn/`.

## Guardrails

- Preserve worker layer boundaries.
- Keep ingest job flow deterministic and retry-safe.

## Boundary Change Validation

- Before changing worker ownership, review `fn/docs/decision-architecture/adr/README.md` and accepted ADRs.
- Update `fn/README.md` when responsibilities or runtime contracts change.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill xuanwu-rag-runtime-boundary
