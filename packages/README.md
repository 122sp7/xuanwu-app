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

## Dependency Rules

```
core packages → no dependencies
service packages → core packages
app → all packages
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

// ❌ Do not import internal paths directly
import { CommandResult } from "@/shared/types";          // use @shared-types
import { Button } from "@/ui/shadcn/ui/button";         // use @ui-shadcn
import { getFirebaseFirestore } from "@/libs/firebase"; // use @integration-firebase
```

## Adding a New Package

1. Create `packages/<name>/`
2. Add `index.ts` with explicit exports only
3. Add `README.md` with Purpose, Public API, Dependencies, and Example sections
4. Add the tsconfig path alias in `tsconfig.json`
5. Run `npm run lint && npm run build` to verify

> "A package without a README.md does not exist."
