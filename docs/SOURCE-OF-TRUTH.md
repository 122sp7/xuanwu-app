# Source of Truth for Documentation Structure

This document defines the documentation routing model for Xuanwu.

## Documentation Ownership Model

1. `docs/ddd/` owns strategic DDD maps and documentation entrypoints.
2. `modules/<context>/*.md` owns bounded-context detail such as ubiquitous language, aggregates, domain events, context maps, repositories, and application services.
3. `docs/architecture/` owns cross-context reasoning, runtime boundaries, and ADR-driven explanation.
4. `docs/development/` owns implementation workflow and repository execution guidance.
5. `docs/reference/` owns exact facts and specification-style material.

## Diataxis Constraints

1. One purpose per document.
2. Prefer shallow hierarchy where practical.
3. Cross-link to the current owner instead of copying DDD content into multiple trees.
4. Keep strategic maps, context detail, and implementation guidance distinct.

## Project-Specific Notes

- `docs/ddd/subdomains.md` and `docs/ddd/bounded-contexts.md` are the top-level DDD routing entrypoints.
- Context detail is intentionally resolved through `modules/<context>/` until a future consolidation change explicitly moves ownership.
- Internal AI delivery and agent workflow docs may live under `docs/`, but they should not replace product or architecture entrypoints.
