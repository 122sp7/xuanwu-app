# Sharing

把對外共享與可見性規則收斂到單一上下文。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — access grant use cases implemented

## Responsibility

- Team access grants (authorize a team to access a workspace)
- Individual access grants (grant a user direct workspace access)
- Workspace sharing scope semantics

## Ubiquitous Language

- **ShareScope**: The sharing boundary and visibility extent, NOT generic "Permission"
- **WorkspaceGrant**: An individual access authorization to a workspace
- **WorkspaceAccessPolicy**: The aggregate access policy including grants and team associations

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- Access grant use cases take injected WorkspaceAccessRepository through the deps pattern.
- WorkspaceSharingApplicationService composes grant use cases and exposes team/individual grant operations.
- Location management stays at root level (part of Workspace operational profile, not sharing semantics).
