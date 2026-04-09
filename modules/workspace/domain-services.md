# Domain Services — workspace

Domain services live in `modules/workspace/domain/services`.

## Role

Domain Service in this context means **pure domain logic** that does not naturally belong to a single aggregate or value object.

## Boundaries

Domain services:

- can depend on domain concepts
- must not depend on UI, route handlers, Firebase SDK, or transport/framework concerns
- must not become application-flow orchestrators

## Distinction from application service

| Type | Primary concern |
|---|---|
| Domain Service | domain rule logic |
| Application Service | process/use-case orchestration |

## Practical guidance

- Keep aggregate invariants on aggregate first.
- Extract to domain service only when rule reuse/clarity warrants it.
- Keep cross-adapter integrations out of domain service.

## Current state

The directory exists as the canonical place for domain-service evolution; event publishing, repository access, and process orchestration remain outside domain services.
