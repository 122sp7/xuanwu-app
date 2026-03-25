---
name: 'Modules API Boundary'
description: 'API-boundary rules for cross-module interaction in modules/ with explicit allowed and forbidden patterns'
applyTo: 'modules/**/*.{ts,tsx,js,jsx}'
---

# Modules API Boundary

Cross-module interaction must remain explicit and minimal.

## Allowed vs. Forbidden

| Pattern | Status | Example |
| --- | --- | --- |
| Import via target module public boundary (`@/modules/<target>` or `@/modules/<target>/api`) | ✅ **Allowed** | `import { contentFacade } from "@/modules/content/api"` |
| Import `<target>/domain/*`, `<target>/application/*`, `<target>/infrastructure/*`, `<target>/interfaces/*` | ❌ **Forbidden** | `import { ContentPage } from "@/modules/content/domain/entities/..."` |
| Import private repositories or entities | ❌ **Forbidden** | `import { FirebaseContentPageRepository } from "@/modules/content/infrastructure/..."` |

## Rules

- Keep module internals private
- Export only minimum needed from `api/`
- Prefer façades, contracts, or events over exposing raw types
- Narrow wide boundaries during refactor, not incrementally

## Validation

- Re-check all changed imports
- Run validation commands from `agents/commands.md` based on change scope
- Rely on `eslint.config.mjs` as the enforcement source for restricted-import patterns
