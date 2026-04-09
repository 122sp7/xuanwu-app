# Context Map — workspace

This file describes cross-bounded-context relationships centered on `workspace`.

## Upstream relationships

- `account -> workspace` (customer/supplier for owner identity context)
- `organization -> workspace` (customer/supplier for org ownership and member/team read translation)

## Downstream/conformist consumers (scope-aligned by `workspaceId`)

- `knowledge`
- `knowledge-base`
- `source`
- `notebook`
- `workspace-flow`
- `workspace-scheduling`
- `workspace-feed`
- `workspace-audit` (plus event consumption path)

## Public collaboration surfaces

1. Sync API: `modules/workspace/api`
2. Published language:
   - `workspaceId`
   - `WorkspaceLifecycleState`
   - `WorkspaceVisibility`
3. Domain events:
   - `workspace.created`
   - `workspace.lifecycle_transitioned`
   - `workspace.visibility_changed`

## Important distinction

Context map is **between** bounded contexts.

It is not:

- internal folder layering (`domain`, `application`, `ports`, `interfaces`, `infrastructure`)
- UI tab composition
- read projection shape design details
