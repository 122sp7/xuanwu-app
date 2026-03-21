# packages/ — MDDD Public Package Boundaries

This directory contains the **stable public package surfaces** for xuanwu-app.

Inspired by the common patterns in [cal.com](https://github.com/calcom/cal.com) and [plane](https://github.com/makeplane/plane), `packages/` exists to keep **shared foundations, integrations, UI primitives, and transport contracts** behind explicit import boundaries.

It is **not** a second feature layer and **not** a place to move arbitrary module code.

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

1. **Single repo, clear boundaries**: We avoid full monorepo tooling overhead while still getting explicit import surfaces through TypeScript path aliases.
2. **Stable package taxonomy**: Package names encode responsibility — shared kernel, integrations, UI primitives, third-party wrappers, contracts.
3. **Feature logic stays in modules**: `packages/` does not replace `modules/*`; business workflows remain in their bounded contexts.
4. **Single responsibility**: Each package has one reason to change (types, utils, UI, integration, contracts).

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

## Boundary Rules

Use `packages/` only for code that matches one of these buckets:

- **Shared kernel**: cross-cutting contracts, constants, validators, pure utilities
- **Integrations**: vendor SDK entrypoints and transport adapters
- **UI primitives**: reusable shadcn/design-system surfaces
- **Library wrappers**: thin third-party re-export boundaries
- **API contracts**: DTOs and transport-safe interfaces

Keep code in `modules/*` when it is:

- a business entity, value object, repository port, or use case
- a module-specific view model, hook, server action, or screen composition
- logic owned by one bounded context even if reused internally in that module

Promote module code into `packages/` only when it has:

1. a stable public API,
2. more than one real consumer boundary,
3. a clear ownership rule,
4. no dependency on app/module-specific orchestration.

## Usage

```typescript
// Preferred — use explicit package boundaries
import type { CommandResult, DomainError } from "@shared-types";
import { formatDate } from "@shared-utils";
import { Button, cn } from "@ui-shadcn";
import { redis } from "@integration-upstash";
import { z } from "@lib-zod";
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
packages/*                ←── must NOT import @/app/*, @/modules/*, @/interfaces/*, @/infrastructure/*
```

## Guidance

When you write new code:

1. Use package aliases (`@shared-types`, `@shared-utils`, `@ui-shadcn`, `@integration-firebase`, `@lib-zod`)
2. Keep business workflows and domain modeling in `modules/*`
3. Add new packages only when the code is cross-cutting and stable enough to justify a public package boundary

ESLint enforces these package boundaries for app/module code so legacy import paths and reverse package dependencies do not creep back in.
