# Ubiquitous Language

## Core Terms

| Term | Definition |
|---|---|
| Bounded Context | A boundary where a specific domain model and language are valid. |
| Aggregate | Consistency boundary that enforces invariants for related entities/value objects. |
| Published Language | Stable external contract for cross-context interaction (DTO/events). |
| ACL (Anti-Corruption Layer) | Adapter that translates external model into internal model. |
| Customer/Supplier | Relationship where supplier controls model and customer integrates intentionally. |

## Banned or Ambiguous Terms

| Avoid | Use Instead | Reason |
|---|---|---|
| module internals | published API contract | Clarifies boundary and dependency direction |
| shared model (without scope) | shared kernel contract | Forces explicit ownership |
| direct integration | ACL adapter integration | Prevents model leakage |

## Language Rules

1. Terms in this file are authoritative for strategic docs.
2. New term introduction requires definition + owner context.
3. Do not use synonyms if canonical term exists.

