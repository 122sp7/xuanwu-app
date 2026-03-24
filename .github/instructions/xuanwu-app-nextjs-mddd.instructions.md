---
description: 'Project-specific instructions for the xuanwu-app Next.js 16, React 19, and MDDD codebase.'
applyTo: 'app/**/*.ts, app/**/*.tsx, packages/**/*.ts, packages/**/*.tsx, providers/**/*.ts, providers/**/*.tsx, debug/**/*.ts, debug/**/*.tsx'
---

# Xuanwu App Next.js + MDDD Development Instructions

These instructions apply to the main xuanwu-app web application outside module-internal architecture rules. Use them together with the repository-wide instruction files in `.github/instructions/`.

## Project Context

- Runtime: Next.js 16 App Router on Node.js 24
- UI stack: React 19, Tailwind CSS, shadcn/ui, Lucide
- Architecture: MDDD with `app/`, `modules/`, `packages/`, and `py_fn/`
- Package manager: npm
- Validation command source: `agents/commands.md`

## Layer Responsibilities

| Layer | Responsibilities |
| --- | --- |
| **`app/`** | Routing, layouts, route groups, route handlers, page composition. Use Server Components by default; add `'use client'` only for browser APIs, interactivity, or hooks. Keep providers in `app/providers/`. |
| **`modules/`** | Vertical business slices. For module-internal structure, naming, boundary, and dependency rules, defer to `modules-*.instructions.md` to avoid duplicate guidance. |
| **`packages/`** | Stable public boundaries with real implementations (no shims). Import via aliases only; no relative paths across packages. |

## Import Rules

| Rule | Pattern | Examples |
| --- | --- | --- |
| **App code** | `@/*` | `@/app/(shell)/workspace`, `@/providers/app-provider` |
| **Shared** | `@shared-*` | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-constants`, `@shared-hooks` |
| **Integrations** | `@integration-*` | `@integration-firebase`, `@integration-http` |
| **API Contracts** | `@api-contracts` | REST/GraphQL schemas |
| **UI Libraries** | `@ui-*` | `@ui-shadcn`, `@ui-vis` |
| **Other** | `@lib-*` | date-fns, zod, zustand, etc. |

**Forbidden legacy patterns**: `@/shared/*`, `@/infrastructure/*`, `@/libs/*`, `@/ui/shadcn/*`, `@/ui/vis*`, `@/interfaces/*`

**Cross-module imports from app**: Use `@/modules/<target>/api` (or the target module public boundary) instead of internal module layer paths.

## Development Practices

- **Components**: Use shadcn/ui via `@ui-shadcn/*`. Prefer semantic HTML, accessible labels, keyboard-friendly interactions.
- **Utilities**: Reuse `@shared-utils` and `@ui-shadcn/utils` instead of duplicating code.
- **Server Actions**: Keep explicit with `'use server'`. Delegate to use cases, return `CommandResult`.
- **Validation**: Use shared types and validators. Validate at boundary before invoking business logic.
- **Error Handling**: Prefer `CommandResult` and domain error patterns for mutation flows.
- **Infrastructure**: Keep in repositories and adapters, not in pages or domain files.

## Runtime & Documentation Boundaries

- **Runtime boundary**: Keep browser-facing product in Next.js; move ingestion, parsing, chunking, embedding, and retryable worker logic to `py_fn/`.
- **Documentation**: Update docs when architecture, public contracts, or runtime ownership changes:
  - `packages/README.md` — package alias or responsibility changes
  - Module `README.md` — scope or `api/` boundary changes
  - `py_fn/README.md` or ADRs — runtime boundaries or ingestion contracts
  - `docs/decision-architecture/` or `docs/development-reference/` — architectural contracts
- **Terminology**: Keep aligned with existing MDDD and domain language in the repository.

## Validation Checklist

Before finishing a change:

- Run applicable validation commands listed in `agents/commands.md`.
- If you changed architecture or public boundaries, verify the related docs were updated.
- Keep changes focused. Do not fix unrelated issues as part of the same change.
