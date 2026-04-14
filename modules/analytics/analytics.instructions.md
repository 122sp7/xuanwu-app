---
description: Minimal rules for the analytics bounded context.
applyTo: 'modules/analytics/**/*.{ts,tsx,js,jsx,md}'
---

# Analytics Instructions

- `modules/analytics` owns analytics and reporting concerns only.
- Keep this module query-first and integration-light until concrete use cases arrive.
- Do not import peer module internals; use public `api/` contracts only.
- Keep domain logic framework-free.
