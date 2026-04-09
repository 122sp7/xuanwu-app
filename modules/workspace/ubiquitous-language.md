# Ubiquitous Language — workspace

Scope: `modules/workspace` bounded context.

## Core terms

| Term | Meaning |
|---|---|
| `Workspace` | aggregate root for collaboration scope |
| `workspaceId` | workspace identity and cross-context scope key |
| `WorkspaceLifecycleState` | `preparatory | active | stopped` |
| `WorkspaceVisibility` | `visible | hidden` |
| `accountId` | owning account/organization identifier |
| `accountType` | `user | organization` owner category |

## Event language

| Event term | Discriminant |
|---|---|
| `WorkspaceCreatedEvent` | `workspace.created` |
| `WorkspaceLifecycleTransitionedEvent` | `workspace.lifecycle_transitioned` |
| `WorkspaceVisibilityChangedEvent` | `workspace.visibility_changed` |

## Projection/read language

| Term | Role |
|---|---|
| `WorkspaceMemberView` | member query projection |
| `WorkspaceMemberAccessChannel` | access path descriptor for member view |
| `WikiAccountContentNode` | account-level wiki tree projection |
| `WikiWorkspaceContentNode` | workspace-level wiki tree projection |
| `WikiContentItemNode` | wiki item projection |

## Naming constraints

- Keep lifecycle wording as `preparatory | active | stopped` (no `archived` replacement).
- Keep visibility wording as `visible | hidden`.
- Do not rename projection types into aggregate terms.
- Keep `Workspace` terminology stable across domain, application, and API contracts.

## Hexagonal meta-terms used in this module

- **Input Port**: contracts in `ports/input`.
- **Output Port**: contracts in `ports/output`.
- **Driving Adapters**: `interfaces/api`, `interfaces/cli`, `interfaces/web`.
- **Driven Adapters**: `infrastructure/firebase`, `infrastructure/events`.

These are architecture terms for structure clarity; the business language remains the core terms above.
