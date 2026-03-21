---
title: Domain Service Encapsulation
impact: MEDIUM
impactDescription: Keeps complex business rules testable and centralized
tags: patterns, domain-services, business-logic, encapsulation
---

## Domain Service Encapsulation

**Impact: MEDIUM**

When business logic involves multiple entities or cross-entity rules, encapsulate it in a **domain service** under `domain/services/`. Domain services are stateless, pure functions that depend only on domain types.

**Incorrect (business logic in use case):**

```typescript
// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
export async function listWorkspaceScheduleItems(workspaceId: string) {
  const workspace = await workspaceRepo.findById(workspaceId);
  const finance = await financeRepo.getSnapshot(workspaceId);
  const raw = await scheduleRepo.findByWorkspace(workspaceId);

  // ❌ Complex derivation logic mixed with orchestration
  return raw.map(item => {
    const isPaid = finance.settlements.some(s => s.itemId === item.id);
    const isOverdue = !isPaid && item.dueDate < new Date();
    return { ...item, status: isOverdue ? "overdue" : isPaid ? "settled" : "pending" };
  });
}
```

**Correct (derivation logic in domain service):**

```typescript
// modules/schedule/domain/services/derive-schedule-items.ts
export function deriveScheduleItems(
  rawItems: ScheduleItem[],
  financeSnapshot: FinanceSnapshot,
): DerivedScheduleItem[] {
  const settlementIndex = new Map(financeSnapshot.settlements.map(s => [s.itemId, s]));
  return rawItems.map(item => {
    const isPaid = settlementIndex.has(item.id);
    const isOverdue = !isPaid && item.dueDate < new Date();
    return { ...item, status: isOverdue ? "overdue" : isPaid ? "settled" : "pending" };
  });
}

// modules/schedule/application/use-cases/list-workspace-schedule-items.use-case.ts
import { deriveScheduleItems } from "../../domain/services/derive-schedule-items";

export async function listWorkspaceScheduleItems(workspaceId: string) {
  const [raw, finance] = await Promise.all([
    scheduleRepo.findByWorkspace(workspaceId),
    financeRepo.getSnapshot(workspaceId),
  ]);
  return deriveScheduleItems(raw, finance);  // ✅ Use case orchestrates, service computes
}
```

**Benefits:**
- Domain service is easily unit-tested without mocking repositories
- Use case stays focused on orchestration (fetch data → compute → return)
- Business rules are centralized and discoverable
