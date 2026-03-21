# Module: task

## Description

The **task** module represents the workspace task management capability. It enables creating, updating, deleting, and listing tasks within a workspace context, supporting assignment, priority, status tracking, and due dates.

## Responsibilities

- Define the task entity lifecycle (pending → in-progress → completed)
- Enforce business rules: task title required, workspace required
- Expose task CRUD and listing operations
- Provide real-time task query capabilities

## Related Packages

| Package | Role |
|---------|------|
| [`packages/task-core`](../../packages/task-core/) | Domain types, entity contracts, repository ports |
| [`packages/task-service`](../../packages/task-service/) | Use-cases, business workflows, service orchestration |

## Input / Output

### Commands (write side)
```
CreateWorkspaceTaskInput → CommandResult { aggregateId: taskId }
UpdateWorkspaceTaskInput → CommandResult { aggregateId: taskId }
DeleteTask(taskId)       → CommandResult { aggregateId: taskId }
```

### Queries (read side)
```
getWorkspaceTasks(workspaceId) → WorkspaceTaskEntity[]
```

## Used By

- `app/(shell)/workspace/[workspaceId]` — task tab in workspace shell
- `modules/workspace` — WorkspaceTaskTab component

## Notes

- This module has a complete implementation: domain, application, infrastructure, interfaces
- Firebase adapter: `FirebaseTaskRepository` (Firestore collection: `workspaceTasks`)
- No cross-module domain coupling — uses only `@shared-types` for `CommandResult`
