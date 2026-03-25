---
title: Event Core development contract
description: Implementation contract for the Event Core domain — canonical domain event capture, persistence, dispatch, aggregate correlation, and outbox pattern.
status: "🚧 Developing"
---

# Event Core development contract

> **開發狀態**：🚧 Developing — 積極開發中

## Purpose

`modules/event` defines:
- Unified domain event capture + persistence
- Dispatch boundary → event bus / projections
- Correlation → aggregate timelines
- Retry/outbox → at-least-once delivery

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| DomainEvent entity | `modules/event/domain/entities` |
| EventMetadata value object | `modules/event/domain/value-objects` |
| Dispatch policy (pure) | `modules/event/domain/services` |
| Event store port | `modules/event/domain/repositories/IEventStoreRepository` |
| Event bus port | `modules/event/domain/repositories/IEventBusRepository` |
| Publish use-case | `modules/event/application/use-cases/PublishDomainEventUseCase` |
| List use-case | `modules/event/application/use-cases/ListEventsByAggregateUseCase` |
| In-memory adapter | `modules/event/infrastructure/repositories/InMemoryEventStoreRepository` |
| Noop bus adapter | `modules/event/infrastructure/repositories/NoopEventBusRepository` |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Capture Context | create and validate a DomainEvent from module write-side |
| Persistence Context | save events to the event store in undispatched state |
| Dispatch Context | publish events to the event bus; mark dispatched |
| Correlation Context | query events by aggregateType + aggregateId for timeline reconstruction |
| Retry Context | apply dispatchPolicy to determine retry eligibility and back-off delay |

## DomainEvent entity contract

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | UUID v4 |
| `eventName` | `string` | yes | `Module.AggregateType.Action` |
| `aggregateType` | `string` | yes | e.g. WikiDocument |
| `aggregateId` | `string` | yes | Root ID |
| `occurredAt` | `Date` | yes | When event occurred |
| `payload` | `Record<string, unknown>` | yes | Business data |
| `metadata` | `EventMetadata?` | no | Tracing fields |
| `dispatchedAt` | `Date\|null` | no | Dispatch time or null |

## EventMetadata contract

| Field | Type | Notes |
| --- | --- | --- |
| `correlationId` | `string?` | Cross-service correlation |
| `causationId` | `string?` | Upstream event ID |
| `actorId` | `string?` | Actor ID |
| `organizationId` | `string?` | Org boundary |
| `workspaceId` | `string?` | Workspace or org-level |
| `traceId` | `string?` | OpenTelemetry ID |

## eventName naming convention

```
Module.AggregateType.Action
```
Examples: `Wiki.Document.Created`, `Task.Task.Assigned`, `Schedule.Request.Submitted`

Rules: non-empty, validated in constructor

## IEventStoreRepository contract

```typescript
interface IEventStoreRepository {
  save(event: DomainEvent): Promise<void>
  findById(id: string): Promise<DomainEvent | null>
  findByAggregate(aggregateType: string, aggregateId: string): Promise<DomainEvent[]>
  findUndispatched(limit: number): Promise<DomainEvent[]>
  markDispatched(id: string, dispatchedAt: Date): Promise<void>
}
```

- `findByAggregate` must return events in ascending `occurredAt` order.
- `findUndispatched` must return events in ascending `occurredAt` order, up to `limit`.
- `markDispatched` is idempotent — calling it twice on the same id must not throw.

## IEventBusRepository contract

```typescript
interface IEventBusRepository {
  publish(event: DomainEvent): Promise<void>
}
```

- Implementers must guarantee at-least-once delivery semantics.
- The `NoopEventBusRepository` is a scaffold-only adapter; it must not be used in production.

## Dispatch policy contract

```typescript
// domain/services/dispatch-policy.ts

shouldRetry(attempt: DispatchAttempt, policy: DispatchPolicy): boolean
nextRetryDelayMs(attempt: DispatchAttempt, policy: DispatchPolicy): number
```

- Both functions are pure — no side effects, no external dependencies.
- Default policy values are defined in `infrastructure/persistence/config.ts`:
  - `DISPATCH.RETRY_LIMIT = 3`
  - `DISPATCH.BATCH_SIZE = 100`

## Outbox pattern contract (target)

The target implementation uses the outbox pattern:

1. The write-side use-case saves the business aggregate **and** the domain event in the same atomic transaction.
2. A background worker queries `findUndispatched(limit)`.
3. For each undispatched event, it calls `IEventBusRepository.publish(event)`.
4. On success, it calls `markDispatched(id, dispatchedAt)`.
5. On failure, it applies `dispatchPolicy.shouldRetry` to decide whether to retry or dead-letter.

> **Note**: Current `PublishDomainEventUseCase` is synchronous (no outbox). Must replace before production.

## Infrastructure configuration contract

```typescript
EVENT_CORE_CONFIG = { DISPATCH: { BATCH_SIZE: 100, RETRY_LIMIT: 3 } }
```
Adapters must read config, not hardcode.

## Layer ownership

| Layer | Owns | Must not |
| --- | --- | --- |
| Domain | entities, value objects, repository ports, dispatch-policy service | import SDK, HTTP, DB |
| Application | use-cases, DTO composition | directly import infrastructure or UI |
| Infrastructure | store and bus adapters | leak provider details into domain |
| Interfaces | controller facade | bypass application layer |
