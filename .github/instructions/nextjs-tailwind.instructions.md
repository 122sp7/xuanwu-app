---
description: 'Use these rules for Xuanwu Next.js 16, React 19, Tailwind 4, and shadcn-based UI implementation.'
applyTo: 'app/**/*.ts,app/**/*.tsx,modules/**/*.tsx,ui/**/*.ts,ui/**/*.tsx,app/globals.css,tailwind.config.ts'
---

# Xuanwu Next.js and Tailwind Rules

## Stack Context

- This repository uses Next.js App Router, React 19, Tailwind CSS 4, and shadcn-based UI primitives.
- Preserve the Xuanwu dependency direction: UI coordinates presentation, while workflows and business rules stay out of route and component files.
- Prefer the existing shell patterns under `app/(shell)` and reusable primitives under `ui/` before inventing new layouts or controls.

## Next.js Architecture

- Default to Server Components. Add `use client` only when interactivity, browser APIs, or client-only state are required.
- Keep route files and layouts thin. They should compose UI, load boundary-safe data, and wire actions, not absorb business logic.
- Keep server-only concerns on the server side and avoid leaking Firebase admin, secrets, or infrastructure details into client components.
- Use loading, empty, and error states intentionally for shell and module surfaces instead of rendering large blank gaps.
- When changing navigation, cache, streaming, hydration, or shell behavior, verify runtime behavior with next-devtools MCP first.

## Tailwind and Design Tokens

- Prefer token-backed utility classes and shared design primitives over ad-hoc arbitrary values.
- Keep spacing, radius, color, and typography consistent with the shell and existing shadcn usage.
- Reuse existing semantic layout patterns for cards, dashboards, sidebars, drawers, lists, and forms before creating custom combinations.
- Keep responsive behavior explicit for mobile and desktop; do not assume desktop-first shell layouts will degrade acceptably on small screens.
- Prefer semantic HTML and accessibility-safe composition while styling with Tailwind utilities.

## Component Composition

- Prefer composing from `ui/shadcn` and existing `ui/` wrappers before adding new primitives or forking component behavior.
- Split server and client responsibilities cleanly. Pass only the data and actions the client component actually needs.
- Keep props narrow, explicit, and domain-meaningful; avoid oversized prop bags and hidden side effects.
- If visible UI changes are introduced, capture a runtime-verified screenshot after implementation.

## Data, State, and Forms

- Prefer server-driven data loading where possible and keep client state focused on interaction, not duplicated server truth.
- Use optimistic or deferred UI only when the interaction benefit is clear and the failure path is handled explicitly.
- Keep loading and pending states visible for forms, shell transitions, and async actions.
- Do not hardcode user-facing copy for surfaces intended to be localized; use the repository's localization pattern.

## Performance and Assets

- Use `next/image` when introducing content images or image-heavy UI where optimization matters.
- Keep client bundles small by avoiding unnecessary client components and by deferring heavy client-only modules when possible.
- Prefer route-level and component-level code splitting over shipping broad client-side logic by default.
- Re-check shadcn MCP before introducing new visual primitives that could fragment styling or interaction patterns.