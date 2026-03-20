# Event Core

`core/event-core` is the canonical domain event foundation for Xuanwu.

It provides a uniform model for capturing, persisting, dispatching, and correlating
domain events across all modules, following strict MDDD layering.

## Absorbed From

| Source | Status |
|--------|--------|
| N/A — original core module | — |

## Dependency Direction

```
interfaces -> application -> domain <- infrastructure
```

- Domain is framework-free (no SDK/HTTP/DB imports)
- Infrastructure implements domain ports only
- Interfaces never bypass Application

## Structure

```
event-core/
├── domain/
│   ├── entities/          # DomainEvent
│   ├── repositories/      # IEventStoreRepository, IEventBusRepository
│   ├── services/          # dispatchPolicy (pure dispatch rules)
│   └── value-objects/     # EventMetadata
├── application/
│   └── use-cases/         # PublishDomainEventUseCase, ListEventsByAggregateUseCase
├── infrastructure/
│   ├── persistence/       # config (batch size, retry limits)
│   └── repositories/      # InMemoryEventStoreRepository, NoopEventBusRepository
└── interfaces/
    └── api/               # EventController
```

## Core Flow

```mermaid
flowchart TD
    A[Capture Event<br/>捕捉領域事件] --> B[Persist Event<br/>持久化事件紀錄]
    B --> C[Dispatch Event<br/>派送至事件匯流排]
    C --> D[Observe Delivery<br/>確認派送狀態]
    D --> E[Correlate By Aggregate<br/>依聚合根關聯事件]
    E --> A
```

## Fill-In Order (Recommended)

1. Domain event invariants and metadata semantics
2. Dispatch policy rules (pure domain service)
3. Application orchestration and repository composition
4. Infrastructure adapter implementation (event store + bus)
5. Interface validation and serialization
