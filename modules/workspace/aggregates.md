# Aggregates — workspace

This file documents write-side domain modeling for `modules/workspace/domain`.

## Aggregate Root

### `Workspace`

`Workspace` is the aggregate root for collaboration-scope consistency.

Core invariant language:

- lifecycle: `preparatory | active | stopped`
- visibility: `visible | hidden`
- stable ownership: `accountId`, `accountType`

## Current write-side modeling (from code)

### Aggregate

- `Workspace` (`domain/aggregates/Workspace.ts`)

### Supporting entities

- `WorkspaceLocation`
- `Capability`
- access/profile related domain entities under `domain/entities`

### Value objects

- `WorkspaceName`
- `WorkspaceLifecycleState`
- `WorkspaceVisibility`
- `Address`

## Command behavior implemented on aggregate

- `rename`
- `changeVisibility`
- `transitionLifecycle`
- `activate`
- `stop`
- `updateAddress`
- `updatePersonnel`
- `applySettings`

## Event alignment

Aggregate changes are reflected by domain event language:

- `workspace.created`
- `workspace.lifecycle_transitioned`
- `workspace.visibility_changed`

## Read projections (not aggregates)

- `WorkspaceMemberView`
- `WikiAccountContentNode`
- `WikiWorkspaceContentNode`
- `WikiContentItemNode`

These belong to query/projection concerns and should not be modeled as aggregate roots.

## Hexagonal consistency rule

Per Context7 `/sairyss/domain-driven-hexagon` guidance:

- domain model remains technology-agnostic
- persistence concerns stay out of aggregate modeling
- repository abstraction is external to aggregate core
