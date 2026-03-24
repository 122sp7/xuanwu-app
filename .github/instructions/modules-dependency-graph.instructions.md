---
description: 'Dependency-direction guardrails and example module edges for modules/ refactors under Xuanwu MDDD'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, app/**/*.ts, app/**/*.tsx'
---

# Modules Dependency Graph

Use this instruction when a change adds, removes, or redirects dependencies between modules.

## Core Rule

- Do not break dependency direction.
- Do not introduce reverse edges for convenience.
- Keep the graph acyclic unless an event-driven contract explicitly documents the exception.

## Current Example Edges

Use these as current guardrails for allowed direction in existing flows:

- `account -> workspace -> task -> finance`
- `account -> audit`
- `workspace -> content`
- `content -> graph`

These examples are directional, not exhaustive. If a change needs a new edge or a different direction, document and justify it in the same change.

## Dependency Rules

- Prefer `module -> target/api`
- Prefer event flows over internal reach-through
- Do not make lower-level foundational modules depend on higher-level feature modules
- Do not hide dependency inversions inside barrels

## Refactor Checklist

1. Identify current incoming and outgoing module dependencies.
2. Confirm the new direction preserves existing architectural intent.
3. Replace forbidden edges with API or event contracts.
4. Update docs when an approved dependency edge changes.

## Validation

- Search changed imports for `@/modules/`
- Verify no new cross-module internal import paths were introduced
- Run `npm run lint`
- Run `npm run build`
