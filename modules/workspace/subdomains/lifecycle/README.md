# Lifecycle

把工作區容器生命週期獨立成正典邊界。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Active
- **Status**: Active — lifecycle use cases implemented

## Responsibility

- Workspace creation (with optional capabilities)
- Workspace settings update (with lifecycle/visibility transition events)
- Workspace deletion
- Lifecycle state machine (preparatory → active → stopped)

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Key Design Decisions

- The Workspace aggregate root lives at context root level (`modules/workspace/domain/`), not inside this subdomain.
- This subdomain's use cases operate on the root aggregate through ports.
- Event publishing follows the "persist-then-publish" pattern.
- The `UpdateWorkspaceSettingsUseCase` consolidates both settings persistence and transition event emission into one cohesive use case, eliminating the prior split where the application service handled event logic.
