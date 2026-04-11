---
description: 'Workspace application layer rules: use-case orchestration, command/query application services, event publishing order, and DTO contracts.'
applyTo: 'modules/workspace/application/**/*.{ts,tsx}'
---

# Workspace Application Layer (Local)

Use this file as execution guardrails for `modules/workspace/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- `WorkspaceCommandApplicationService` and `WorkspaceQueryApplicationService` are the primary dispatch entry points — do not bypass them from interfaces.
- Use cases orchestrate flow only; lifecycle invariants, capability rules, and access checks stay in `domain/`.
- After persisting, call `pullDomainEvents()` and publish via `WorkspaceDomainEventPublisher` — never publish before persistence.
- DTOs (`workspace-interfaces.dto.ts`, `workspace-member-view.dto.ts`, `wiki-content-tree.dto.ts`) are application-layer contracts; never expose domain aggregates across the boundary.
- Pure reads (workspace queries, member views, wiki tree) belong in **query handlers** — `WorkspaceQueryApplicationService` owns these.
- Use case ordering for new workspace features: lifecycle → member → capabilities → access.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
