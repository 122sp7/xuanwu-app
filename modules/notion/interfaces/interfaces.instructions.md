---
description: 'Notion interfaces layer rules: input/output translation, Server Actions, rich-text editor wiring, and knowledge UI components.'
applyTo: 'modules/notion/interfaces/**/*.{ts,tsx}'
---

# Notion Interfaces Layer (Local)

Use this file as execution guardrails for `modules/notion/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/notion/*`.

## Core Rules

- This layer owns **input/output translation only** — no content validation rules, no publication policy.
- Server Actions (`_actions/`) must be thin: validate input, call the use case, return a stable result shape.
- Never call repositories directly from components or actions.
- TipTap editor integration belongs here; do not let editor schema types leak into `domain/` or `application/`.
- Block editor stores (`store/block-editor.store.ts`) are UI state only — do not mix domain state with editor state.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and keyboard accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
