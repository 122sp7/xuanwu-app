# Environment And Integrations

**Verified:** 2026-03-19

## Firebase
- `infrastructure/firebase/client.ts` initializes the Firebase web app.
- `infrastructure/firebase/admin.ts` reads `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- Client-side Firebase config expects `NEXT_PUBLIC_FIREBASE_*` variables.
- No tracked `.env*` file was found in the current workspace scan; do not assume checked-in environment files exist.

## Upstash
- `lib/upstash/box.ts`
- `lib/upstash/qstash.ts`
- `lib/upstash/redis.ts`
- `lib/upstash/vector.ts`
- `lib/upstash/workflow.ts`
- `lib/upstash/index.ts`

## Shared infrastructure adapters
- `infrastructure/axios/` for HTTP client concerns
- `infrastructure/firebase/` for web/admin Firebase bootstrap
- `infrastructure/upstash/` for shared Upstash-related adapters

## Other library integration areas
- `lib/dragdrop/` for drag-and-drop abstraction
- `lib/xstate/` for state machine helpers
- `lib/vis/` for visualization helpers
- `lib/tanstack/` for TanStack integration helpers
- `lib/react-markdown/` + `lib/remark-gfm/` for markdown rendering
- `lib/superjson/`, `lib/uuid/`, `lib/zod/`, `lib/zustand/`, `lib/date-fns/`

## Python Cloud Functions integration
- Python functions live under `lib/firebase/functions-python/`
- Runtime docs and ADRs live under `lib/firebase/functions-python/docs/adr/`
- Deploy via `npm run deploy:functions:python`

## Caution
- Only rely on an integration after checking whether the consuming module actually imports it on this branch.
- Some packages and helper libraries are present before full feature integration is completed.
