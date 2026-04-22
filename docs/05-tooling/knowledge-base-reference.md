# Knowledge Base — Implementation Navigation

> **Authority note**: Strategic bounded-context ownership, canonical vocabulary, and duplicate-name resolution are owned by `docs/**/*` and must not be redefined here. Use this file only as a quick implementation-surface lookup.

## Use This File For

- Locating implementation surfaces quickly
- Recalling boundary-safe import patterns
- Checking the high-level code layout before reading concrete files

## Docs Authority

- Strategic ownership, terminology, and duplicate-name resolution: `docs/01-architecture/domain/subdomains.md`, `docs/01-architecture/domain/bounded-contexts.md`, `docs/01-architecture/domain/ubiquitous-language.md`, `docs/01-architecture/contexts/<context>/*`
- Bounded-context scaffolding and root-layer rules: `docs/01-architecture/domain/bounded-context-subdomain-template.md`
- Delivery sequencing and validation entrypoint: `docs/README.md` and `docs/05-tooling/commands-reference.md`

## Boundary Summary

- Cross-module imports go through `src/modules/<target>/index.ts` only (not `api/`).
- Dependency direction is `interfaces/` → `application/` → `domain/` ← `infrastructure/`.
- `<bounded-context>` root may own context-wide `application/`, `domain/`, `infrastructure/`, and `interfaces/`; subdomains own local concerns.
- If a team adds `core/`, treat it as an optional inner wrapper only; do not put `infrastructure/` or `interfaces/` inside it.

## Repository Surfaces

- `src/app/`: Next.js route composition, shell UX, providers, and orchestration
- `src/modules/`: bounded-context and subdomain implementations
- `packages/`: stable shared boundaries exposed through `@shared-*`, `@lib-*`, `@integration-*`, `@ui-*`
- `fn/`: worker-side ingestion, parsing, chunking, embedding, and job execution

## Typical Module Shape

```text
src/modules/<context>/
├── index.ts            ← cross-module public boundary (only import this)
├── application/
├── domain/
├── infrastructure/
├── interfaces/
└── subdomains/<name>/
```
