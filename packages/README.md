# packages/

Stable public boundary layer for the Xuanwu MDDD architecture.

Every directory under `packages/` is a self-contained package with a barrel
`index.ts` and a TypeScript path alias defined in `tsconfig.json`. Consumers
import through the alias (e.g. `@shared-types`, `@integration-firebase`) —
**never** through relative paths that reach into another package's internals.

## Design Principles

Inspired by **Cal.com** (`packages/@calcom/*`) and **Plane** (`packages/@plane/*`):

1. **Single source of truth** — each concern lives in exactly one package.
2. **No shims, no re-export chains** — packages contain actual implementations.
3. **Barrel exports define the public API** — unexported internals stay private.
4. **Dependency direction** — `UI → Application → Domain ← Infrastructure`.
   Packages never reverse-import from `app/` or `modules/` internals.
5. **ESLint enforced** — `no-restricted-imports` forbids legacy `@/shared/*`,
   `@/libs/*`, `@/infrastructure/*`, `@/ui/*`, `@/interfaces/*` paths.

## Package Inventory

| Alias | Directory | Purpose |
|-------|-----------|---------|
| `@shared-types` | `shared-types/` | Primitive types, `CommandResult`, `DomainError`, `Timestamp` |
| `@shared-utils` | `shared-utils/` | `cn()`, `formatDate()`, `generateId()` |
| `@shared-validators` | `shared-validators/` | Zod schemas for cross-cutting validation |
| `@shared-constants` | `shared-constants/` | `APP_NAME`, `PAGINATION_DEFAULTS` |
| `@shared-hooks` | `shared-hooks/` | `useAppStore` (Zustand global store) |
| `@integration-firebase` | `integration-firebase/` | Firebase client SDK (auth, firestore, storage, messaging, functions, database, analytics, appcheck, performance, remote-config) |
| `@integration-http` | `integration-http/` | Axios HTTP client with interceptors |
| `@api-contracts` | `api-contracts/` | REST route registry + GraphQL schema |
| `@ui-shadcn` | `ui-shadcn/` | shadcn/ui components, `cn()` utility, hooks |
| `@ui-vis` | `ui-vis/` | Vis.js React components (VisNetwork, VisTimeline) |
| `@lib-date-fns` | `lib-date-fns/` | date-fns v4 wrapper |
| `@lib-zod` | `lib-zod/` | Zod v4 wrapper |
| `@lib-uuid` | `lib-uuid/` | UUID v13 wrapper |
| `@lib-zustand` | `lib-zustand/` | Zustand v5 wrapper |
| `@lib-xstate` | `lib-xstate/` | XState v5 + React hooks wrapper |
| `@lib-tanstack` | `lib-tanstack/` | TanStack Query/Form/Table/Virtual wrapper |
| `@lib-superjson` | `lib-superjson/` | SuperJSON wrapper |
| `@lib-dragdrop` | `lib-dragdrop/` | Atlaskit Pragmatic Drag and Drop wrapper |
| `@lib-react-markdown` | `lib-react-markdown/` | react-markdown wrapper |
| `@lib-remark-gfm` | `lib-remark-gfm/` | remark-gfm wrapper |
| `@lib-vis` | `lib-vis/` | vis-data / vis-network / vis-timeline / vis-graph3d wrappers |

## Usage

```typescript
// Domain types
import type { CommandResult, DomainError } from "@shared-types";

// Utilities
import { cn, formatDate } from "@shared-utils";

// Validation
import { taskSchema } from "@shared-validators";

// Firebase
import { firebaseClientApp } from "@integration-firebase/client";
import { getFirebaseAuth } from "@integration-firebase";

// UI components
import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";

// Library wrappers
import { z } from "@lib-zod";
import { format } from "@lib-date-fns";
```

## Adding a New Package

1. Create `packages/<name>/index.ts` with barrel exports.
2. Add a `@<alias>` path in `tsconfig.json` → `"./packages/<name>/index.ts"`.
3. Add a `@<alias>/*` wildcard path if sub-module imports are needed.
4. Update this README.
5. Run `npm run lint && npm run build` to verify.

## Migration History

| Phase | What moved | From | To |
|-------|-----------|------|-----|
| 1 | Domain types, utils, validators, constants, hooks | `shared/*` | `packages/shared-*` |
| 2 | Firebase client SDK | `libs/firebase/` + `infrastructure/firebase/` | `packages/integration-firebase/` |
| 3 | HTTP client | `infrastructure/axios/` | `packages/integration-http/` |
| 4 | API contracts | `interfaces/rest/` + `interfaces/graphql/` | `packages/api-contracts/` |
| 5 | shadcn components + cn() | `ui/shadcn/` + `libs/utils.ts` | `packages/ui-shadcn/` |
| 6 | Vis.js components | `ui/vis/` | `packages/ui-vis/` |
| 7 | Library wrappers | `libs/*` | `packages/lib-*` |
| — | Python worker runtime | `libs/firebase/py_fn/` | `py_fn/` (root) |

> **Note:** `py_fn/` is a Python Firebase Functions codebase and is **not** a TypeScript
> package. It lives at the project root as a first-class deployment artifact (Firebase codebase name
> `py_fn`). It is deployed via `npm run deploy:functions:python` and uses its own
> `pyproject.toml` / `requirements.txt`. It is **not** imported by TypeScript code — interactions
> happen through Firebase callable functions and Firestore triggers.
