---
description: 'Cross-boundary rules for API-only collaboration between modules and runtimes.'
applyTo: '{app,modules,packages,providers,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Architecture API Boundary

## Core Rule

- Cross-module access must go through `modules/<target>/api` only.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.

## Allowed Patterns

- Import public facades or contracts from `modules/<target>/api`.
- Coordinate across contexts through explicit event contracts.

## Forbidden Patterns

- Reach-through imports into another module's private entities, repositories, or adapters.
- Hiding boundary bypasses behind barrels or re-export chains.

## Refactor Rule

- When boundary violations are found, replace them with API contracts or events in the same change.
- Do not leave temporary reach-through imports after refactors.

## Validation

- Use `eslint.config.mjs` restricted-import and boundary rules as the enforcement source.
- Re-check changed imports for `@/modules/` to confirm API-only access.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill slavingia-skills-mvp
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
