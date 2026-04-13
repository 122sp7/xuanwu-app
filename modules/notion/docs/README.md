# Notion Documentation

Implementation-level documentation for the notion bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/notion/`:

- [README.md](../../../docs/contexts/notion/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/notion/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/notion/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/notion/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/notion/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Current Sync Points

- Workspace route authority stays outside notion: when local implementation docs mention shell-facing navigation, point to the canonical workspace route `/{accountId}/{workspaceId}` owned by workspace composition.
- Scope-token authority stays in the root docs: notion consumes `accountId` and `workspaceId` as published scope inputs and uses concrete user identifiers such as `currentUserId` or `createdByUserId` for acting users.
- If notion implementation notes describe AI or orchestration, keep ownership language aligned with the root baseline: platform owns shared AI capability; notion consumes it.
- System-wide baseline remains the root architecture set: Hexagonal + DDD, Firebase serverless backend, Genkit orchestration, Zustand/XState frontend state, and Zod runtime validation.

## Conflict Resolution

- Strategic docs in `docs/contexts/notion/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
