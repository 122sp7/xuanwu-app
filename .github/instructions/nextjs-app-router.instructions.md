---
name: Xuanwu Next.js App Router Rules
description: Use these rules for App Router routes, layouts, loading states, and server boundaries.
applyTo: "app/**/*.ts,app/**/*.tsx"
---
# Next.js App Router rules

- Preserve the App Router split between route entrypoints, layouts, server components, and client components.
- Keep data fetching and server-only concerns on the server side unless there is a clear interactive need.
- Do not move domain or application logic into route files; route files should orchestrate UI and boundary wiring only.
- Reuse shared shell patterns from `app/(shell)` instead of creating one-off navigation or layout behavior.
- When adding mutations, prefer explicit server boundaries and keep cache or revalidation behavior intentional.
