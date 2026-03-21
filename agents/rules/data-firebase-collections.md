---
title: Firebase Firestore Conventions
impact: HIGH
impactDescription: Ensures consistent data access and security across modules
tags: data, firebase, firestore, collections
---

## Firebase Firestore Conventions

**Impact: HIGH**

All Firestore access goes through repository implementations in `infrastructure/firebase/`. Modules never access Firestore directly from components, hooks, or use cases.

**Collection naming:**
- Use lowercase kebab-case for collection names (e.g., `daily-entries`, `wiki-documents`)
- Sub-collections follow the same convention

**Repository implementation pattern:**

```typescript
// modules/daily/infrastructure/firebase/DailyEntryFirebaseRepository.ts
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@integration-firebase";
import type { DailyEntryRepository } from "../../domain/repositories/DailyEntryRepository";

export class DailyEntryFirebaseRepository implements DailyEntryRepository {
  private readonly collectionRef = collection(db, "daily-entries");

  async findByWorkspace(workspaceId: string): Promise<DailyEntry[]> {
    const q = query(
      this.collectionRef,
      where("workspaceId", "==", workspaceId),
      orderBy("publishedAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => DailyEntry.fromFirestore(d.id, d.data()));
  }
}
```

**Key rules:**
- The `@integration-firebase` package provides initialized Firebase instances (`db`, `auth`, `storage`, etc.)
- Import from `@integration-firebase`, never from `firebase/firestore` in domain or application layers
- Firestore queries stay in infrastructure — use cases receive domain objects, not Firestore snapshots
- For modules that don't need Firebase persistence, use `infrastructure/default/` with in-memory implementations
