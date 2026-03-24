---
title: Module Boundaries via Domain API
impact: CRITICAL
impactDescription: Prevents tight coupling between modules
tags: architecture, mddd, boundaries, api, imports
---

## Module Boundaries via Domain API

**Impact: CRITICAL**

Every domain module exposes cross-module contracts through `modules/<target-domain>/api/`. Other modules may **only** import from this API boundary — never by reaching into a module's internal directories.

**Incorrect (reaching into another module's internals):**

```typescript
// modules/<source-domain>/application/use-cases/<use-case>.ts
import { runTargetUseCase } from "@/modules/<target-domain>/application/use-cases/<use-case>";
import { TargetEntity } from "@/modules/<target-domain>/domain/entities/<entity>";
```

**Correct (importing through the domain API boundary):**

```typescript
// modules/<source-domain>/application/use-cases/<use-case>.ts
import { runTargetUseCase } from "@/modules/<target-domain>/api";
import type { TargetEntity } from "@/modules/<target-domain>/api";
```

**Within the same module, use relative imports:**

```typescript
// modules/<source-domain>/application/use-cases/<use-case>.ts
import { SourceEntity } from "../../domain/entities/<entity>";             // ✅ Relative
import type { SourceRepository } from "../../domain/repositories/<repository>"; // ✅ Relative
```

**What goes in `api/`:**

```typescript
// modules/<target-domain>/api/index.ts
// Public types
export type { PublicContract } from "./contracts/public-contract";

// Public use cases
export { runTargetUseCase } from "./run-target-use-case";
export { getTargetState } from "./get-target-state";
```

Only expose stable cross-module contracts in `api/`. Internal helpers, private entities, and implementation details stay unexported.
