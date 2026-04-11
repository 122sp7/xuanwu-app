---
description: 'NotebookLM interfaces layer rules: input/output translation, Server Actions, RAG UI components, and chat action wiring.'
applyTo: 'modules/notebooklm/interfaces/**/*.{ts,tsx}'
---

# NotebookLM Interfaces Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/notebooklm/*`.

## Core Rules

- This layer owns **input/output translation only** — no RAG logic, no retrieval scoring, no prompt construction.
- Server Actions (`_actions/`) must be thin: validate input, call the use case, return a stable result shape.
- Never call repositories or AI clients directly from components or actions.
- `RagQueryView` and chat components consume data via query hooks or Server Components; keep them display-only.
- Streaming RAG responses must be handled at the action boundary; do not pass raw stream objects into domain or application layers.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and keyboard accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
