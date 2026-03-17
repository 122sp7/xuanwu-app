# Project Overview

Project name: xuanwu-app
Stack: Next.js 16, React 19, TypeScript 5, Firebase client SDK, Tailwind CSS 4, Zod, Zustand, XState, Upstash.

Current top-level slices:
- app: Next App Router layouts, route groups, providers.
- modules: business features organized by bounded context.
- infrastructure: shared external adapters for axios, firebase, upstash.
- shared: cross-cutting pure types, validators, hooks, constants, utils.
- ui: reusable UI building blocks and shadcn-based primitives.
- lib: utility integrations for dragdrop, superjson, upstash, vis, xstate.

Current package scripts:
- npm run dev
- npm run build
- npm run start
- npm run lint

Important repository reality:
- This branch uses top-level app/modules/shared/ui directories.
- Older skill references mention src/ and docs/architecture; those paths are not present in this workspace snapshot.
- Do not assume test, typecheck, or check scripts exist unless package.json is updated.
