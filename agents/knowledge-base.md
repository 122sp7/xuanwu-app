# Knowledge Base — MDDD Domain & Architecture

This file contains domain knowledge about the xuanwu-app architecture and codebase. For coding rules, see [`rules/`](rules/).

## Module-Driven Domain Design (MDDD)

The project follows **Module-Driven Domain Design**: each business capability is a self-contained module under `modules/`. The architecture is **module-driven, not layer-driven** — code is grouped by domain context first, then by technical layer within each module.

### Core Principle

> Every module owns a bounded context. Modules communicate through `modules/<target-module>/api/` only, never by reaching into each other's internals.

### Global Dependency Direction

```
UI (interfaces/) → Application (application/) → Domain (domain/) ← Infrastructure (infrastructure/)
```

The domain layer has **zero outward dependencies**. Infrastructure implements domain-defined interfaces.

## Module Structure

Each module under `modules/` follows a four-layer Clean Architecture:

```
modules/<module-name>/
├── api/
│   └── index.ts                # Public cross-module API boundary (the ONLY import point for other modules)
├── index.ts                    # Optional local barrel for same-module composition
├── README.md                   # Module documentation (optional)
├── domain/
│   ├── entities/               # Aggregate roots, value objects, entity types
│   ├── repositories/           # Repository interfaces (contracts, NOT implementations)
│   ├── services/               # Pure domain services (stateless business rules)
│   ├── value-objects/          # DDD value objects (immutable, equality by value)
│   └── ports/                  # Hexagonal ports for cross-cutting dependencies (optional)
├── application/
│   ├── use-cases/              # One file per use case (single operation)
│   └── dto/                    # Data Transfer Objects for use-case I/O
├── infrastructure/
│   ├── firebase/               # Firebase Firestore repository implementations
│   ├── genkit/                 # AI/Genkit integrations (AI module)
│   ├── default/                # In-memory or simplified implementations
│   ├── memory/                 # In-memory stores (e.g., billing placeholder)
│   ├── persistence/            # Persistence adapters
│   └── repositories/           # Repository implementations (alternative layout)
└── interfaces/
    ├── components/             # React UI components
    ├── queries/                # TanStack Query hooks (read-side)
    ├── _actions/               # Next.js Server Actions (write-side)
    ├── hooks/                  # Custom React hooks
    ├── api/                    # REST API route controllers
    ├── contracts/              # API contracts
    └── view-models/            # View model transformations
```

Not every module has every subdirectory — only what it needs.

### Boundary Policy

- Every `modules/<module-name>/` is isolated.
- Cross-module imports are allowed only via `modules/<target-module>/api/`.
- Keep guidance generic by default: do not prescribe a fixed domain-to-module mapping unless a governing contract explicitly requires it.
- Keep boundaries explicit: business logic stays in `domain/` + `application/`; UI and UX concerns stay in `interfaces/` and `app/` composition.

## Module Inventory

Current module directories under `modules/` represent bounded contexts. Treat names as implementation-specific and avoid using this list as a hard-coded ownership policy for future design:

`acceptance`, `account`, `ai`, `audit`, `billing`, `collaboration`, `content`, `event`, `file`, `finance`, `graph`, `identity`, `issue`, `knowledge`, `namespace`, `notification`, `organization`, `qa`, `search`, `shared`, `storage`, `task`, `wiki-beta`, `workspace`, `workspace-feed`, `workspace-flow`, `workspace-planner`.

## Package System (21 Packages)

Packages under `packages/` are **stable public boundaries** — the single source of truth for shared concerns. They contain actual implementations (no re-export chains).

### Import Rule

```typescript
// ✅ CORRECT — via @alias from tsconfig.json
import type { CommandResult, DomainError } from "@shared-types";
import { cn, formatDate } from "@shared-utils";
import { auth } from "@integration-firebase";

// ❌ NEVER — relative paths to package internals
import type { CommandResult } from "../../../../packages/shared-types/index";

// ❌ NEVER — legacy paths (ESLint will block)
import type { CommandResult } from "@/shared/types";
```

### Package Catalog

| Alias | Package | Purpose |
|-------|---------|---------|
| `@shared-types` | shared-types | `CommandResult`, `DomainError`, `Timestamp`, primitive types |
| `@shared-utils` | shared-utils | `cn()`, `formatDate()`, `generateId()` |
| `@shared-validators` | shared-validators | Zod schemas for cross-cutting validation |
| `@shared-constants` | shared-constants | `APP_NAME`, `PAGINATION_DEFAULTS` |
| `@shared-hooks` | shared-hooks | `useAppStore` (Zustand global state) |
| `@integration-firebase` | integration-firebase | Firebase client (auth, firestore, storage, messaging, functions, database, analytics, appcheck, performance, remote-config) |
| `@integration-http` | integration-http | Axios HTTP client with interceptors |
| `@api-contracts` | api-contracts | REST route registry + GraphQL schema |
| `@ui-shadcn` | ui-shadcn | shadcn/ui components, `cn()` utility, hooks |
| `@ui-vis` | ui-vis | Vis.js React components (VisNetwork, VisTimeline) |
| `@lib-date-fns` | lib-date-fns | date-fns v4 wrapper |
| `@lib-zod` | lib-zod | Zod v4 wrapper |
| `@lib-uuid` | lib-uuid | UUID v13 wrapper |
| `@lib-zustand` | lib-zustand | Zustand v5 wrapper |
| `@lib-xstate` | lib-xstate | XState v5 + React hooks |
| `@lib-tanstack` | lib-tanstack | TanStack Query/Form/Table/Virtual |
| `@lib-superjson` | lib-superjson | SuperJSON for serialization |
| `@lib-dragdrop` | lib-dragdrop | Atlaskit Pragmatic Drag and Drop |
| `@lib-react-markdown` | lib-react-markdown | react-markdown wrapper |
| `@lib-remark-gfm` | lib-remark-gfm | remark-gfm for GitHub-flavored markdown |

### ESLint Boundary Enforcement

Legacy import paths are blocked by `eslint.config.mjs`:

| Blocked Pattern | Replacement |
|----------------|-------------|
| `@/shared/*` | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-constants`, `@shared-hooks` |
| `@/infrastructure/*` | `@integration-firebase`, `@integration-http` |
| `@/libs/*` | `@lib-*` or `@integration-*` |
| `@/ui/shadcn/*` | `@ui-shadcn/*` |
| `@/ui/vis*` | `@ui-vis` |
| `@/interfaces/*` | `@api-contracts` |

## Tech Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.7 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5 |
| Backend | Firebase (client SDK) | 12 |
| Styling | Tailwind CSS | 4 |
| Validation | Zod | 4.3.6 |
| State (global) | Zustand | 5.0.12 |
| State (machines) | XState + @xstate/react | 5.28.0 / 6.1.0 |
| AI | Genkit + Google GenAI | 1.30.1 |
| Data Fetching | TanStack (Query, Table, Form, Virtual) | 5/8/1/3 |
| Visualization | Vis (network, timeline, graph3d, vis-data) | Various |
| Date Handling | date-fns | 4 |
| HTTP Client | Axios | 1.13.6 |
| Drag & Drop | @atlaskit/pragmatic-drag-and-drop | Latest |
| Node Engine | Node.js | 24 |

## Key Architectural Patterns

### Repository Pattern

- **Interface** lives in `domain/repositories/` — defines what the module needs
- **Implementation** lives in `infrastructure/` — how to fetch/persist (Firebase, memory, etc.)
- Domain layer never imports infrastructure

### Use Case Pattern

- Each use case is a single file under `application/use-cases/`
- Naming: `verb-noun.use-case.ts` (e.g., `list-workspace-files.use-case.ts`)
- One use case = one user-facing operation

### Hexagonal Ports (Advanced)

Example port shapes:
- `domain/ports/ActorContextPort.ts` — resolves who is acting
- `domain/ports/WorkspaceGrantPort.ts` — checks workspace permissions
- `domain/ports/OrganizationPolicyPort.ts` — checks tenant policies
- All access decisions flow through ports, not scattered in UI/router

### Domain Events

Example event use cases:
- `publish-domain-event.ts` — publishes events to the event store
- `list-events-by-aggregate.ts` — queries events by aggregate ID
- Dispatch policy controls event routing

### Internal Imports Within a Module

Inside a module, files use **relative imports** (not the module's own barrel export):

```typescript
// ✅ Inside modules/wiki-beta/application/use-cases/create-wiki-beta-page.use-case.ts
import { WikiBetaPage } from "../../domain/entities/wiki-beta-page.entity";
import type { IWikiBetaPageRepository } from "../../domain/repositories/iwiki-beta-page.repository";

// ❌ Do NOT self-import via the barrel
import { WikiBetaPage } from "@/modules/wiki-beta";
```

### Cross-Module Imports

Between modules, always use the target module's `api/` boundary:

```typescript
// ✅ Cross-module import
import { publishDomainEvent } from "@/modules/event/api";

// ❌ Reaching into another module's internals
import { publishDomainEvent } from "@/modules/event/application/use-cases/publish-domain-event";
```

## Responsibility Boundaries

- Define ownership per feature or contract, not by hard-coded domain naming assumptions.
- If a capability spans modules, formalize the boundary in `api/` and keep each module's internals private.
- When ownership shifts, update contracts and architecture docs in the same change.
