# packages/ — MDDD Logical Package Layer

This directory contains the **logical package layer** for the xuanwu-app MDDD architecture.

Inspired by how [cal.com](https://github.com/calcom/cal.com) and [plane](https://github.com/makeplane/plane) organize their codebases with explicit package boundaries, this layer provides **TypeScript path alias packages** that give the project clear, auditable module boundaries — without the overhead of a full monorepo.

## Design Rationale

### What We Learned from cal.com and plane

| Pattern | cal.com | plane | xuanwu |
|---------|---------|-------|--------|
| Shared types | `packages/types` | `packages/types` | `@shared-types` |
| Utilities | `packages/lib` | `packages/utils` | `@shared-utils` |
| UI components | `packages/ui` | `packages/ui` + `packages/propel` | `@ui-shadcn` |
| Constants | embedded in `packages/lib` | `packages/constants` | `@shared-constants` |
| Integrations | `packages/app-store` | `packages/services` | `@integration-*` |
| Lib wrappers | `packages/lib` | `packages/hooks` + `packages/i18n` | `@lib-*` |
| API contracts | `packages/trpc` | `packages/services` | `@api-contracts` |

### Why This Approach

1. **Single repo, clear boundaries**: We don't need the full Turbo monorepo overhead — TypeScript path aliases give us the same import clarity.
2. **Dependency direction enforcement**: Aliases make it explicit which layer you're importing from. `@shared-types` is clearly a shared contract; `@integration-firebase` is clearly an external service adapter.
3. **Gradual migration**: Old paths (`@/shared/types`, `@/libs/firebase`) become thin shims — existing code keeps working while new code uses the alias.
4. **Single responsibility**: Each package has one reason to change (types, utils, UI, integration, etc.).

## Package Map

### Shared Kernel
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `shared-types` | `@shared-types` | `shared/types/` | `CommandResult`, `DomainError`, `Timestamp`, primitives |
| `shared-utils` | `@shared-utils` | `shared/utils/` | Pure utility functions |
| `shared-validators` | `@shared-validators` | `shared/validators/` | Zod schemas for input validation |
| `shared-hooks` | `@shared-hooks` | `shared/hooks/` | Zustand app store, shared hooks |
| `shared-constants` | `@shared-constants` | `shared/constants/` | App-wide constants |

### Integrations
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `integration-firebase` | `@integration-firebase` | `libs/firebase/` | Firebase client + admin SDK |
| `integration-upstash` | `@integration-upstash` | `libs/upstash/` | Redis, Vector, QStash, Workflow |

### UI
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `ui-shadcn` | `@ui-shadcn` | `ui/shadcn/` | shadcn/ui components + `cn` utility |

### Library Wrappers
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `lib-date-fns` | `@lib-date-fns` | `libs/date-fns/` | Date utility functions |
| `lib-zod` | `@lib-zod` | `libs/zod/` | Schema validation |
| `lib-xstate` | `@lib-xstate` | `libs/xstate/` | State machines + React hooks |
| `lib-tanstack` | `@lib-tanstack` | `libs/tanstack/` | React Query, Form, Table, Virtual |
| `lib-superjson` | `@lib-superjson` | `libs/superjson/` | Enhanced JSON serialization |
| `lib-vis` | `@lib-vis` | `libs/vis/` | Vis.js visualization |
| `lib-react-markdown` | `@lib-react-markdown` | `libs/react-markdown/` | Markdown rendering |
| `lib-remark-gfm` | `@lib-remark-gfm` | `libs/remark-gfm/` | GitHub Flavored Markdown |
| `lib-uuid` | `@lib-uuid` | `libs/uuid/` | UUID generation and validation |
| `lib-dragdrop` | `@lib-dragdrop` | `libs/dragdrop/` | Atlaskit drag-and-drop |
| `lib-zustand` | `@lib-zustand` | `libs/zustand/` | State management |

### API Contracts
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `api-contracts` | `@api-contracts` | new | API interfaces and DTOs |

## Usage

```typescript
// New code — use alias imports
import type { CommandResult, DomainError } from "@shared-types";
import { formatDate } from "@shared-utils";
import { Button, cn } from "@ui-shadcn";
import { redis } from "@integration-upstash";
import { z } from "@lib-zod";

// Old code — still works (backward-compat shims)
import type { CommandResult } from "@/shared/types";
import { cn } from "@/libs/utils";
```

## Dependency Rules

```
packages/shared-*         ←── no external imports (pure TypeScript)
packages/integration-*    ←── may import packages/shared-*
packages/ui-*             ←── may import packages/shared-*
packages/lib-*            ←── no internal imports (wraps npm packages only)
packages/api-contracts    ←── may import packages/shared-*

modules/*/domain          ←── may import @shared-types only
modules/*/application     ←── may import @shared-types, domain
modules/*/infrastructure  ←── may import @integration-*, domain
modules/*/interfaces      ←── may import all packages, application
```

## Migration Guide

When you write new code:
1. Use `@shared-types` instead of `@/shared/types`
2. Use `@shared-utils` instead of `@/shared/utils`
3. Use `@ui-shadcn` instead of `@/ui/shadcn/utils/utils` or `@/ui/shadcn/ui/*`
4. Use `@integration-firebase` instead of `@/libs/firebase`
5. Use `@lib-zod` instead of `@/libs/zod`

Existing code using `@/shared/*` and `@/libs/*` continues to work via backward-compat shims.
