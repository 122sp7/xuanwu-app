---
title: Code Review Standards
impact: HIGH
impactDescription: Catches defects early and maintains architectural consistency
tags: quality, code-review, standards
---

## Code Review Standards

**Impact: HIGH**

Every code change must be reviewed with attention to architectural alignment, not just correctness.

**Review checklist:**

1. **Module boundaries** — Does the change respect module `api/` boundaries? No internal cross-module imports?
2. **Layer direction** — Does the domain layer remain free of infrastructure/framework imports?
3. **Import aliases** — Are all shared imports using `@alias` paths? No legacy `@/shared/*`, `@/infrastructure/*`, `@/libs/*`?
4. **Use-case structure** — Are new use cases single-purpose files under `application/use-cases/`?
5. **Repository pattern** — Are repository interfaces in `domain/`, implementations in `infrastructure/`?
6. **Type safety** — Are `CommandResult` and `DomainError` used for error handling? No bare `throw` from use cases?
7. **Testing** — Are new behaviors covered by tests?

**Incorrect (rubber-stamp review):**

```
LGTM 👍
```

**Correct (substantive review):**

```
- ✅ Module boundaries respected (imports via `api/`)
- ⚠️ Line 42: This use case imports directly from `@integration-firebase` — 
     should the Firestore call go through a repository interface instead?
- ❌ Line 78: `@/shared/types` is a legacy path — use `@shared-types`
```
