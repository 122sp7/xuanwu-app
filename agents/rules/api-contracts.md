---
title: API Contracts via @api-contracts
impact: HIGH
impactDescription: Centralizes API route definitions and prevents fragmentation
tags: api, contracts, routes, rest
---

## API Contracts via @api-contracts

**Impact: HIGH**

REST API routes and GraphQL schemas are defined in the `@api-contracts` package (`packages/api-contracts`). This keeps API surface definitions centralized and version-controlled.

**Incorrect (ad-hoc route definitions scattered across modules):**

```typescript
// modules/task/interfaces/api/task.controller.ts
const TASK_API = "/api/v1/tasks";    // ❌ Route defined locally, not tracked centrally
```

**Correct (routes from @api-contracts):**

```typescript
import { API_ROUTES } from "@api-contracts";

// Use centralized route definitions
const url = API_ROUTES.tasks.list;   // ✅ Single source of truth
```

**Guidelines:**
- All REST route paths are registered in `@api-contracts`
- Controllers in `interfaces/api/` implement the routes but don't define them
- Type contracts (request/response shapes) should be co-located with route definitions
- Version API routes explicitly when breaking changes are unavoidable
