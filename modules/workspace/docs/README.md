# Workspace Documentation

Implementation-level documentation for the workspace bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/workspace/`:

- [README.md](../../../docs/contexts/workspace/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/workspace/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/workspace/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/workspace/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/workspace/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Current Sync Points

- Canonical workspace route authority stays in [../../../docs/contexts/workspace/README.md](../../../docs/contexts/workspace/README.md): use `/{accountId}/{workspaceId}`, not the legacy `/{accountId}/workspace/{workspaceId}` form.
- Account scope string contract authority stays in [../../../docs/contexts/workspace/ubiquitous-language.md](../../../docs/contexts/workspace/ubiquitous-language.md): local implementation docs and read models must use `"user" | "organization"`, not `"personal" | "organization"`.
- If workspace wiki/content-tree behavior changes, keep local implementation notes aligned with the root query projection while leaving strategic naming and route ownership in the root docs.
- System-wide baseline remains the root architecture set: Hexagonal + DDD, Firebase serverless backend, Genkit orchestration, Zustand/XState frontend state, and Zod runtime validation.

## Conflict Resolution

- Strategic docs in `docs/contexts/workspace/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
