# MDDD Architecture — Module-Driven Domain Design

## Architecture Overview

```
apps/          → composition layer (Next.js routes, layouts, shell)
packages/      → executable units with strict package boundaries
modules/       → conceptual domain definitions (no business logic)
```

### Dependency Direction

```
UI → Application → Domain ← Infrastructure
```

---

## Layer Descriptions

### `apps/`  (Composition Layer)
Routes, layouts, and page entrypoints. Composes packages and wires modules together.  
**Rule**: No business logic. Import only from `packages/*`.

### `packages/`  (Executable Layer)
The only place for runnable code. Each package has a clear single responsibility, a `README.md`, and exports only through `index.ts`.  
**Rule**: No circular dependencies. No direct imports from `modules/*`. See [`packages/README.md`](packages/README.md).

### `modules/`  (Conceptual Layer)
Domain definitions: contracts, entities, ports, and bounded context documentation.  
**Rule**: No implementations. Each module describes what a capability _is_, not how it works.

---

## Package Catalogue

### Shared Packages

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `shared-types` | `packages/shared-types/` | `@shared-types` | `CommandResult`, `DomainError`, `Timestamp`, primitive types |
| `shared-utils` | `packages/shared-utils/` | `@shared-utils` | Pure utility functions, app-wide constants |
| `shared-validators` | `packages/shared-validators/` | `@shared-validators` | Zod schemas for cross-cutting input validation |
| `shared-hooks` | `packages/shared-hooks/` | `@shared-hooks` | Cross-cutting React hooks, Zustand app store |

### Integration Packages

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `integration-firebase` | `packages/integration-firebase/` | `@integration-firebase` | Firebase SDK (Auth, Firestore, Storage, Functions, etc.) |
| `integration-upstash` | `packages/integration-upstash/` | `@integration-upstash` | Upstash (Redis, Vector, QStash, Workflow) |
| `integration-http` | `packages/integration-http/` | `@integration-http` | Axios HTTP client for external APIs |

### UI Packages

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `ui-shadcn` | `packages/ui-shadcn/` | `@ui-shadcn` | shadcn/ui component library (Radix primitives) + `cn` utility |
| `ui-vis` | `packages/ui-vis/` | `@ui-vis` | vis.js visualization components |

### Domain Packages — Task

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `task-core` | `packages/task-core/` | `@task-core` | Task entity types and `TaskRepository` port (zero deps) |
| `task-service` | `packages/task-service/` | `@task-service` | Task use-cases, Firebase adapter, server actions, UI tab |

### Domain Packages — Skill

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `skill-core` | `packages/skill-core/` | `@skill-core` | Skill entity, `AccountSkillEntity`, repository ports (zero deps) |

### Domain Packages — Matching

| Package | Path | Alias | Description |
|---------|------|-------|-------------|
| `matching-engine` | `packages/matching-engine/` | `@matching-engine` | Pure scoring logic, `SkillMatcher`, domain contracts, repository ports |
| `matching-service` | `packages/matching-service/` | `@matching-service` | `MatchTaskUseCase`, `AssignTaskUseCase` (orchestrates repos + engine) |

---

## Module → Package Mapping

| Module | Packages | Layer | Status |
|--------|----------|-------|--------|
| Cross-cutting | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-hooks` | Shared | ✅ Complete |
| Infrastructure | `@integration-firebase`, `@integration-upstash`, `@integration-http` | Integration | ✅ Complete |
| Presentation | `@ui-shadcn`, `@ui-vis` | UI | ✅ Complete |
| `modules/task` | `@task-core`, `@task-service` | Domain | ✅ Complete |
| `modules/skill` | `@skill-core` | Domain | 🟡 Core only (no service yet) |
| `modules/matching` | `@matching-engine`, `@matching-service` | Domain | 🟡 Engine complete; Firebase adapter pending |
| `modules/knowledge` | (see `modules/wiki`) | Domain | ✅ Implemented in modules/wiki |
| `modules/identity` | (inline in module) | Domain | ✅ Full module implementation |
| `modules/account` | (inline in module) | Domain | ✅ Full module implementation |
| `modules/workspace` | (inline in module) | Domain | ✅ Full module implementation |
| `modules/organization` | (inline in module) | Domain | ✅ Full module implementation |
| `modules/schedule` | (inline in module) | Domain | ✅ Full MDDD flow |

---

## Module Structure

Each feature module (`modules/<feature>/`) follows strict hexagonal layering:

```
modules/<feature>/
├── domain/
│   ├── entities/            # Pure TypeScript entities & value objects
│   └── repositories/        # Port interfaces (NO implementations)
├── application/
│   └── use-cases/           # Business workflows (no framework, no Firebase)
├── infrastructure/
│   └── firebase/            # Firebase adapters implementing port interfaces
│       ├── Firebase<Feature>Repository.ts
│       └── (mappers: Firestore ↔ Domain — validate enum fields before mapping)
├── interfaces/
│   ├── _actions/            # Next.js "use server" Server Actions (thin adapters)
│   ├── hooks/               # "use client" React hooks
│   └── queries/             # Read query wrappers callable from React components
└── index.ts                 # Public API (barrel export)
```

---

## Implemented Modules

| Module | Sub-Domains | Firebase Adapter | Notes |
|--------|-------------|-----------------|-------|
| `identity` | Auth (SignIn, Register, SignOut, PasswordReset) + TokenRefreshSignal [S6] | FirebaseIdentityRepository, FirebaseTokenRefreshRepository | useTokenRefreshListener hook (Party 3 [S6]) |
| `account` | Profile, Wallet (atomic Firestore txns), Role (+ token refresh), Policy | FirebaseAccountRepository, FirebaseAccountPolicyRepository, FirebaseAccountQueryRepository | CQRS: write-side repo + read-side query repo |
| `workspace` | Lifecycle, Capabilities, Locations, Grants | FirebaseWorkspaceRepository | Enum-validated mappers |
| `finance` | Claim lifecycle stages | FirebaseFinanceRepository | Domain stage-transition rules in entity |
| `organization` | Core (create/update/delete), Members, Teams, Partners, Policy | FirebaseOrganizationRepository | All sub-domains fully implemented |
| `notification` | Dispatch, MarkRead, MarkAllRead | FirebaseNotificationRepository | Single side-effect outlet pattern |
| `task` | CreateTask, UpdateStatus, DeleteTask | FirebaseTaskRepository | MDDD example module |
| `wiki` | Pages, RAG, Knowledge | DefaultWorkspaceKnowledgeRepository | Full knowledge domain |
| `event` | Domain events | FirebaseEventRepository | Event-driven backbone |
| `namespace` | Namespace management | FirebaseNamespaceRepository | Multi-tenancy |
| `schedule` | MDDD flow, assignments, projections | FirebaseMdddScheduleRepository + many | Full MDDD workflow |

---

## Layer Rules

### Domain Layer (`domain/`)
- ✅ Pure TypeScript: interfaces, types, value objects, domain logic
- ✅ Zero external dependencies (no Firebase, no React, no Next.js)
- ✅ Repository **interfaces** (ports) defined here, NOT implementations
- ❌ No `import` from infrastructure, application, or UI layers
- ❌ No cross-module domain imports

### Application Layer (`application/use-cases/`)
- ✅ Orchestrates domain entities + repository ports
- ✅ Returns `CommandResult` (discriminated union: `CommandSuccess | CommandFailure`)
- ✅ Framework-agnostic — callable from React, server actions, tests
- ❌ No direct Firebase/Firestore calls
- ❌ No React hooks or UI code

### Infrastructure Layer (`infrastructure/firebase/`)
- ✅ Implements domain repository interfaces (the Adapter)
- ✅ Contains all Firebase SDK usage
- ✅ Includes Firestore ↔ Domain mappers with **enum field validation**
- ✅ Wallet credit/debit uses Firestore **transactions** (atomic balance enforcement)
- ❌ Must NOT be imported by domain or application layers

### Interface Layer (`interfaces/`)
- **`_actions/`** — Next.js `"use server"` Server Actions: thin wrappers, no business logic
- **`hooks/`** — `"use client"` React hooks
- **`queries/`** — Read query wrappers for real-time subscriptions

---

## Package Naming Conventions

| Pattern | Examples |
|---------|---------|
| `<domain>-core` | `task-core`, `wiki-core`, `identity-core` |
| `<domain>-service` | `task-service`, `wiki-service` |
| `integration-*` | `integration-firebase`, `integration-upstash` |
| `shared-*` | `shared-types`, `shared-utils`, `shared-validators` |
| `ui-*` | `ui-shadcn`, `ui-vis` |

---

## Import Rules

```typescript
// ✅ Use package aliases
import { CommandResult, commandSuccess } from "@shared-types";
import { Button, Dialog } from "@ui-shadcn";
import { getFirebaseFirestore } from "@integration-firebase";
import { redis } from "@integration-upstash";

// ❌ Forbidden — use the package alias instead
import { CommandResult } from "@/shared/types";          // → @shared-types
import { Button } from "@/ui/shadcn/ui/button";         // → @ui-shadcn
import { getFirebaseFirestore } from "@/libs/firebase"; // → @integration-firebase
import { redis } from "@/libs/upstash";                 // → @integration-upstash
```

### Forbidden Import Patterns
- Circular dependencies between packages
- Direct `modules/*` imports from `apps/*` (use the module's `index.ts`)
- Direct internal imports from other packages (`@/ui/shadcn/ui/button` instead of `@ui-shadcn`)
- Shared "dumping grounds" — every file must belong to a clearly named package

---

## [S6] Token Refresh Claims Handshake

Three-party protocol ensuring the Frontend has up-to-date Custom Claims after role/policy changes:

```
Party 1 (Claims Handler)    ── emits TOKEN_REFRESH_SIGNAL → tokenRefreshSignals/{accountId}
Party 2 (IER CRITICAL_LANE) ── routes role:changed / policy:changed events
Party 3 (Frontend Hook)     ── onSnapshot → getIdToken(forceRefresh=true)
```

- **Party 3**: `useTokenRefreshListener(accountId)` — import from `@/modules/identity`
- Mount once per authenticated session in shell layout

---

## CommandResult Pattern [R4]

Every use case and server action returns `CommandResult`:

```ts
// Success
{ success: true, aggregateId: string, version: number }

// Failure
{ success: false, error: { code: string, message: string, context?: object } }
```

Import from `@shared-types`:
```typescript
import { type CommandResult, commandSuccess, commandFailureFrom } from "@shared-types";
```

---

## Migration Status (VSA → MDDD)

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | `packages/` directory created with all legacy root packages |
| Phase 2 | ✅ Complete | TypeScript path aliases configured; `shared/*` backward-compat shims added |
| Phase 3 | ✅ Complete | All legacy imports migrated; `shared/` shim deleted; domain packages + module READMEs added |
| Phase 4 | ⏳ Pending | Delete remaining legacy root folders (`libs/`, `infrastructure/`, `ui/`) when all modules' internal usages are migrated |

### Import Migration Summary (Phase 3)

All 73 files migrated to canonical package imports:

| Old Import | New Import | Files |
|-----------|-----------|-------|
| `@/shared/types` | `@shared-types` | 44 |
| `@/infrastructure/firebase/client` | `@integration-firebase` | 27 |
| `@/infrastructure/firebase` | `@integration-firebase` | 1 |
| `@/libs/firebase` | `@integration-firebase` | 2 |
| `@/libs/utils` | `@ui-shadcn` | 1 |

### Remaining Legacy Folders

The following root-level folders still exist for internal use by packages. Do NOT import them directly — use the package alias:

| Folder | Internal to Package | Notes |
|--------|-------------------|-------|
| `infrastructure/firebase/` | `@integration-firebase` | Still has its own barrel; packages re-export from it |
| `libs/firebase/` | `@integration-firebase` | Internal SDK wrappers |
| `libs/upstash/` | `@integration-upstash` | Internal SDK wrappers |
| `libs/utils.ts` | `@ui-shadcn` | `cn` function exported from `@ui-shadcn` |
| `ui/shadcn/` | `@ui-shadcn` | Internal component source |
| `ui/vis/` | `@ui-vis` | Internal vis.js wrappers |

---

## Validation Checklist

- [x] Domain layer has zero external dependencies
- [x] All data access goes through repository interfaces (ports)
- [x] UI does not contain business logic
- [x] Firebase only exists in `infrastructure/firebase/` directories (within modules)
- [x] Use-cases are framework-agnostic (pure TypeScript)
- [x] No feature-to-feature domain coupling
- [x] `CommandResult` contract used consistently across all use cases
- [x] Wallet operations use Firestore transactions (atomic balance enforcement)
- [x] Token refresh signal emitted after all role/policy changes [S6]
- [x] TypeScript strict mode: zero errors
- [x] ESLint: zero warnings/errors
- [x] Next.js build: passes
- [x] `packages/` layer created with proper `README.md` and `index.ts` for each package
- [x] TypeScript path aliases configured for all packages in `tsconfig.json`
- [x] All `@/shared/*` imports replaced with `@shared-types` / `@shared-utils`
- [x] All `@/infrastructure/firebase*` imports replaced with `@integration-firebase`
- [x] All `@/libs/firebase` imports replaced with `@integration-firebase`
- [x] `shared/` shim directory deleted
- [x] Domain packages created: `@task-core`, `@task-service`, `@skill-core`, `@matching-engine`, `@matching-service`
- [x] `@matching-engine` contains pure `matchTaskToSkills`, `assignTask`, `SkillMatcher` (zero I/O)
- [x] `@matching-service` orchestrates repos + engine via `MatchTaskUseCase` + `AssignTaskUseCase`
- [x] Module READMEs created: `modules/task`, `modules/skill`, `modules/knowledge`, `modules/matching`
- [x] Module → package mapping documented in `ARCHITECTURE.md` and `packages/README.md`
