---
description: 'Dependency-direction guardrails for modules/ refactors under Xuanwu MDDD'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx'
---

# Modules Dependency Graph

Use this instruction when a change adds, removes, or redirects dependencies between modules.

## Core Rule

- Do not break dependency direction.
- Do not introduce reverse edges for convenience.
- Keep the graph acyclic unless an event-driven contract explicitly documents the exception.

## Canonical Dependency Source

Do not treat this file as a full edge registry. For concrete decisions, use these sources in order:

1. `modules/<target>/api` as the only cross-module import boundary
2. `agents/knowledge-base.md` for MDDD boundary policy
3. `eslint.config.mjs` boundary and restricted-import enforcement

If a change needs a new edge or direction change, document and justify it in the same change.

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
- Run validation commands from `agents/commands.md` based on change scope
