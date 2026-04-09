## workspace audit subdomain

This subdomain owns workspace-centered audit read/query capabilities and UI audit views.

### Hexagonal shape

- `api/`: public subdomain boundary
- `application/`: use cases
- `domain/`: entities, schema, repository contracts
- `infrastructure/`: Firebase repository adapter
- `interfaces/`: query functions and UI components
- `ports/`: reserved for future explicit input/output port contracts

### Integration rule

- Parent workspace public API (`@/modules/workspace/api`) is the preferred cross-module entry.
- `@/modules/workspace-audit/api` is now compatibility-only and re-exports this subdomain API.
