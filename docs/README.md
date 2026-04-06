# Xuanwu Documentation

This directory is the documentation root for Xuanwu's product, architecture, development workflow, and AI delivery assets.

## Primary Entry Points

- [ddd/subdomains.md](./ddd/subdomains.md): strategic subdomain classification
- [ddd/bounded-contexts.md](./ddd/bounded-contexts.md): canonical bounded-context map
- [architecture/README.md](./architecture/README.md): cross-context architecture and ADR reading path
- [reference/specification/system-overview.md](./reference/specification/system-overview.md): system and product overview
- [development/README.md](./development/README.md): implementation and contributor guides

## Structure

- `ddd/`: strategic DDD maps and routing entrypoints
- `architecture/`: cross-context architecture explanations, decisions, and system diagrams
- `development/`: implementation guidance and repository-local execution rules
- `guides/how-to/`: task-oriented procedures
- `guides/explanation/`: concept-oriented architecture and reasoning
- `reference/`: precise facts, specifications, and reference material
- `tutorials/`: guided learning paths
- `templates/`: documentation templates

## Routing Rules

1. Start with `ddd/` when the question is about ownership, boundaries, or terminology routing.
2. Use `modules/<context>/*.md` for bounded-context details such as ubiquitous language, aggregates, events, repositories, and application services.
3. Use `architecture/` for cross-context reasoning, runtime boundaries, and ADRs.
4. Use `reference/` for exact facts and specifications.

## Authoring Constraints

1. Each document should serve one Diataxis purpose.
2. Link to canonical material instead of copying bounded-context knowledge into multiple places.
3. Keep document routing explicit so humans and agents can find the current owner quickly.
