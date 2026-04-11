---
description: 'Workspace bounded context rules: workspaceId anchor ownership, collaboration container scope, downstream dependency position, and subdomain routing.'
applyTo: 'modules/workspace/**/*.{ts,tsx,md}'
---

# Workspace Bounded Context (Local)

Use this file as execution guardrails for `modules/workspace/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/workspace/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `workspace` is **downstream** of `platform`; never import from platform internals — use `modules/platform/api` only.
- `workspace` is **upstream** of `notebooklm`; expose `workspaceId` scope and membership signals via `modules/workspace/api`.
- Cross-module consumers import from `modules/workspace/api` only.
- `workspaceId` is the canonical scope anchor for all downstream modules — always resolve workspace identity through this module.
- Use ubiquitous language: `Membership` not `User` (for workspace participant), `WorkspaceCapability` not `Feature`, `WorkspaceLifecycleState` not `Status`.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Workspace lifecycle (create, archive, restore) | `lifecycle` |
| Member roles, invitations, participant management | `membership` |
| Workspace activity feed and posts | `feed` |
| Audit trail and compliance log | `audit` |
| Task, issue, invoice workflow | `workspace-workflow` |
| Scheduling and work demand | `scheduling` |
| Real-time presence and activity | `presence` |
| Workspace sharing and access grants | `sharing` |

## Route Elsewhere When

- Identity, entitlements, organization, credentials → `platform`
- Knowledge pages, articles, databases, content publishing → `notion`
- Notebook, conversation, source, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
