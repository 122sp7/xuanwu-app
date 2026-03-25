---
title: DTO Boundaries
impact: HIGH
impactDescription: Prevents leaking persistence or framework details across layers
tags: data, dto, boundaries, layers
---

## DTO Boundaries

**Impact: HIGH**

Data Transfer Objects (DTOs) mark the boundary between layers. Domain entities are internal to the module; when data crosses a layer boundary (domain → application, application → interfaces), use a DTO to decouple internal representation from external contracts.

**Incorrect (exposing Firestore document shape to UI):**

```typescript
// modules/workspace-flow/interfaces/components/TaskList.tsx
import { collection, getDocs } from "firebase/firestore";
import { db } from "@integration-firebase";

export function TaskList() {
  const [tasks, setTasks] = useState<DocumentData[]>([]);  // ❌ Raw Firestore data in component
  useEffect(() => {
    getDocs(collection(db, "tasks")).then(snap => {
      setTasks(snap.docs.map(d => d.data()));               // ❌ No type safety
    });
  }, []);
}
```

**Correct (use case returns typed DTO):**

```typescript
// modules/workspace-flow/application/use-cases/list-tasks.use-case.ts
export interface TaskListItemDTO {
  id: string;
  title: string;
  status: "open" | "closed";
  assigneeId: string | null;
}

export async function listWorkspaceTasks(workspaceId: string): Promise<TaskListItemDTO[]> {
  const tasks = await taskRepo.findByWorkspace(workspaceId);
  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    assigneeId: t.assigneeId,
  }));
}

// modules/workspace-flow/interfaces/components/TaskList.tsx
import { listWorkspaceTasks, type TaskListItemDTO } from "../../application/use-cases/list-tasks.use-case";
// Component receives typed data, doesn't know about Firestore
```
