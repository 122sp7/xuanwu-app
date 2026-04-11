---
description: 'Workspace subdomains structural rules: hexagonal shape per subdomain, workspaceId scope enforcement, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/workspace/subdomains/**/*.{ts,tsx}'
---

# Workspace Subdomains Layer (Local)

Use this file as execution guardrails for `modules/workspace/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/workspace/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within workspace goes through the **subdomain's own `api/`** — never import a sibling's `domain/`, `application/`, or `infrastructure/` internals.
- All subdomain operations must be scoped to a `workspaceId`; never perform workspace-wide queries without an explicit scope check.
- `workspace-workflow` owns Task, Issue, and Invoice state machines — do not duplicate workflow logic in other subdomains.
- `audit` subdomain is append-only; never modify or delete audit entries.
- Domain events use the discriminant format `workspace.<subdomain>.<action>` (e.g. `workspace.feed.post-created`, `workspace.workflow.task-assigned`).
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
