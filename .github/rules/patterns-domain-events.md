---
title: Domain Event Publishing
impact: MEDIUM
impactDescription: Enables loose coupling between modules via asynchronous events
tags: patterns, domain-events, event-driven, decoupling
---

## Domain Event Publishing

**Impact: MEDIUM**

When a module needs to notify other modules of a state change, publish a domain event through the target domain `api/` boundary responsible for event publishing. Don't create direct cross-module function calls for side effects.

**Incorrect (direct cross-module coupling for side effects):**

```typescript
// modules/<source-domain>/application/use-cases/<use-case>.ts
import { refreshProjection } from "@/modules/<target-domain-a>/api";   // ❌ Direct call
import { appendDomainLog } from "@/modules/<target-domain-b>/api";     // ❌ Tight coupling

export async function completeProcess(entityId: string) {
  await sourceRepo.markComplete(entityId);
  await refreshProjection(scopeId);                             // ❌ Source knows target A internals
  await appendDomainLog({ action: "source-completed", entityId }); // ❌ Source knows target B internals
}
```

**Correct (publish domain event, let subscribers react):**

```typescript
// modules/<source-domain>/application/use-cases/<use-case>.ts
import { publishDomainEvent } from "@/modules/<event-domain>/api";

export async function completeProcess(entityId: string) {
  const entity = await sourceRepo.markComplete(entityId);

  await publishDomainEvent({
    type: "source.entity.completed",
    aggregateId: entityId,
    payload: { scopeId: entity.scopeId, entityId },
  });
  // Subscriber domains react independently
}
```

**Event naming convention:** `<domain>.<entity>.<action>` (e.g., `source.entity.completed`, `domain.entity.created`, `domain.request.submitted`)
