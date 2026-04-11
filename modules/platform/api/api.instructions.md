---
description: 'Platform API boundary rules: cross-module entry surface, facade contracts, and published language enforcement.'
applyTo: 'modules/platform/api/**/*.{ts,tsx}'
---

# Platform API Layer (Local)

Use this file as execution guardrails for `modules/platform/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface for platform; never expose `domain/`, `application/`, or `infrastructure/` internals directly.
- Expose stable **facade methods** and **contract types** only — no aggregate classes, no repository interfaces.
- All cross-module tokens must use published language: `actor reference`, `workspaceId`, `entitlement signal`, `knowledge artifact reference`.
- Never pass upstream aggregates as downstream canonical models; translate at the boundary.
- Downstream modules import from `modules/platform/api` only — enforce this with lint restricted-import rules.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
