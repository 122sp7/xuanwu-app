---
title: Module Boundaries via Barrel Exports
impact: CRITICAL
impactDescription: Prevents tight coupling between modules
tags: architecture, mddd, boundaries, barrel-exports, imports
---

## Module Boundaries via Barrel Exports

**Impact: CRITICAL**

Every module exposes its public API through a single `index.ts` barrel export. Other modules may **only** import from this barrel — never by reaching into a module's internal directories.

**Incorrect (reaching into another module's internals):**

```typescript
// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
import { publishDomainEvent } from "@/modules/event/application/use-cases/publish-domain-event";
import { WikiDocument } from "@/modules/wiki/domain/entities/wiki-document.entity";
```

**Correct (importing through the barrel export):**

```typescript
// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
import { publishDomainEvent } from "@/modules/event";
import type { WikiDocument } from "@/modules/wiki";
```

**Within the same module, use relative imports:**

```typescript
// modules/wiki/application/use-cases/create-wiki-document.ts
import { WikiDocument } from "../../domain/entities/wiki-document.entity";             // ✅ Relative
import type { IWikiDocumentRepository } from "../../domain/repositories/iwiki-document.repository"; // ✅ Relative
```

**What goes in `index.ts`:**

```typescript
// modules/event/index.ts
// Public types
export type { DomainEvent } from "./domain/entities/domain-event.entity";

// Public use cases
export { publishDomainEvent } from "./application/use-cases/publish-domain-event";
export { listEventsByAggregate } from "./application/use-cases/list-events-by-aggregate";

// Public infrastructure (for DI wiring only)
export { EventStoreRepository } from "./infrastructure/repositories/event-store.repository";
```

Only export what other modules actually need. Internal helpers, private entities, and implementation details stay unexported.
