---
title: Comment Guidelines
impact: MEDIUM
impactDescription: Reduces noise and improves code readability
tags: quality, comments, documentation
---

## Comment Guidelines

**Impact: MEDIUM**

Write code that is self-documenting through clear naming. Use comments only when they add information that the code itself cannot convey — the *why*, not the *what*.

**Incorrect (commenting the obvious):**

```typescript
// Get the task
const task = await taskRepo.findById(id);

// Check if task exists
if (!task) {
  // Return error
  return { success: false, error: new DomainError("not-found") };
}
```

**Correct (comment explains WHY, not WHAT):**

```typescript
const task = await taskRepo.findById(id);
if (!task) {
  return { success: false, error: new DomainError("not-found") };
}

// Schedule items derived from finance context may be stale if the finance
// snapshot hasn't been refreshed since the last billing cycle.
const items = await deriveScheduleItems(workspace, financeSnapshot);
```

**When comments are useful:**
- Business rules that aren't obvious from code
- Workarounds for known framework issues (with issue links)
- Module-level documentation in `README.md` or `index.ts`
- Complex derivation logic in domain services
