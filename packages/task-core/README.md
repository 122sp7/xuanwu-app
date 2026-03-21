# task-core

## Purpose

Task domain core — pure TypeScript types, entity contracts, and repository port interfaces. This package is the foundation for everything task-related and has zero external dependencies.

## Belongs to Module

[`modules/task`](../../modules/task/) — workspace task management

## Public API

### Entity Types

| Export | Description |
|--------|-------------|
| `WorkspaceTaskEntity` | Full task entity with all fields |
| `WorkspaceTaskStatus` | `"pending" \| "in-progress" \| "completed"` |
| `WorkspaceTaskPriority` | `"low" \| "medium" \| "high"` |
| `CreateWorkspaceTaskInput` | Input contract for task creation |
| `UpdateWorkspaceTaskInput` | Input contract for task updates |

### Repository Port

| Export | Description |
|--------|-------------|
| `TaskRepository` | Port interface: `create`, `update`, `delete`, `findByWorkspaceId` |

## Dependencies

- `@shared-types` — `CommandResult` (consumed by service layer, not this package)
- Zero other dependencies — pure domain contracts only

## Example

```typescript
import type { WorkspaceTaskEntity, TaskRepository } from "@task-core";

// Implementing the port
class MyTaskRepository implements TaskRepository {
  async create(input: CreateWorkspaceTaskInput): Promise<WorkspaceTaskEntity> {
    // ...
  }
}
```

## Rules

- Zero implementation code — types and interfaces only
- No imports from infrastructure, UI, or framework code
- Do not import internal task module files directly — always use `@task-core`
