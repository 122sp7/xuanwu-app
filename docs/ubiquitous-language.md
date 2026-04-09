# Ubiquitous Language

## Core Terms

| Term | Definition |
|---|---|
| Bounded Context | A boundary where a specific domain model and language are valid. |
| Aggregate | Consistency boundary that enforces invariants for related entities/value objects. |
| Published Language | Stable external contract for cross-context interaction (DTO/events). |
| ACL (Anti-Corruption Layer) | Adapter that translates external model into internal model. |
| Customer/Supplier | Relationship where supplier controls model and customer integrates intentionally. |
| Domain Event | Immutable record of a significant fact that occurred within a bounded context (past-tense name). |
| Repository | Contract (interface) that abstracts persistence; owned by domain, implemented in infrastructure. |
| Value Object | Immutable object with no identity, compared by value equality. |
| Entity | Object with unique identity that persists across state changes. |
| Use Case | Single user-facing operation; application-layer orchestration of domain and infrastructure. |
| Port | Contract/interface defined by the core domain for external adapters to implement. |
| Adapter | Implementation of a port; lives in infrastructure or interfaces layer. |
| Published Event Discriminant | Unique identifier for a domain event in discriminated-union form (kebab-case `<module>.<action>`). |

## Banned or Ambiguous Terms

| Avoid | Use Instead | Reason |
|---|---|---|
| module internals | published API contract | Clarifies boundary and dependency direction |
| shared model (without scope) | shared kernel contract | Forces explicit ownership |
| direct integration | ACL adapter integration | Prevents model leakage |
| User | Tenant, Actor (context-specific) | Avoid ambiguity across bounded contexts |
| shared code | package boundary (`@shared-*`, `@lib-*`) | Enforces explicit contract and reuse intent |

## Language Rules

1. Terms in this file are authoritative for strategic docs.
2. New term introduction requires definition + owner context.
3. Do not use synonyms if canonical term exists.
4. Domain events must use past-tense naming (e.g., `WorkspaceCreated`, `MemberInvited`).
5. Repository interfaces belong in `domain/repositories/`; implementations in `infrastructure/`.
6. Cross-module terminology must align with the target bounded context's ubiquitous language.
