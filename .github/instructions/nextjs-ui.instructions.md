---
name: Xuanwu Next.js UI Runtime Rules
description: Use these rules for App Router, RSC, shell UI, and shadcn-based interface work.
applyTo: "app/**/*.ts,app/**/*.tsx,ui/**/*.ts,ui/**/*.tsx,modules/**/*.tsx"
---
# Next.js and UI runtime rules

- Use `next-devtools` MCP to inspect real App Router and RSC behavior before changing shell flows, caching, navigation, or hydration-sensitive UI.
- For UI composition, check shadcn MCP before inventing new primitives or forking existing component behavior.
- Keep design tokens, spacing, typography, and control sizes consistent with the current shell.
- Reuse `ui/` and shadcn components before adding custom one-off buttons, modals, drawers, or lists.
- When external UI/product specs are provided as links or documents, normalize them with repo docs, loaded skills, or fetch tools before implementation.
- Capture screenshots for visible UI changes after runtime verification.
- If a UI change alters a reusable pattern, store that pattern in memory MCP so later migration steps stay aligned.
