# Knowledge-Core Agent Contract (Scaffold)

## Dependency Direction
- Interfaces -> Application -> Domain <- Infrastructure
- Domain must stay pure (no SDK/HTTP/DB imports)
- Interfaces never bypass Application
- Infrastructure implements repository contracts only

## Flow
Knowledge -> Taxonomy -> Retrieval -> Governance -> Integration -> Analytics -> Knowledge

## Active Scope (Current)
- interfaces/api
- application/use-cases
- domain/entities
- domain/repositories
- domain/value-objects
- infrastructure/persistence
- infrastructure/repositories

## Out Of Scope (Temporarily Removed)
- dto / mapper / service layers in application
- aggregate / domain-service / event / factory / exception / shared in domain
- external / mapper in infrastructure
- ai / serializer in interfaces

## Layer Skeleton
- Interfaces: receive input and call use-cases
- Application: orchestrate workflows and transaction boundaries
- Domain: entities/value-objects/invariants only
- Infrastructure: implement ports and external adapters only

## Guardrails For Copilot
- Keep write paths in use-cases
- Keep provider syntax inside infrastructure/persistence or infrastructure/repositories
- Keep domain deterministic and testable
