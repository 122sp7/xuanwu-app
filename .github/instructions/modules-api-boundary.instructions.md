---
description: 'API-boundary rules for cross-module interaction in modules/ with explicit allowed and forbidden patterns'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, app/**/*.ts, app/**/*.tsx'
---

# Modules API Boundary

Cross-module interaction must remain explicit and minimal.

## Allowed

- `module A -> module B` via `@/modules/module-b/api`
- `module A -> module B` via module B's public barrel when that barrel is intentionally the declared API surface
- `module A -> module B` via domain events

## Forbidden

- `module A` importing `module B/domain/*`
- `module A` importing `module B/application/*`
- `module A` importing `module B/infrastructure/*`
- `module A` importing `module B/interfaces/*`
- `module A` importing `module B` repository implementations
- `module A` importing `module B` entities directly from private paths

## Boundary Rules

- Keep module internals private
- Export only the minimum needed from `api/`
- Prefer façades, query contracts, action contracts, or event contracts over exposing raw internal types
- When an existing boundary is too wide, narrow it during refactor instead of keeping leaks

## Good Example

```ts
import { contentFacade } from "@/modules/content/api";
import { publishDomainEvent } from "@/modules/event/api";
```

## Bad Example

```ts
import { FirebaseContentPageRepository } from "@/modules/content/infrastructure/firebase/FirebaseContentPageRepository";
import { ContentPage } from "@/modules/content/domain/entities/ContentPage";
```

## Validation

- Re-check all changed imports
- Run `npm run lint`
- Run `npm run build` when public types or barrels changed
