---
title: Module Boundaries via Domain API
impact: CRITICAL
impactDescription: Prevents tight coupling between modules
tags: architecture, mddd, boundaries, api, imports
---

## Module Boundaries via Domain API

**Impact: CRITICAL**

Every domain module exposes cross-module contracts through `modules/<domain>/api/`. Other modules may **only** import from this API boundary — never by reaching into a module's internal directories.

**Incorrect (reaching into another module's internals):**

```typescript
// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
import { publishDomainEvent } from "@/modules/event/application/use-cases/publish-domain-event";
import { WikiDocument } from "@/modules/wiki/domain/entities/wiki-document.entity";
```

**Correct (importing through the domain API boundary):**

```typescript
// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
import { publishDomainEvent } from "@/modules/event/api";
import type { WikiDocument } from "@/modules/wiki/api";
```

**Within the same module, use relative imports:**

```typescript
// modules/wiki/application/use-cases/create-wiki-document.ts
import { WikiDocument } from "../../domain/entities/wiki-document.entity";             // ✅ Relative
import type { IWikiDocumentRepository } from "../../domain/repositories/iwiki-document.repository"; // ✅ Relative
```

**What goes in `api/`:**

```typescript
// modules/event/api/index.ts
// Public types
export type { DomainEvent } from "./contracts/domain-event";

// Public use cases
export { publishDomainEvent } from "./publish-domain-event";
export { listEventsByAggregate } from "./list-events-by-aggregate";
```

Only expose stable cross-module contracts in `api/`. Internal helpers, private entities, and implementation details stay unexported.
