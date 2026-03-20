---
name: Xuanwu TypeScript Rules
description: Apply these rules when editing TypeScript and TSX files in Xuanwu.
applyTo: "**/*.{ts,tsx,mts}"
---
# TypeScript rules

- Respect the repo `tsconfig.json` baseline: TypeScript is in `strict` mode.
- Prefer explicit, domain-meaningful types for exported functions, DTOs, hooks, and public module APIs.
- Do not introduce new `any` types unless there is a hard interoperability constraint; prefer narrowing, generics, or `unknown` plus validation.
- Reuse the existing `@/*` path alias for internal imports instead of long relative traversals.
- Keep framework-free types and business rules out of UI-only files; shared contracts should live in the appropriate module, `shared/`, or `libs/` layer.
- When changing server/client boundaries in TSX files, keep Next.js runtime constraints and existing App Router patterns intact.
