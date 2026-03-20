# Event-Core Agent Contract

## Dependency Direction
- Interfaces -> Application -> Domain <- Infrastructure
- Domain must stay pure (no SDK/HTTP/DB imports)
- Interfaces never bypass Application
- Infrastructure implements repository contracts only

## Flow
Capture -> Persist -> Dispatch -> Observe -> Correlate

## Active Scope (Current)
- interfaces/api
- application/use-cases
- domain/entities
- domain/repositories
- domain/services
- domain/value-objects
- infrastructure/persistence
- infrastructure/repositories

## Out Of Scope (Temporarily Removed)
- dto / mapper / service layers in application
- aggregate / domain-event / factory / exception / shared in domain
- external / mapper in infrastructure
- ai / serializer in interfaces

## Layer Skeleton
- Interfaces: receive input and call use-cases
- Application: orchestrate event capture, persistence, and dispatch boundaries
- Domain: event entities/value-objects/services/invariants only
- Infrastructure: implement event store and bus adapters only

## Guardrails For Copilot
- Keep write paths in use-cases
- Keep vendor-specific syntax inside infrastructure only
- Keep domain deterministic and testable
- Never import from @/modules/* inside domain or application layers
