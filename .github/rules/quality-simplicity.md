---
title: Keep Code Simple
impact: HIGH
impactDescription: Reduces cognitive load and maintenance burden
tags: quality, simplicity, readability
---

## Keep Code Simple

**Impact: HIGH**

Prefer straightforward solutions over clever abstractions. If a simpler approach handles the requirement, use it. Over-engineering adds maintenance burden without proportional value.

**Incorrect (unnecessary abstraction):**

```typescript
class RepositoryFactoryProviderSingleton {
  private static instance: RepositoryFactoryProviderSingleton;
  private factories: Map<string, () => unknown> = new Map();

  static getInstance() {
    if (!this.instance) this.instance = new RepositoryFactoryProviderSingleton();
    return this.instance;
  }

  register<T>(key: string, factory: () => T) { this.factories.set(key, factory); }
  resolve<T>(key: string): T { return this.factories.get(key)!() as T; }
}
```

**Correct (direct, readable implementation):**

```typescript
// If you only need one repository implementation, just use it directly
import { TaskFirebaseRepository } from "../infrastructure/firebase/TaskFirebaseRepository";

const taskRepo = new TaskFirebaseRepository();
```

**Guidelines:**
- Don't add abstractions until you have a concrete second use case
- Prefer composition over inheritance
- A 10-line function is almost always better than a 5-class hierarchy
- If you need to write a comment explaining what clever code does, rewrite the code instead
