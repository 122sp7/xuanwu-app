# Project Overview

Project name: xuanwu-app
Stack: Next.js 16.1.7, React 19.2.3, TypeScript 5, Firebase 12 client SDK, Tailwind CSS 4, Zod 4, Zustand 5, XState 5, Upstash (box/qstash/redis/vector/workflow), Genkit 1.30, TanStack (Query/Table/Form/Virtual), Vis (network/timeline/graph3d).

Current top-level slices:
- app: Next App Router layouts, route groups, providers.
- core: cross-cutting bounded-context cores (event-core, knowledge-core, namespace-core), each with full MDDD layers.
- modules: business features organized by bounded context (acceptance, account, ai, audit, billing, daily, file, finance, identity, issue, notification, organization, parser, qa, schedule, task, workspace).
- infrastructure: shared external adapters for axios, firebase, upstash.
- shared: cross-cutting pure types, validators, hooks, constants, utils.
- ui: reusable UI building blocks and shadcn-based primitives.
- lib: utility integrations for dragdrop, superjson, upstash, vis, xstate, tanstack, uuid, zod.
- interfaces: graphql, rest entrypoints.

Current package scripts (verified from package.json 2026-03-19):
- npm run dev
- npm run build
- npm run start
- npm run lint
- deploy:firestore:indexes, deploy:firestore:rules, deploy:storage:rules, deploy:rules, deploy:apphosting, deploy:functions, deploy:firebase
- repomix:skill, repomix:remote, repomix:remote:vscode-docs

Important repository reality:
- Node engine: 24.
- This branch is copilot/redesign-scheduling-task-system; main includes prior completed migrations.
- No typecheck, test, or check scripts in package.json on this branch.
- Validate changes with npm run lint or npm run build.
