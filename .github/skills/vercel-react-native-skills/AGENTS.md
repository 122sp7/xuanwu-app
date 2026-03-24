# React Native Skills (Condensed)

This AGENTS file is intentionally compact to reduce repeated context load.

## Source of Truth

- Primary workflow: `./SKILL.md`

## When to Apply

Use when writing, reviewing, or refactoring React Native UI, state, animation, list performance, and navigation code.

## Priority Order

1. Prevent runtime crashes (rendering rules first).
2. Fix list and scroll performance bottlenecks.
3. Improve animation and interaction responsiveness.
4. Apply state architecture and compiler-safe patterns.

## Minimal Execution Flow

1. Classify issue by category (rendering, list, animation, state, navigation).
2. Apply high-impact rule changes before stylistic changes.
3. Keep props stable and avoid unnecessary rerenders.
4. Validate on representative scenarios.

## Guardrails

- Do not duplicate long handbook content in this file.
- Prefer explicit conditional rendering over brittle shorthand in RN.
- Keep this file concise; deep examples belong in `SKILL.md`.

## Validation

- Run project lint/build commands.
- Run platform-specific tests where applicable.
