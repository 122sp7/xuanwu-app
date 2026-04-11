# Membership

把工作區參與關係從平台身份治理中切開。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — member view query implemented

## Responsibility

- Workspace member view model (canonical read model for participants)
- Member resolution queries (merging grants, teams, personnel sources)
- Workspace participation semantics distinct from platform identity

## Ubiquitous Language

- **Membership**: Workspace participation relationship, NOT platform identity
- **WorkspaceMemberView**: Read-only projection of a workspace participant
- **AccessChannel**: The route through which a member gained workspace access (owner, direct, team, personnel)

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- WorkspaceMemberView is the membership read model, not a full Membership aggregate (that would come when invitation/seat management is needed).
- Complex member resolution logic (merging from grants, teams, personnel) stays in the root infrastructure adapter since it depends on the full workspace document model.
- The subdomain's query handler delegates to the root WorkspaceQueryRepository port.
