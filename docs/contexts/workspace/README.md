# workspace

> **Domain Type:** Generic Subdomain  
> **Module:** `modules/workspace/`  
> **Authoritative docs:** [`modules/workspace/`](../../../modules/workspace/)

## Boundary

- **Responsible for:**
  - `Workspace` aggregate lifecycle — `preparatory | active | stopped`
  - Workspace visibility — `visible | hidden`
  - Stable collaboration container identity — `workspaceId` as the canonical scope anchor for all downstream contexts
  - Public contracts via `modules/workspace/api` (contracts, facade, ui, index)
  - Read projections: `WorkspaceMemberView`, `WikiAccountContentNode`, `WikiWorkspaceContentNode`, `WikiContentItemNode`

- **Not responsible for:**
  - Organization member and team governance → `organization`
  - Knowledge content semantics → `knowledge`
  - UI tab composition (interface composition, not context-map ownership)
  - Business domain rules beyond collaboration scope

## Published Language

- **Commands:**
  - `CreateWorkspace`
  - `RenameWorkspace`
  - `ChangeWorkspaceVisibility`
  - `TransitionWorkspaceLifecycle` (`activate`, `stop`)
  - `UpdateWorkspaceAddress`
  - `UpdateWorkspacePersonnel`
  - `ApplyWorkspaceSettings`

- **Queries:**
  - `GetWorkspace`
  - `ListWorkspacesByAccount`
  - `GetWorkspaceMembers`

- **Events:**
  - `workspace.created`
  - `workspace.lifecycle_transitioned`
  - `workspace.visibility_changed`

## Upstream / Downstream

- **Upstream:**
  - `account` → workspace — owner identity context (Customer/Supplier)
  - `organization` → workspace — org ownership and member/team read translation (Customer/Supplier)

- **Downstream (conformist consumers scoped by `workspaceId`):**
  - `knowledge`
  - `knowledge-base`
  - `source`
  - `notebook`
  - `workspace-flow`
  - `workspace-scheduling`
  - `workspace-feed`
  - `workspace-audit`

- **Relationship types:**
  - `account → workspace`: Customer/Supplier
  - `organization → workspace`: Customer/Supplier
  - `workspace → downstream contexts`: Published Language (workspaceId scope + domain events)

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. Cross-module access must use `modules/workspace/api` only — never import internal `domain/`, `application/`, `infrastructure/`, or `interfaces/` directly.
5. This context does not own organization truth (member/team governance).
6. This context does not own knowledge-content semantics.
