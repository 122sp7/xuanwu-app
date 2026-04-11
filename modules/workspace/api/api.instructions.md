---
description: 'Workspace API boundary rules: cross-module entry surface, workspaceId published language, facade/contract/runtime separation, and downstream consumer contracts.'
applyTo: 'modules/workspace/api/**/*.{ts,tsx}'
---

# Workspace API Layer (Local)

Use this file as execution guardrails for `modules/workspace/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- `contracts.ts` defines stable cross-module types; `facade.ts` exposes callable service methods; `ui.ts` exposes UI-safe view tokens only.
- Published language tokens for cross-module use: `workspaceId`, `membershipRef`, `workspaceCapabilitySignal`, `wikiContentTreeRef`.
- `runtime/factories.ts` wires workspace services for server-side consumption — keep wiring thin, delegate to application services.
- Never expose `Workspace` aggregate or `WorkspaceMemberView` entity directly across the boundary; translate to contract types.
- `notebooklm` and `notion` must receive `workspaceId` as a scope token, never as a full workspace object.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
