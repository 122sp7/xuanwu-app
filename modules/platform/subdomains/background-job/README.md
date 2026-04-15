# Background Job

Generic background job tracking and lifecycle management for the platform layer.

## Ownership

- **Bounded Context**: platform
- **Semantic Name**: Background Job Management
- **Status**: Implemented (domain entities, application use cases, in-memory adapter)

## Domain Entities

| Entity | Role |
|---|---|
| `BackgroundJob` | Aggregate root — tracks a document through the processing pipeline with a strict status state machine |
| `JobDocument` | Immutable snapshot of the source document submitted for processing |
| `JobChunk` | Text segment produced by the chunking stage; tracked for audit and retrieval-quality accounting |

## Key Types

- `BackgroundJobStatus` — pipeline stage union (`uploaded` → `parsing` → `chunking` → `embedding` → `indexed` / `stale` / `re-indexing` / `failed`)
- `canTransitionJobStatus(from, to)` — domain guard enforcing valid state-machine transitions
- `backgroundJobService` — composition root wiring use cases to the in-memory repository

## Development Order

When extending, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
