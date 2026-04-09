## Phase: impl
## Task: refresh workspace docs for Hexagonal Architecture + DDD alignment
## Date: 2026-04-09

### User Goal
- Query official guidance for Hexagonal Architecture with DDD.
- Update workspace markdown docs to match real module structure:
  - api, application, docs, domain, infrastructure, interfaces, ports, subdomains

### Context7 Validation
- Library used: `/sairyss/domain-driven-hexagon`
- Topics reviewed:
  - `hexagonal architecture and domain-driven design` (info)
  - `ports and adapters application domain infrastructure layers` (code)
- Key principles applied:
  - Domain should not depend on API/database layers.
  - Ports define abstractions; adapters implement them.
  - Separate domain model concerns from persistence concerns.

### Files Updated
- modules/workspace/AGENT.md
- modules/workspace/README.md
- modules/workspace/aggregates.md
- modules/workspace/application-services.md
- modules/workspace/bounded-context.md
- modules/workspace/context-map.md
- modules/workspace/domain-events.md
- modules/workspace/domain-services.md
- modules/workspace/repositories.md
- modules/workspace/subdomain.md
- modules/workspace/ubiquitous-language.md

### Result Summary
- Rewrote target docs to align with current workspace folder structure and existing code contracts.
- Clarified strategic vs tactical boundaries:
  - subdomain/bounded-context/context-map vs internal hexagonal layering.
- Normalized language around `Workspace`, lifecycle, visibility, and published events.
- Explicitly separated write model and read projections.

### Notes
- `.github/terminology-glossary.md` is referenced by repo instructions but not present in filesystem.
- Runtime validation commands were blocked because `pwsh` is unavailable in environment.