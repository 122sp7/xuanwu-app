---
name: app-router-parallel-routes
description: Build and refactor Next.js app route slices and parallel-route UI blocks that keep data flow one-way, isolate local state, and consume Xuanwu modules only through public api boundaries. Use for dashboard areas, side tools, modals, chat consoles, and route composition work in app/.
---

# App Router Parallel Routes

Use this skill when work is centered on `app/` composition, especially when a route slice or parallel-route block must coordinate one UI feature area without leaking module internals into the route layer.

## When to use

- Creating or refactoring dashboard slices
- Adding a sidebar tool, modal slot, or chat console block
- Rewiring route composition to use module APIs only
- Separating local UI state between neighboring route blocks

## Workflow

1. Identify the route segment and its single UI responsibility.
2. List the module APIs the slice may consume.
3. Keep route files thin: composition, loading states, and rendering only.
4. Move interactive state into local components or hooks when needed.
5. Validate imports so no module internals are pulled into `app/`.

## Guardrails

- Do not import `domain/`, `application/`, or `infrastructure/` from `modules/`.
- Do not move business rules into route files.
- Do not create hidden state coupling between route blocks.

## Output expectations

- State the route slice responsibility
- State the consumed module APIs
- Note whether the slice is server or client
- Report validation performed