---
description: 'Consolidated runtime architecture rules across src/app, src/modules, packages, providers, debug, and py_fn with explicit Next.js and worker boundaries.'
applyTo: '{src/app,src/modules,packages,providers,debug,py_fn}/**/*.{ts,tsx,js,jsx,py,md}'
---

# Architecture Runtime

## Boundary Model

- `src/app/` composes module APIs and package aliases.
- `src/modules/` own business capabilities by bounded context.
- `packages/` provide stable shared implementations through aliases.
- `py_fn/` owns ingestion and heavy worker jobs.

## Runtime Ownership

- Next.js owns browser-facing interactions, auth/session, server actions, and route orchestration.
- `py_fn/` owns heavy, retryable, and asynchronous ingestion/embedding jobs.

## Responsibility Split

- Next.js handles upload UX, browser-facing APIs, and response orchestration.
- `py_fn/` handles parse, clean, taxonomy, chunk, embed, and persistence pipelines.

## Data Boundary

- Keep Firestore contracts explicit and version-aware.
- Avoid implicit schema drift across contexts.
- Preserve source/chunk metadata traceability for audit and citation needs.

## Import and Source Rules

- Use configured aliases; avoid legacy import families.
- Avoid cross-layer relative imports across contexts.
- Use external documentation only when local sources are insufficient or behavior is version-sensitive.
- Prefer local authority first: `AGENTS.md`, `.github/copilot-instructions.md`, module docs, local code.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
