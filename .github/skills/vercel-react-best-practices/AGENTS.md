# React Best Practices (Condensed)

This AGENTS file is intentionally compact to reduce repeated context load.

## Source of Truth

- Primary workflow: `./SKILL.md`
- Detailed rules: `./rules/`

## When to Apply

Use this guidance when working on React or Next.js implementation, review, or refactor tasks.

## Priority Order

1. Eliminate async waterfalls (`async-*`)
2. Reduce bundle size (`bundle-*`)
3. Improve server-side performance (`server-*`)
4. Optimize client fetching and rerenders (`client-*`, `rerender-*`)
5. Apply rendering and JS micro-optimizations (`rendering-*`, `js-*`, `advanced-*`)

## Minimal Execution Flow

1. Identify the slow path and classify by rule prefix.
2. Apply the highest-impact rule first.
3. Keep changes scoped and measurable.
4. Validate with project commands.

## Guardrails

- Prefer server-first data strategies in Next.js.
- Avoid speculative micro-optimizations before waterfall and bundle fixes.
- Do not duplicate long rule text here; keep details in `rules/*`.

## Validation

- Run `npm run lint`
- Run `npm run build`

## Note

If this file grows large again, move examples to `rules/` and keep this file as a routing index only.
