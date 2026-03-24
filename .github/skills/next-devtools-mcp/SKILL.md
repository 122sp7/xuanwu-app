---
name: next-devtools-mcp
description: >
  Auto-load skill for Next.js route architecture and diagnostics. Use for App Router, parallel routes, server components,
  server actions, streaming, hydration/performance checks, and Next.js config changes.
user-invocable: false
disable-model-invocation: false
---

# next-devtools MCP (Condensed)

## When to Use

Apply for tasks involving:
- App Router and route design
- Parallel/intercepting routes
- Server Components/Server Actions/Streaming
- Hydration and performance diagnostics

## Parallel Routes First

Prefer parallel routes when independent loading/error boundaries or URL-addressable slots are needed.

Use normal components when sections are purely visual and share lifecycle/data needs.

## Required Flow

1. Inspect current route tree.
2. Detect whether slot-based architecture is justified.
3. Design slot layout and default/loading/error boundaries.
4. Validate runtime behavior and performance.

## Tool Pattern

```text
next-devtools:get-routes()
next-devtools:get-route({ path: "/target" })
next-devtools:get-build-info()
next-devtools:analyze-page({ path: "/target" })
```

## Guardrails

- Avoid client-side data fetching by default when server components can fetch directly.
- Do not pack complex dashboards into one monolithic page when slot boundaries are needed.
- Keep one `default.tsx` per slot to prevent invalid route states.

## Collaboration

- Use Context7 when API details are uncertain.
- Persist important route decisions with Serena memory.
