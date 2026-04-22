# src/modules Agent Rules

## ROLE

- The agent MUST treat src/modules as the only bounded-context implementation layer.
- The agent MUST route context-specific changes into the owning module subtree.
- The agent MUST keep cross-module interaction through module public boundaries.

## DOMAIN BOUNDARIES

- The agent MUST preserve context ownership defined by strategic docs.
- The agent MUST NOT import peer module internals directly.
- The agent MUST keep dependency direction aligned with interfaces -> application -> domain <- infrastructure.
- The agent MUST route shared concerns to packages, not duplicate inside modules.

## TOOL USAGE

- The agent MUST validate module ownership before editing.
- The agent MUST validate any path/link mentioned in module docs.
- The agent MUST perform scoped edits per module to reduce drift.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Enter owning module AGENTS/README.
	4. Apply module-local changes.
	5. Validate boundaries and references.

## DATA CONTRACT

- The agent MUST keep module index synchronized with actual directories.
- The agent MUST keep module links stable and workspace-relative.
- The agent MUST keep role descriptions concise and ownership-oriented.

## CONSTRAINTS

- The agent MUST NOT define strategic ownership contrary to docs authority.
- The agent MUST NOT expose internal adapters as cross-module contracts.
- The agent MUST NOT duplicate deep module implementation details in this routing file.

## ERROR HANDLING

- The agent MUST report missing module docs or stale links immediately.
- The agent MUST stop on ownership ambiguity and request direction.
- The agent MUST surface boundary conflicts before implementation.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and runtime constraints.
- The agent MUST keep README focused on human module index and overview.
- The agent MUST keep module naming aligned with strategic ubiquitous language.

## SECURITY

- The agent MUST avoid secret exposure in module docs.
- The agent MUST respect auth and tenancy boundaries across module interactions.

## Bounded Context Index

| Module | Role | Agent entry | Human overview |
|---|---|---|---|
| ai | AI mechanism capability module | [ai/AGENTS.md](ai/AGENTS.md) | [ai/README.md](ai/README.md) |
| analytics | Metrics, reporting, and projection module | [analytics/AGENTS.md](analytics/AGENTS.md) | [analytics/README.md](analytics/README.md) |
| billing | Entitlement, subscription, and usage module | [billing/AGENTS.md](billing/AGENTS.md) | [billing/README.md](billing/README.md) |
| iam | Identity and access management module | [iam/AGENTS.md](iam/AGENTS.md) | [iam/README.md](iam/README.md) |
| notebooklm | NotebookLM experience and reasoning module | [notebooklm/AGENTS.md](notebooklm/AGENTS.md) | [notebooklm/README.md](notebooklm/README.md) |
| notion | Knowledge artifact authoring module | [notion/AGENTS.md](notion/AGENTS.md) | [notion/README.md](notion/README.md) |
| platform | Platform cross-cutting capability module | [platform/AGENTS.md](platform/AGENTS.md) | [platform/README.md](platform/README.md) |
| template | Reference skeleton for new contexts | [template/AGENTS.md](template/AGENTS.md) | [template/README.md](template/README.md) |
| workspace | Workspace collaboration and operations module | [workspace/AGENTS.md](workspace/AGENTS.md) | [workspace/README.md](workspace/README.md) |

## Route Here When

- You need to decide owning bounded context for a change.
- You need module-level routing before context-local edits.

## Route Elsewhere When

- App Router composition only: [../app/AGENTS.md](../app/AGENTS.md)
- Strategic ownership disputes: [../../docs/README.md](../../docs/README.md)
- Shared package-level primitives: [../../packages/AGENTS.md](../../packages/AGENTS.md)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Template baseline: [template/AGENTS.md](template/AGENTS.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)
