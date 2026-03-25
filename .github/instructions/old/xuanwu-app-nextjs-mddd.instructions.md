---
name: 'Xuanwu App Nextjs MDDD'
description: 'Project-specific instructions for the xuanwu-app Next.js 16, React 19, and MDDD codebase.'
applyTo: '{app,packages,providers,debug}/**/*.{ts,tsx}'
---

# Xuanwu App Next.js + MDDD Development Instructions

Use for app-level work outside module-internal rule files.

## Layer Responsibilities

- `app/`: routing and composition; default Server Components; add `use client` only when required.
- `modules/`: vertical business contexts; follow `modules-*.instructions.md` for internals.
- `packages/`: stable shared boundaries; import by alias only.

## Import Rules

- Use `@/*`, `@shared-*`, `@integration-*`, `@api-contracts`, `@ui-*`, `@lib-*`.
- Do not use legacy paths: `@/shared/*`, `@/infrastructure/*`, `@/libs/*`, `@/ui/shadcn/*`, `@/ui/vis*`, `@/interfaces/*`.
- Cross-module imports must go through `@/modules/<target>/api` (or module public boundary), never internal layers.

## Development Practices

- UI: use `@ui-shadcn/*`; keep semantic and accessible markup.
- Server Actions: explicit `use server`, thin orchestration, return `CommandResult`.
- Validation and errors: validate at boundary; use shared validators and domain-consistent error model.
- Do not put infra logic in pages or domain files.

## Runtime & Documentation Boundaries

- Next.js owns browser-facing orchestration; `py_fn/` owns ingestion and heavy worker flows.
- Update docs when public boundaries, contracts, or runtime ownership changes (`packages/README.md`, module `README.md`, `py_fn/README.md`, ADR/contract docs).
- Keep terminology aligned with existing MDDD domain language.

## Validation Checklist

- Run required commands from `agents/commands.md`.
- If architecture or public boundaries changed, update corresponding docs in the same change.
- Keep scope focused; avoid unrelated fixes.
