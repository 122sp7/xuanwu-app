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
| `shared-types` | `@shared-types` | `packages/shared-types/` | `CommandResult`, `DomainError`, `Timestamp`, primitives |
| `shared-utils` | `@shared-utils` | `packages/shared-utils/` | Pure utility functions |
| `shared-validators` | `@shared-validators` | `packages/shared-validators/` | Zod schemas for input validation |
| `shared-hooks` | `@shared-hooks` | `packages/shared-hooks/` | Zustand app store, shared hooks |
| `shared-constants` | `@shared-constants` | `packages/shared-constants/` | App-wide constants |

### Integrations
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `integration-firebase` | `@integration-firebase` | `packages/integration-firebase/` | Firebase client + admin SDK |
| `integration-upstash` | `@integration-upstash` | `packages/integration-upstash/` | Redis, Vector, QStash, Workflow |

### UI
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `ui-shadcn` | `@ui-shadcn` | `packages/ui-shadcn/` (backed by `ui/shadcn/` internals) | shadcn/ui components + `cn` utility |

### Library Wrappers
| Package | Alias | From | Purpose |
|---------|-------|------|---------|
| `lib-date-fns` | `@lib-date-fns` | `packages/lib-date-fns/` | Date utility functions |
| `lib-zod` | `@lib-zod` | `packages/lib-zod/` | Schema validation |
| `lib-xstate` | `@lib-xstate` | `packages/lib-xstate/` | State machines + React hooks |
| `lib-tanstack` | `@lib-tanstack` | `packages/lib-tanstack/` | React Query, Form, Table, Virtual |
| `lib-superjson` | `@lib-superjson` | `packages/lib-superjson/` | Enhanced JSON serialization |
| `lib-vis` | `@lib-vis` | `packages/lib-vis/` (backed by `ui/vis/` internals) | Vis.js visualization |
| `lib-react-markdown` | `@lib-react-markdown` | `packages/lib-react-markdown/` | Markdown rendering |
| `lib-remark-gfm` | `@lib-remark-gfm` | `packages/lib-remark-gfm/` | GitHub Flavored Markdown |
| `lib-uuid` | `@lib-uuid` | `packages/lib-uuid/` | UUID generation and validation |
| `lib-dragdrop` | `@lib-dragdrop` | `packages/lib-dragdrop/` | Atlaskit drag-and-drop |
| `lib-zustand` | `@lib-zustand` | `packages/lib-zustand/` | State management |

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

## Top-Level Directory Disposition

The directories that most often cause package-boundary confusion are intentionally narrowed as follows:

| Directory | Status | What belongs there now |
|-----------|--------|------------------------|
| `ui/` | keep, but as package internals | implementation files behind `@ui-shadcn` and `@lib-vis` |
| `libs/` | retired for TS app code | only `libs/firebase/functions-python/` remains as the Python worker runtime |
| `infrastructure/` | keep, but very small | rare root-level runtime adapters such as `infrastructure/axios/httpClient.ts` |
| `interfaces/` | keep, but very small | global transport entrypoints like REST/GraphQL registry files |

Practical rule:

- if it is reusable UI, consume it through `@ui-shadcn` / `@lib-vis`
- if it is a vendor SDK boundary, consume it through `@integration-*`
- if it is a shared transport contract, consume it through `@api-contracts`
- if it is feature-owned orchestration, keep it in `modules/*/interfaces` or `modules/*/infrastructure`

## Migration Order

To keep boundaries getting clearer instead of blurrier, package migration should happen in this order:

### 1. Fully move first

Move these into `packages/*` early and completely:

- shared types / validators / constants / pure utils
- vendor integrations (`@integration-*`)
- reusable UI primitives (`@ui-*`)
- thin library wrappers (`@lib-*`)
- transport-safe shared contracts (`@api-contracts`)

Why first? These have clearer ownership, broader reuse, and lower risk of dragging feature orchestration into the package layer.

### 2. Delay full moves for these

Do **not** fully move these into `packages/*` until the bounded context has stabilized:

- module entities / repository ports / use cases
- module-specific UI and page composition
- module server actions, hooks, queries, controllers
- module infrastructure adapters
- root app wiring under `infrastructure/` or `interfaces/`

Why delay? These areas still encode business ownership and application composition. Moving them too early creates package sprawl and makes boundaries less obvious, not more obvious.

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
