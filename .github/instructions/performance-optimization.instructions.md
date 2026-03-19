---
description: 'Use these rules when reviewing or implementing performance-sensitive code in Xuanwu across Next.js, React, Firebase, and infrastructure adapters.'
applyTo: 'app/**/*,core/**/*,modules/**/*,infrastructure/**/*,interfaces/**/*,lib/**/*,shared/**/*,ui/**/*'
---

# Xuanwu Performance Optimization Rules

## Core Principles

- Measure first, optimize second. Do not add complexity for hypothetical wins.
- Focus on the hottest user-visible paths: shell startup, route transitions, dashboards, large lists, search, and adapter-backed network flows.
- Prefer simpler designs that reduce client work, duplicated fetching, and cross-layer churn before introducing micro-optimizations.
- Treat performance regressions as both user-experience and architecture issues.

## Profiling and Verification

- For App Router, hydration, cache, and shell runtime behavior, inspect with next-devtools MCP before and after changes.
- Use browser profiling tools and network inspection when frontend rendering or bundle cost is the suspected bottleneck.
- Use targeted validation early, then rerun repo validation with `npm run lint` and `npm run build` after meaningful changes.
- Document non-obvious performance assumptions when they materially affect architecture, caching, or adapter behavior.

## Frontend and React

- Prefer Server Components and server-driven rendering over moving data work to the client.
- Reduce unnecessary client component boundaries, repeated derived work in render, and oversized prop payloads.
- Use stable keys for lists and paginate or virtualize large collections when the UI can grow materially.
- After profiling, prefer splitting components, narrowing props, or moving work server-side before defaulting to blanket memoization.
- Avoid adding `useMemo` or `useCallback` by reflex. Follow the repository's React guidance and only introduce them after a measured need.
- Debounce or throttle expensive interactive flows such as search, filtering, and resize-driven updates.

## Next.js and Network Boundaries

- Keep cache and revalidation behavior intentional. Avoid accidental duplicate fetches across route, layout, and client layers.
- Use route-level streaming, loading states, and code splitting to improve perceived performance on heavy shell surfaces.
- Keep third-party dependencies and client-only libraries off critical routes unless they provide clear value.
- Minimize payload size across interfaces and adapters. Prefer pagination, filtering, and incremental loading over large one-shot responses.

## Firebase, Upstash, and Adapter Layers

- Batch external calls where safe and avoid N+1 request patterns across repositories, controllers, and use-cases.
- Design Firestore and other document queries around actual access patterns; avoid loading broad collections when narrower selectors exist.
- Keep adapters thin and reusable so expensive networking or serialization logic does not get duplicated across modules.
- Be explicit about cacheability, TTL, and invalidation whenever Redis, vector, or workflow-backed data paths are introduced.

## Code Review Checklist

- Is the slow path measured or otherwise evidenced?
- Can work move from client to server or from UI to adapter/application layers?
- Are there duplicate fetches, redundant serialization steps, or repeated derived computations?
- Are large lists paginated, virtualized, or deferred appropriately?
- Are expensive dependencies loaded only where needed?
- Are adapter and data-access calls batched and free of obvious N+1 patterns?
- Are logging, retries, and error handling reasonable for hot paths?
- Does the optimization preserve readability and layer ownership?