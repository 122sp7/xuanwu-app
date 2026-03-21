---
title: Error Handling with CommandResult and DomainError
impact: HIGH
impactDescription: Ensures consistent, type-safe error handling across the codebase
tags: quality, error-handling, domain-error, command-result
---

## Error Handling with CommandResult and DomainError

**Impact: HIGH**

Use `CommandResult` for use-case return types and `DomainError` for domain-level errors. Both are defined in `@shared-types`. Avoid throwing raw exceptions from use cases — use typed result objects instead.

**Incorrect (throwing raw errors):**

```typescript
// modules/task/application/use-cases/create-task.use-case.ts
export async function createTask(input: CreateTaskInput) {
  if (!input.title) throw new Error("Title is required");       // ❌ Raw throw
  if (!input.workspaceId) throw new Error("Workspace required"); // ❌ Untyped error
  // ...
}
```

**Correct (typed result objects):**

```typescript
import type { CommandResult } from "@shared-types";
import { DomainError } from "@shared-types";

// modules/task/application/use-cases/create-task.use-case.ts
export async function createTask(input: CreateTaskInput): Promise<CommandResult<Task>> {
  if (!input.title) {
    return { success: false, error: new DomainError("missing-title", "Title is required") };
  }

  const task = new Task(input);
  await taskRepo.save(task);
  return { success: true, data: task };
}
```

**At the interfaces layer, handle the result:**

```typescript
// modules/task/interfaces/_actions/task.actions.ts
export async function createTaskAction(input: CreateTaskInput) {
  const result = await createTask(input);
  if (!result.success) {
    // Convert DomainError to user-facing message
    return { error: result.error.message };
  }
  return { data: result.data };
}
```
