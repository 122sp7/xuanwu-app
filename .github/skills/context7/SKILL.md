---
name: context7
description: >
  Auto-load verification skill for library/framework API accuracy. Use when confidence is below 99% on API signatures,
  version behavior, or config schema details. Resolve library ID and fetch official docs before answering.
user-invocable: false
disable-model-invocation: false
---

# Context7 MCP (Condensed)

## When to Trigger

Use Context7 before answering if there is uncertainty about:
- API parameters or return types
- Version-specific behavior
- Framework best practices
- Config schema formats

## Required Flow

1. Confidence check (<99% => must query Context7).
2. Resolve library ID.
3. Fetch docs by concrete topic.
4. Answer from docs, not memory.

## Tool Pattern

```text
context7:resolve-library-id({ libraryName: "next" })
context7:get-library-docs({
  context7CompatibleLibraryID: "<id>",
  topic: "specific API topic",
  tokens: 5000
})
```

## Xuanwu Common Targets

- next: app router, server actions, streaming
- firebase: firestore/auth/functions
- react/typescript/zod/shadcn: API and typing details

## Guardrails

- Do not guess if uncertain.
- Prefer official docs over training memory when conflict exists.
- Preserve full method signatures and key options in responses.

## Optional Serena Memory

If a queried API decision is reused in this repo, persist it via Serena memory to avoid repeated lookup.
