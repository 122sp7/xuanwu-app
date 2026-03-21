---
title: One Use Case Per File
impact: MEDIUM
impactDescription: Ensures single responsibility and discoverability
tags: patterns, use-case, single-responsibility
---

## One Use Case Per File

**Impact: MEDIUM**

Each use case lives in its own file under `application/use-cases/`. A use case represents a single user-facing operation. Name the file with a `verb-noun` pattern.

**Incorrect (multiple use cases in one file):**

```typescript
// modules/task/application/use-cases/task.use-cases.ts
export async function createTask(input: CreateTaskInput) { ... }
export async function updateTask(id: string, input: UpdateTaskInput) { ... }
export async function deleteTask(id: string) { ... }
export async function listTasks(workspaceId: string) { ... }
```

**Correct (one file per use case):**

```
modules/task/application/use-cases/
├── create-task.use-case.ts
├── update-task.use-case.ts
├── delete-task.use-case.ts
└── list-workspace-tasks.use-case.ts
```

```typescript
// modules/task/application/use-cases/create-task.use-case.ts
import type { CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";

export async function createTask(
  input: CreateTaskInput,
  deps: { taskRepo: TaskRepository },
): Promise<CommandResult<Task>> {
  // Single operation — create a task
  const task = Task.create(input);
  await deps.taskRepo.save(task);
  return { success: true, data: task };
}
```

**Note:** Some existing modules use a single `*.use-cases.ts` file with multiple exports. This is acceptable for simple CRUD modules but should be split as complexity grows.
