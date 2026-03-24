---
title: Use Package Alias Imports
impact: CRITICAL
impactDescription: Prevents legacy path usage and maintains clean dependency graph
tags: quality, imports, aliases, eslint, packages
---

## Use Package Alias Imports

**Impact: CRITICAL**

All shared code must be imported through `@alias` paths defined in `tsconfig.json`. Legacy paths are blocked by ESLint. Cross-module imports use `@/modules/<name>/api` (the domain API boundary). Within a module, use relative imports.

**Incorrect (legacy paths — ESLint blocks these):**

```typescript
import type { CommandResult } from "@/shared/types";
import { db } from "@/infrastructure/firebase";
import { cn } from "@/libs/utils";
import { Button } from "@/ui/shadcn/ui/button";
```

**Incorrect (reaching into another module's internals):**

```typescript
import { Task } from "@/modules/task/domain/entities/Task";
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
import { publishDomainEvent } from "@/modules/event/api";
import type { Task } from "@/modules/task/api";
```

**Correct (relative within same module):**

```typescript
// Inside modules/wiki/application/use-cases/create-wiki-document.ts
import { WikiDocument } from "../../domain/entities/wiki-document.entity";
```
