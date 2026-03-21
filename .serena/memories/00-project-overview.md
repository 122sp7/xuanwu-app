# Project Overview

**Project name:** xuanwu-app  
**Verified:** 2026-03-19 on branch `copilot/redesign-scheduling-task-system`

## Stack (exact versions from package.json)

- Next.js 16.1.7 (App Router)
- React 19.2.3
- TypeScript 5
- Firebase 12 (client SDK)
- Tailwind CSS 4
- Zod 4.3.6
- Zustand 5.0.12
- XState 5.28.0 + @xstate/react 6.1.0
- Genkit 1.30.1 + @genkit-ai/google-genai 1.30.1
- Upstash: box 0.1.24, qstash 2.9.1, redis 1.37.0, vector 1.2.3, workflow 1.1.1
- TanStack: Query 5, Table 8, Form 1, Virtual 3
- Vis: network 10, timeline 8, graph3d 7, vis-data 8
- date-fns 4, Axios 1.13.6, uuid 13, superjson 2, sonner 2, recharts 2, cmdk 1
- Drag-and-drop: @atlaskit/pragmatic-drag-and-drop stack
- Node engine: 24

## Top-level directory slices (all verified to exist)

| Path | Role |
|------|------|
| `app/` | Next.js App Router: layouts, route groups, providers |
| `core/` | Cross-cutting bounded-context cores (event-core, knowledge-core, namespace-core) |
| `modules/` | 17 feature modules — see 02-module-index |
| `packages/` | Stable public boundary layer: 21 TypeScript packages with @alias paths |
| `functions-python/` | Python Firebase Functions worker runtime (RAG ingestion, Document AI) |
| `docs/` | Architecture decisions, designs, contracts (see 06-docs-index) |
| `assets/`, `public/` | Static assets |

## npm scripts (verified from package.json)

- `npm run dev` — Next.js dev server (Turbopack implied by Next 16)
- `npm run build` — production build
- `npm run start` — start production build
- `npm run lint` — ESLint
- `deploy:firestore:indexes|rules`, `deploy:storage:rules`, `deploy:rules`, `deploy:apphosting`, `deploy:functions`, `deploy:functions:python`, `deploy:functions:all`, `deploy:firebase`
- `repomix:skill`, `repomix:remote`, `repomix:remote:vscode-docs`

## Validation guidance

- No `typecheck`, `test`, or `check` script in package.json on this branch.
- Run `npm run lint` or `npm run build` to validate changes.

## Python Cloud Functions

- Location: `functions-python/`
- Runtime: Python with Firebase Functions v2
- Domains: `rag_ingestion` (full MDDD), `document_ai` (full MDDD)
- Deploy: `npm run deploy:functions:python`
