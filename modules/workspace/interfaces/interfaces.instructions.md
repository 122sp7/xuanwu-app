---
description: 'Workspace interfaces layer rules: input/output translation, Server Actions, workspace UI components, hooks, view-models, and session state wiring.'
applyTo: 'modules/workspace/interfaces/**/*.{ts,tsx}'
---

# Workspace Interfaces Layer (Local)

Use this file as execution guardrails for `modules/workspace/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/workspace/*`.

## Core Rules

- This layer owns **input/output translation only** — no workspace lifecycle rules, no capability policy.
- Server Actions (`interfaces/api/actions/`) must be thin: validate input, call the application service, return a stable result shape.
- Never call repositories directly from components, hooks, or actions.
- View-models (`view-models/`) translate DTOs into UI-specific shapes — keep them in `interfaces/`, not in `application/`.
- Session state (`state/workspace-session.ts`, `state/workspace-settings.ts`) is UI state only; do not persist domain decisions here.
- `interfaces/api/` exposes tRPC facades and query handlers for workspace — keep route and action wiring separate from business logic.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
