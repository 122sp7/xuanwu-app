---
description: 'Cross-boundary rules for API-only collaboration between modules and runtimes.'
applyTo: '{app,modules,packages,providers,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Architecture API Boundary

## Core Rule

- Cross-module access must go through `modules/<target>/api` only.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.

## Allowed

- Public facade/contract imports from target module API.
- Event-based collaboration through published contracts.

## Forbidden

- Reach-through imports to private repository/entity implementations.
- Hidden boundary bypasses via barrel chains.

