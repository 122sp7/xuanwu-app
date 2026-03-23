---
description: 'Project-specific instructions for the xuanwu-app Next.js 16, React 19, and MDDD codebase.'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css'
---

# Xuanwu App Next.js + MDDD Development Instructions

These instructions apply to the main xuanwu-app web application. Use them together with the repository-wide instruction files in `.github/instructions/`.

## Project Context

- Runtime: Next.js 16 App Router on Node.js 24
- UI stack: React 19, Tailwind CSS, shadcn/ui, Lucide
- Architecture: MDDD with `app/`, `modules/`, `packages/`, and `py_fn/`
- Package manager: npm
- Validation commands:
  - `npm install`
  - `npm run lint`
  - `npm run build`

## Layer Responsibilities

### `app/`

- Use `app/` for Next.js routing, layouts, route groups, route handlers, and page composition.
- Keep page files focused on rendering, request orchestration, and wiring.
- Prefer Server Components by default. Add `'use client'` only for browser APIs, interactivity, local state, or hooks.
- Keep provider wiring in `app/providers/`.

### `modules/`

- Treat `modules/*` as vertical business slices.
- Keep the dependency direction `interfaces -> application -> domain <- infrastructure`.
- Keep `domain/` framework-free. Do not import React, Firebase SDKs, HTTP clients, or browser APIs into domain files.
- Put business workflows in `application/use-cases/`.
- Put framework adapters in `interfaces/`, such as:
  - `_actions/` for Server Actions
  - `components/` for React UI
  - `hooks/` for client hooks
  - `queries/` for fetch/query helpers
- Prefer thin Server Actions that delegate to use cases and return `CommandResult`.

### `packages/`

- Treat `packages/*` as stable public boundaries.
- Import from package aliases only. Do not reach into another package with relative paths.
- Keep real implementations in packages. Do not reintroduce shim or legacy paths.

## Import Rules

- Use `@/*` for app and module code.
- Use package aliases from `tsconfig.json` for shared code:
  - `@shared-types`
  - `@shared-utils`
  - `@shared-validators`
  - `@shared-constants`
  - `@shared-hooks`
  - `@integration-firebase`
  - `@integration-http`
  - `@api-contracts`
  - `@ui-shadcn`
  - `@ui-vis`
  - `@lib-*`
- Follow ESLint package-boundary enforcement. Do not use these legacy import families:
  - `@/shared/*`
  - `@/infrastructure/*`
  - `@/libs/*`
  - `@/ui/shadcn/*`
  - `@/ui/vis*`
  - `@/interfaces/*`
- Inside a module, prefer relative imports for that module's own internal files instead of importing the module's barrel back into itself.

### Good Example

```ts
import { formatDate } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { updateWorkspaceSettings } from "../_actions/workspace.actions";
```

### Bad Example

```ts
import { formatDate } from "@/shared/utils";
import { Button } from "@/ui/shadcn/ui/button";
import { updateWorkspaceSettings } from "@/modules/workspace";
```

### Internal Module Import Example

```ts
// Good: keep module-internal imports relative
import { updateWorkspaceSettings } from "../_actions/workspace.actions";

// Bad: do not re-import the module barrel from inside the same module
import { updateWorkspaceSettings } from "@/modules/workspace";
```

## Next.js and UI Practices

- Use the App Router conventions already present in `app/`.
- Keep Client Components focused and explicit with `'use client'`.
- Keep Server Actions explicit with `'use server'`.
- Use shadcn/ui components through `@ui-shadcn/*`.
- Use `@shared-utils` or `@ui-shadcn/utils` helpers instead of duplicating UI utility code.
- Prefer semantic HTML, accessible labels, and keyboard-friendly interactions.
- Reuse existing providers, tabs, cards, dialogs, and form primitives before introducing new patterns.

## Data, Validation, and Error Handling

- Use shared types and validators instead of redefining contracts locally.
- Prefer `CommandResult` and existing domain error patterns for mutation flows.
- Validate user input at the boundary before invoking business logic.
- Keep infrastructure concerns in repositories and adapters, not in pages or domain files.

## Runtime Boundary Rules

- Keep browser-facing product flows in Next.js.
- Keep heavy background ingestion and worker logic out of the main app runtime.
- When a change touches ingestion, parsing, chunking, embedding, or retryable worker flows, coordinate with the `py_fn/` runtime instead of moving that logic into `app/` or `modules/`.

## Documentation Update Rules

- Update related documentation when architecture, public contracts, or runtime ownership changes.
- Common examples:
  - update `packages/README.md` when adding or changing a package alias or package responsibility
  - update a module `README.md` when its scope or public API changes
  - update `py_fn/README.md` or ADRs when runtime boundaries or ingestion contracts change
  - update `docs/architecture/*` or `docs/reference/*` when architectural contracts move
- Keep terminology consistent with the existing MDDD and domain language already used in the repository.

## Validation Checklist

Before finishing a change:

- Install dependencies with `npm install` if needed.
- Run `npm run lint`.
- Run `npm run build`.
- If you changed architecture or public boundaries, verify the related docs were updated.
- Keep changes focused. Do not fix unrelated issues as part of the same change.
