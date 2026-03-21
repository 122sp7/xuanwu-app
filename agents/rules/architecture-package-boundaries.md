---
title: Package Boundaries
impact: CRITICAL
impactDescription: Enforces stable shared-code boundaries and prevents legacy path usage
tags: architecture, mddd, packages, boundaries, eslint
---

## Package Boundaries

**Impact: CRITICAL**

The `packages/` directory contains **stable public boundaries** — shared code that multiple modules depend on. Every package is imported via a `@alias` defined in `tsconfig.json`, never via relative paths.

**Incorrect (legacy import paths):**

```typescript
import type { CommandResult } from "@/shared/types";           // ❌ ESLint blocks this
import { auth } from "@/infrastructure/firebase";              // ❌ ESLint blocks this
import { cn } from "@/libs/utils";                             // ❌ ESLint blocks this
import { Button } from "@/ui/shadcn/ui/button";                // ❌ ESLint blocks this
```

**Correct (package alias imports):**

```typescript
import type { CommandResult, DomainError } from "@shared-types";     // ✅
import { cn, formatDate, generateId } from "@shared-utils";          // ✅
import { auth, db } from "@integration-firebase";                    // ✅
import { Button } from "@ui-shadcn/ui/button";                      // ✅
import { format } from "@lib-date-fns";                              // ✅
import { z } from "@lib-zod";                                        // ✅
```

**Key rules:**

1. **Single source of truth** — each concern lives in exactly one package
2. **No re-export chains** — packages contain actual implementations
3. **Barrel exports define public API** — internals stay private
4. **ESLint enforced** — legacy `@/shared/*`, `@/infrastructure/*`, `@/libs/*`, `@/ui/shadcn/*`, `@/interfaces/*` imports are blocked at lint time

**Package sub-module imports** use wildcard aliases:

```typescript
import { Button } from "@ui-shadcn/ui/button";                // ✅ Sub-module import
import { useAppStore } from "@shared-hooks";                   // ✅ Direct barrel
import { vectorClient } from "@integration-upstash";           // ✅ Direct barrel
```
