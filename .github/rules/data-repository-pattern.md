---
title: Repository Pattern — Interface in Domain, Implementation in Infrastructure
impact: CRITICAL
impactDescription: Prevents domain contamination and enables technology swap
tags: data, repository, domain, infrastructure, firebase
---

## Repository Pattern

**Impact: CRITICAL**

Repository **interfaces** live in `domain/repositories/`. Repository **implementations** live in `infrastructure/`. The domain layer never knows how data is persisted — only that it can be.

**Incorrect (domain knows about Firebase):**

```typescript
// modules/task/domain/entities/Task.ts
import { collection, addDoc } from "firebase/firestore";   // ❌ Domain imports Firebase
import { db } from "@integration-firebase";

export class Task {
  async save() {
    await addDoc(collection(db, "tasks"), this.toJSON());   // ❌ Persistence in entity
  }
}
```

**Correct (interface + implementation split):**

```typescript
// modules/task/domain/repositories/TaskRepository.ts
import type { Task } from "../entities/Task";

export interface TaskRepository {                           // ✅ Pure interface
  findById(id: string): Promise<Task | null>;
  findByWorkspace(workspaceId: string): Promise<Task[]>;
  save(task: Task): Promise<void>;
}

// modules/task/infrastructure/firebase/TaskFirebaseRepository.ts
import { collection, doc, getDoc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "@integration-firebase";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";

export class TaskFirebaseRepository implements TaskRepository {
  async findById(id: string): Promise<Task | null> {        // ✅ Implementation
    const snap = await getDoc(doc(db, "tasks", id));
    return snap.exists() ? Task.fromFirestore(snap.data()) : null;
  }

  async findByWorkspace(workspaceId: string): Promise<Task[]> {
    const q = query(collection(db, "tasks"), where("workspaceId", "==", workspaceId));
    const snap = await getDocs(q);
    return snap.docs.map(d => Task.fromFirestore(d.data()));
  }

  async save(task: Task): Promise<void> {
    await setDoc(doc(db, "tasks", task.id), task.toJSON());
  }
}
```
