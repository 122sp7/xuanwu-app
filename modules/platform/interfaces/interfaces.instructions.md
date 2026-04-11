---
description: 'Platform interfaces layer rules: input/output translation, Server Actions, UI components, CLI wiring, and HTTP handler contracts.'
applyTo: 'modules/platform/interfaces/**/*.{ts,tsx}'
---

# Platform Interfaces Layer (Local)

Use this file as execution guardrails for `modules/platform/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/platform/*`.

## Core Rules

- This layer owns **input/output translation only** — no business rules, no repository calls.
- Server Actions (`_actions/`) must be thin: validate input, call the use case or dispatcher, return a stable result shape.
- Never call repositories directly from components, actions, or route handlers.
- UI components consume data via query hooks or Server Components; they do not hold domain logic.
- HTTP handlers (`api/`) map requests to platform commands via `mapHttpRequestToPlatformCommand` and map results via `mapPlatformResultToHttpResponse` — do not inline mapping logic.
- CLI handlers (`cli/`) follow the same pattern: parse → dispatch → render.
- Use shadcn/ui primitives before creating new components; keep semantic markup and accessibility intact.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
