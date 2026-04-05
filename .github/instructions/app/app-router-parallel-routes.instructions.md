---
name: 'App Router Parallel Routes'
description: 'Rules for app/ route slices and parallel-route UI blocks that compose module APIs without importing module internals.'
applyTo: 'app/**/*.{ts,tsx}'
---

# App Router Parallel Routes

Use this instruction for work in `app/`.

## Composition Rules

- Treat each route slice or parallel-route block as one feature area: dashboard surface, sidebar tool, modal, or chat console.
- Keep data flow one-way from module API -> route composition -> local UI state.
- Import module behavior through `@/modules/<target>/api` only.
- Keep route files focused on composition, loading states, and rendering.

## Guardrails

- Do not import `domain/`, `application/`, or `infrastructure/` from any module.
- Do not move business rules into `app/`.
- Keep slot-local state isolated; do not hide coupling through shared mutable module state.
- Prefer Server Components by default; add `use client` only where interactivity requires it.

## Validation

- Run the app-level commands from `agents/commands.md` that match the touched files.
- If routing or public API usage changes, update affected docs or prompt/instruction references in the same change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
