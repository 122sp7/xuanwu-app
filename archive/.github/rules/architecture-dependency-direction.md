---
title: Layer Dependency Direction
impact: CRITICAL
impactDescription: Prevents architecture erosion and dependency cycles
tags: architecture, mddd, dependencies, clean-architecture
---

## Layer Dependency Direction

**Impact: CRITICAL**

Within every module, dependencies flow inward toward the domain layer. The domain layer has **zero outward dependencies** — it knows nothing about Firebase, React, or any framework.

```
interfaces/ ──→ application/ ──→ domain/ ←── infrastructure/
   (UI)          (use cases)    (entities)    (adapters)
```

**Incorrect (domain importing infrastructure):**

```typescript
// modules/workspace-flow/domain/entities/Task.ts
import { collection, getDocs } from "firebase/firestore";  // ❌ Domain knows about Firebase
import { db } from "@integration-firebase";                 // ❌ Domain imports infrastructure

export class Task {
  static async loadAll() {
    const snap = await getDocs(collection(db, "tasks"));
    return snap.docs.map(d => new Task(d.data()));
  }
}
```

**Correct (domain defines interface, infrastructure implements):**

```typescript
// modules/workspace-flow/domain/repositories/TaskRepository.ts
export interface TaskRepository {
  findAll(): Promise<Task[]>;        // ✅ Pure interface, no framework dependency
  findById(id: string): Promise<Task | null>;
}

// modules/workspace-flow/infrastructure/firebase/TaskFirebaseRepository.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "@integration-firebase";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";

export class TaskFirebaseRepository implements TaskRepository {
  async findAll(): Promise<Task[]> {  // ✅ Infrastructure implements the contract
    const snap = await getDocs(collection(db, "tasks"));
    return snap.docs.map(d => new Task(d.data()));
  }
}
```
