# Platform Documentation

Implementation-level documentation for the platform bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/platform/`:

- [README.md](../../../docs/contexts/platform/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/platform/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/platform/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/platform/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/platform/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Current Sync Points

- Canonical governance route authority stays in [../../../docs/contexts/platform/README.md](../../../docs/contexts/platform/README.md): use flattened account-scoped routes under `/{accountId}/...`; do not treat `/{accountId}/organization/*` as canonical.
- Account scope string contract authority stays in [../../../docs/contexts/platform/ubiquitous-language.md](../../../docs/contexts/platform/ubiquitous-language.md): local implementation docs must use `"user" | "organization"`, not `"personal" | "organization"`.
- Identifier authority also stays in the platform root docs: `accountId` is shell account scope, `organizationId` is organization-scoped domain input, `userId` is a concrete user, `actorId` is acting principal metadata, and `tenantId` is the isolation key.
- System-wide baseline remains the root architecture set: Hexagonal + DDD, Firebase serverless backend, Genkit orchestration, Zustand/XState frontend state, and Zod runtime validation.

## Conflict Resolution

- Strategic docs in `docs/contexts/platform/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
