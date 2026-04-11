---
description: 'NotebookLM API boundary rules: cross-module entry surface, tRPC server factory, and published language for notebook/source/conversation references.'
applyTo: 'modules/notebooklm/api/**/*.{ts,tsx}'
---

# NotebookLM API Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- Expose stable **factory functions** and **contract types** only — no aggregate classes, no repository interfaces.
- Published language tokens for cross-module use: `notebookId`, `sourceId`, `conversationId`, `ragDocumentRef`.
- `factories.ts` wires subdomain services for tRPC consumption; keep wiring thin and delegate to use cases.
- `server.ts` is the tRPC router entry point — do not place business logic here.
- Never pass `notion` knowledge aggregates directly into notebooklm domain; translate via ACL at the boundary.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
