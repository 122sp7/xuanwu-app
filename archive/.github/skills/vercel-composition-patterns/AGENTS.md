# React Composition Patterns (Condensed)

This AGENTS file is intentionally compact to reduce repeated context load.

## Source of Truth

- Primary workflow: `./SKILL.md`

## When to Apply

Use for component architecture and state-composition refactors in React codebases.

## Core Rules

1. Avoid boolean-prop proliferation for variants.
2. Prefer compound components for complex composition.
3. Lift state into provider boundaries when shared behavior is required.
4. Keep UI composition explicit and variant-specific.

## Minimal Execution Flow

1. Detect branching complexity and variant explosion.
2. Refactor to explicit variants and composition.
3. Move shared state and actions into context/provider only when needed.
4. Validate behavior parity and readability.

## Guardrails

- Do not turn simple components into over-engineered abstractions.
- Avoid copying large tutorial examples into this file.
- Keep this file as a high-signal checklist; place deep examples in `SKILL.md`.

## Validation

- Run `npm run lint`
- Run `npm run build`
