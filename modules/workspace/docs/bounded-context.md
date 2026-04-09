# Bounded Context — workspace

`modules/workspace/` is the bounded context that owns workspace collaboration-scope language.

## Owned language

- `Workspace`
- `workspaceId`
- `WorkspaceLifecycleState`
- `WorkspaceVisibility`
- workspace domain events and related contracts

## Not owned here

- organization membership/team truth
- knowledge content semantics
- platform-level event infrastructure ownership

## Internal hexagonal composition

| Area | Role |
|---|---|
| `domain/` | business core |
| `application/` | use-case orchestration |
| `ports/input` | driving contracts |
| `ports/output` | driven contracts |
| `interfaces/*` | driving adapters |
| `infrastructure/*` | driven adapters |
| `api/` | stable public boundary |

## Dependency direction

`interfaces -> application -> domain <- infrastructure`

Ports remain the seam between core and adapters.

## Driver examples

- web UI flows
- route handlers/server actions
- cli/cron entrypoints
- other modules consuming `@/modules/workspace/api`

## Read model note

`WorkspaceMemberView` and `Wiki*Node` types are query projections, not aggregate ownership.
