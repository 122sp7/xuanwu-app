# Environment And Integrations

**Verified:** 2026-03-21

## Firebase
- `packages/integration-firebase/client.ts` initializes the Firebase web app.
- `packages/integration-firebase/admin.ts` reads `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- Client-side Firebase config expects `NEXT_PUBLIC_FIREBASE_*` variables.
- No tracked `.env*` file was found in the current workspace scan; do not assume checked-in environment files exist.

## Upstash
- `packages/integration-upstash/box.ts`
- `packages/integration-upstash/qstash.ts`
- `packages/integration-upstash/redis.ts`
- `packages/integration-upstash/vector.ts`
- `packages/integration-upstash/workflow.ts`
- `packages/integration-upstash/index.ts`

## Shared infrastructure adapters
- `infrastructure/axios/` for HTTP client concerns
- Firebase and Upstash shared SDK entrypoints now live behind `@integration-firebase` and `@integration-upstash`

## Other library integration areas
- `packages/lib-dragdrop/` for drag-and-drop abstraction
- `packages/lib-xstate/` for state machine helpers
- `packages/lib-vis/` for visualization helpers
- `packages/lib-tanstack/` for TanStack integration helpers
- `packages/lib-react-markdown/` + `packages/lib-remark-gfm/` for markdown rendering
- `packages/lib-superjson/`, `packages/lib-uuid/`, `packages/lib-zod/`, `packages/lib-zustand/`, `packages/lib-date-fns/`

## Python Cloud Functions integration
- Python functions live under `libs/firebase/functions-python/`
- Runtime docs and ADRs live under `libs/firebase/functions-python/docs/adr/`
- Deploy via `npm run deploy:functions:python`

## Caution
- Only rely on an integration after checking whether the consuming module actually imports it on this branch.
- Consume cross-cutting integrations through package aliases, not through retired root `libs/*` or removed root `infrastructure/firebase|upstash` paths.
