# Namespace-Core Agent Contract

## Dependency Direction
- Interfaces -> Application -> Domain <- Infrastructure
- Domain must stay pure (no SDK/HTTP/DB imports)
- Interfaces never bypass Application
- Infrastructure implements repository contracts only

## Flow
DisplayName -> SlugDerivation -> SlugValidation -> CollisionCheck -> Register -> Resolve

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
- dto / mapper layers in application
- aggregate / domain-event / factory / exception / shared in domain
- external / mapper in infrastructure
- ai / serializer in interfaces

## Layer Skeleton
- Interfaces: receive input and call use-cases
- Application: orchestrate slug validation, collision check, and namespace persistence
- Domain: Namespace entity / NamespaceSlug VO / slug-policy pure functions only
- Infrastructure: implement namespace store adapter only

## Guardrails For Copilot
- Keep slug validation in NamespaceSlug VO and slug-policy domain service
- Keep collision check in RegisterNamespaceUseCase, not in domain entity
- Keep provider syntax inside infrastructure only
- Keep domain deterministic and testable
- Never import from @/modules/* inside domain or application layers
