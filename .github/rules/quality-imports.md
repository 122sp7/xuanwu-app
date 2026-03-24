---
title: Use Package Alias Imports
impact: CRITICAL
impactDescription: Prevents legacy path usage and maintains clean dependency graph
tags: quality, imports, aliases, eslint, packages
---

## Use Package Alias Imports

**Impact: CRITICAL**

All shared code must be imported through `@alias` paths defined in `tsconfig.json`. Legacy paths are blocked by ESLint. Cross-module imports use `@/modules/<target-domain>/api` (the domain API boundary). Within a module, use relative imports.

**Incorrect (legacy paths — ESLint blocks these):**

```typescript
import type { CommandResult } from "@/shared/types";
import { db } from "@/infrastructure/firebase";
import { cn } from "@/libs/utils";
import { Button } from "@/ui/shadcn/ui/button";
```

**Incorrect (reaching into another module's internals):**

```typescript
import { DomainEntity } from "@/modules/<target-domain>/domain/entities/<entity>";
```

**Correct (package aliases for shared code):**

```typescript
import type { CommandResult, DomainError } from "@shared-types";
import { cn } from "@shared-utils";
import { auth, db } from "@integration-firebase";
import { Button } from "@ui-shadcn/ui/button";
import { z } from "@lib-zod";
```

**Correct (module API boundary for cross-module):**

```typescript
import { runTargetUseCase } from "@/modules/<target-domain>/api";
import type { DomainEntity } from "@/modules/<target-domain>/api";
```

**Correct (relative within same module):**

```typescript
// Inside modules/<current-domain>/application/use-cases/<use-case>.ts
import { SourceEntity } from "../../domain/entities/<entity>";
```
