---
title: Domain Event Publishing
impact: MEDIUM
impactDescription: Enables loose coupling between modules via asynchronous events
tags: patterns, domain-events, event-driven, decoupling
---

## Domain Event Publishing

**Impact: MEDIUM**

When a module needs to notify other modules of a state change, publish a domain event through the **event** module. Don't create direct cross-module function calls for side effects.

**Incorrect (direct cross-module coupling for side effects):**

```typescript
// modules/file/application/use-cases/upload-complete-file.use-case.ts
import { refreshParserSummary } from "@/modules/parser";     // ❌ Direct call
import { appendAuditLog } from "@/modules/audit";            // ❌ Tight coupling

export async function completeUpload(fileId: string) {
  await fileRepo.markComplete(fileId);
  await refreshParserSummary(workspaceId);                    // ❌ File knows about parser
  await appendAuditLog({ action: "file-uploaded", fileId });  // ❌ File knows about audit
}
```

**Correct (publish domain event, let subscribers react):**

```typescript
// modules/file/application/use-cases/upload-complete-file.use-case.ts
import { publishDomainEvent } from "@/modules/event";

export async function completeUpload(fileId: string) {
  const file = await fileRepo.markComplete(fileId);

  await publishDomainEvent({
    type: "file.upload.completed",
    aggregateId: fileId,
    payload: { workspaceId: file.workspaceId, fileId },
  });
  // Parser and audit modules subscribe independently
}
```

**Event naming convention:** `<module>.<entity>.<action>` (e.g., `file.upload.completed`, `wiki.page.created`, `schedule.request.submitted`)
