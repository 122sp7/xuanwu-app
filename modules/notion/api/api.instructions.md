---
description: 'Notion API boundary rules: cross-module entry surface, knowledge artifact published language, and downstream consumer contracts.'
applyTo: 'modules/notion/api/**/*.{ts,tsx}'
---

# Notion API Layer (Local)

Use this file as execution guardrails for `modules/notion/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- Expose stable **factory functions** and **contract types** only — no aggregate classes, no repository interfaces.
- Published language tokens for cross-module use: `knowledgePageRef`, `articleRef`, `collectionId`, `contentBlockRef`, `knowledgeArtifactReference`.
- `notebooklm` consumes knowledge artifact references from this boundary — translate to notebooklm's own domain model via ACL.
- `factories.ts` in subdomains wires services for tRPC or server-action consumption; keep wiring thin.
- Never expose `workspaceId`-scoped data without verifying workspace membership through `platform` entitlement signals.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
