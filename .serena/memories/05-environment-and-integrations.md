# Environment And Integrations

**Verified:** 2026-03-19

## Firebase
- `infrastructure/firebase/client.ts` initializes the Firebase web app.
- `infrastructure/firebase/admin.ts` reads `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- Client-side Firebase config expects `NEXT_PUBLIC_FIREBASE_*` variables.
- No tracked `.env*` file was found in the current workspace scan; do not assume checked-in environment files exist.

## Upstash
- `libs/upstash/box.ts`
- `libs/upstash/qstash.ts`
- `libs/upstash/redis.ts`
- `libs/upstash/vector.ts`
- `libs/upstash/workflow.ts`
- `libs/upstash/index.ts`

## Shared infrastructure adapters
- `infrastructure/axios/` for HTTP client concerns
- `infrastructure/firebase/` for web/admin Firebase bootstrap
- `infrastructure/upstash/` for shared Upstash-related adapters

## Other library integration areas
- `libs/dragdrop/` for drag-and-drop abstraction
- `libs/xstate/` for state machine helpers
- `libs/vis/` for visualization helpers
- `libs/tanstack/` for TanStack integration helpers
- `libs/react-markdown/` + `libs/remark-gfm/` for markdown rendering
- `libs/superjson/`, `libs/uuid/`, `libs/zod/`, `libs/zustand/`, `libs/date-fns/`

## Python Cloud Functions integration
- Python functions live under `libs/firebase/functions-python/`
- Runtime docs and ADRs live under `libs/firebase/functions-python/docs/adr/`
- Deploy via `npm run deploy:functions:python`

## Caution
- Only rely on an integration after checking whether the consuming module actually imports it on this branch.
- Some packages and helper libraries are present before full feature integration is completed.
