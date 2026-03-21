# task-service

## Purpose

Task application service package — business workflows, use-cases, Firebase adapter, server actions, and UI components for the task domain. This is the executable layer of the task module.

## Belongs to Module

[`modules/task`](../../modules/task/) — workspace task management

## Public API

### Use-Cases (Application Layer)

| Export | Description |
|--------|-------------|
| `CreateWorkspaceTaskUseCase` | Create a task with title/priority/assignment validation |
| `UpdateWorkspaceTaskUseCase` | Update task fields; validates non-empty title |
| `DeleteWorkspaceTaskUseCase` | Delete a task by ID |
| `ListWorkspaceTasksUseCase` | List all tasks for a workspace |

### Infrastructure Adapter

| Export | Description |
|--------|-------------|
| `FirebaseTaskRepository` | Firestore adapter implementing `TaskRepository` port |

### Server Actions (`"use server"`)

| Export | Description |
|--------|-------------|
| `createWorkspaceTask(input)` | Server action wrapping `CreateWorkspaceTaskUseCase` |
| `updateWorkspaceTask(taskId, input)` | Server action wrapping `UpdateWorkspaceTaskUseCase` |
| `deleteWorkspaceTask(taskId)` | Server action wrapping `DeleteWorkspaceTaskUseCase` |

### Queries

| Export | Description |
|--------|-------------|
| `getWorkspaceTasks(workspaceId)` | Real-time task list query |

### UI Components

| Export | Description |
|--------|-------------|
| `WorkspaceTaskTab` | Workspace tab showing the task list |

## Dependencies

- `@task-core` — entity types and repository port
- `@shared-types` — `CommandResult`, `commandSuccess`, `commandFailureFrom`
- `@integration-firebase` — Firestore SDK for `FirebaseTaskRepository`

## Example

```typescript
import { CreateWorkspaceTaskUseCase, FirebaseTaskRepository } from "@task-service";

const repo = new FirebaseTaskRepository();
const useCase = new CreateWorkspaceTaskUseCase(repo);
const result = await useCase.execute({ workspaceId: "ws_1", title: "Fix bug" });
```

## Rules

- Use-cases depend only on `@task-core` and `@shared-types`
- Firebase adapter is the only allowed infrastructure dependency
- Server actions are thin wrappers — no business logic
