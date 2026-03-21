# packages/

The `packages/` directory is the **executable layer** of the MDDD architecture. All production code that can be imported, tested, and deployed lives here. This is the layer that `apps/` and `modules/` depend on.

## Architecture Position

```
apps/          → composition layer (Next.js routes, layouts)
packages/      → executable units (implementations with strict boundaries)
modules/       → conceptual definitions (domain contracts, no business logic)
```

## Package Catalogue

### Shared Packages

| Package | Description | Alias |
|---------|-------------|-------|
| [`shared-types`](./shared-types/) | Core domain types: `CommandResult`, `DomainError`, `Timestamp` | `@shared-types` |
| [`shared-utils`](./shared-utils/) | Pure utility functions and app-wide constants | `@shared-utils` |
| [`shared-validators`](./shared-validators/) | Zod validation schemas for cross-cutting inputs | `@shared-validators` |
| [`shared-hooks`](./shared-hooks/) | Cross-cutting React hooks and Zustand app store | `@shared-hooks` |

### Integration Packages

| Package | Description | Alias |
|---------|-------------|-------|
| [`integration-firebase`](./integration-firebase/) | Firebase SDK (Auth, Firestore, Storage, Functions, etc.) | `@integration-firebase` |
| [`integration-upstash`](./integration-upstash/) | Upstash services (Redis, Vector, QStash, Workflow) | `@integration-upstash` |
| [`integration-http`](./integration-http/) | Axios HTTP client for external API calls | `@integration-http` |

### UI Packages

| Package | Description | Alias |
|---------|-------------|-------|
| [`ui-shadcn`](./ui-shadcn/) | shadcn/ui component library (Radix-based primitives) | `@ui-shadcn` |
| [`ui-vis`](./ui-vis/) | vis.js visualization components (network, timeline) | `@ui-vis` |

### Domain Packages — Task

| Package | Description | Alias |
|---------|-------------|-------|
| [`task-core`](./task-core/) | Task domain: entity types and `TaskRepository` port | `@task-core` |
| [`task-service`](./task-service/) | Task use-cases, Firebase adapter, server actions, UI components | `@task-service` |

### Domain Packages — Skill

| Package | Description | Alias |
|---------|-------------|-------|
| [`skill-core`](./skill-core/) | Skill domain: `SkillEntity`, `AccountSkillEntity`, repository ports | `@skill-core` |

### Domain Packages — Matching

| Package | Description | Alias |
|---------|-------------|-------|
| [`matching-engine`](./matching-engine/) | Matching domain: request/assignment contracts, pure `SkillMatcher`, `matchTaskToSkills`, `assignTask` | `@matching-engine` |
| [`matching-service`](./matching-service/) | Matching orchestration: `MatchTaskUseCase`, `AssignTaskUseCase` (repo-backed) | `@matching-service` |

## Module → Package Mapping

| Module | Packages | Layer |
|--------|----------|-------|
| Cross-cutting | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-hooks` | Shared |
| Infrastructure | `@integration-firebase`, `@integration-upstash`, `@integration-http` | Integration |
| Presentation | `@ui-shadcn`, `@ui-vis` | UI |
| `modules/task` | `@task-core`, `@task-service` | Domain |
| `modules/skill` | `@skill-core` | Domain |
| `modules/matching` | `@matching-engine`, `@matching-service` | Domain |

## Dependency Rules

```
core packages     → no external dependencies
service packages  → core packages only
app               → all packages
```

### Forbidden

- ❌ Circular dependencies between packages
- ❌ Domain logic in integration or UI packages
- ❌ Direct imports from `libs/*`, `ui/shadcn/ui/*` — use the package alias instead
- ❌ Packages without a `README.md`

## Import Rules

```typescript
// ✅ Use package aliases
import { CommandResult } from "@shared-types";
import { Button } from "@ui-shadcn";
import { getFirebaseFirestore } from "@integration-firebase";
import type { WorkspaceTaskEntity } from "@task-core";

// ❌ Do not import legacy paths
import { CommandResult } from "@/shared/types";          // → @shared-types (DELETED)
import { Button } from "@/ui/shadcn/ui/button";         // → @ui-shadcn
import { getFirebaseFirestore } from "@/libs/firebase"; // → @integration-firebase
import { firebaseClientApp } from "@/infrastructure/firebase/client"; // → @integration-firebase
```

## Adding a New Package

1. Create `packages/<name>/`
2. Add `index.ts` with explicit exports only
3. Add `README.md` with Purpose, Public API, Dependencies, and Example sections
4. Add the tsconfig path alias in `tsconfig.json`
5. Run `npm run lint && npm run build` to verify

> "A package without a README.md does not exist."
