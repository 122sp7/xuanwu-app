# Files

## File: docs/structure/contexts/analytics/bounded-contexts.md
```markdown
# Analytics

## Domain Role

analytics 是下游 bounded context。它以 projection、metric 與 report 為主，不持有上游主域的寫入正典模型。

## Ownership Rules

- 擁有 reporting、metrics、dashboards、telemetry projections。
- 消費事件，不直接改寫上游 aggregate。
- 只在需要查詢與分析時建立 local read model。
```

## File: docs/structure/contexts/analytics/context-map.md
```markdown
# Analytics

## Relationships

| Upstream | Downstream | Published Language |
|---|---|---|
| iam | analytics | access event、identity signal |
| billing | analytics | billing event、entitlement usage signal |
| platform | analytics | operational event、notification event |
| workspace | analytics | activity feed、audit signal |
| notion | analytics | knowledge usage signal |
| notebooklm | analytics | retrieval and synthesis usage signal |

## Notes

- analytics consumes events and projections only.
```

## File: docs/structure/contexts/analytics/subdomains.md
```markdown
# Analytics

## Baseline Subdomains

| Subdomain | Responsibility |
|---|---|
| reporting | 報表輸出與查詢整理 |
| metrics | 指標定義與聚合 |
| dashboards | 儀表板呈現語義 |
| telemetry-projection | 事件投影與 read model 匯總 |

> **實作層命名備注：** `src/modules/analytics/` 以 `event-contracts`、`event-ingestion`、`event-projection`、`insights`、`metrics`、`realtime-insights` 作為子域目錄名稱。
> `event-projection` 對應戰略層 `telemetry-projection`；`insights` 對應 `reporting`；`realtime-insights` 對應儀表板能力的即時維度。

## Recommended Gap Subdomains

| Subdomain | Responsibility |
|---|---|
| experimentation | 實驗分析與對照觀測 |
| decision-support | 決策輔助與洞察輸出 |
```

## File: docs/structure/contexts/analytics/ubiquitous-language.md
```markdown
# Analytics

## Canonical Terms

| Term | Meaning |
|---|---|
| Metric | 可重複計算與追蹤的指標 |
| Report | 對分析結果的輸出整理 |
| Dashboard | 視覺化分析面板 |
| Projection | 由上游事件形成的下游 read model |

## Avoid

- 不把 analytics 當成上游寫入語言。
- 不把 projection 當成原始 aggregate。
```

## File: src/modules/analytics/index.ts
```typescript
/**
 * Analytics Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// event-contracts
⋮----
// metrics
⋮----
// event-ingestion domain types
⋮----
// event-projection domain types
⋮----
// insights domain types
⋮----
// realtime-insights domain types
⋮----
// experimentation domain types
```

## File: src/modules/analytics/orchestration/index.ts
```typescript
// analytics — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement AnalyticsFacade if needed.
```

## File: src/modules/analytics/shared/errors/index.ts
```typescript
// analytics shared/errors placeholder
```

## File: src/modules/analytics/shared/events/index.ts
```typescript
// analytics shared events
```

## File: src/modules/analytics/shared/index.ts
```typescript

```

## File: src/modules/analytics/shared/types/index.ts
```typescript
// analytics shared types
```

## File: src/modules/analytics/subdomains/event-contracts/adapters/inbound/index.ts
```typescript
// event-contracts — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/event-contracts/adapters/index.ts
```typescript
// event-contracts — adapters aggregate
```

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/index.ts
```typescript
// event-contracts — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/memory/InMemoryAnalyticsEventRepository.ts
```typescript
import type { AnalyticsEventSnapshot } from "../../../domain/entities/AnalyticsEvent";
import type {
  AnalyticsEventRepository,
  AnalyticsEventQuery,
} from "../../../domain/repositories/AnalyticsEventRepository";
⋮----
export class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
⋮----
async save(snapshot: AnalyticsEventSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<AnalyticsEventSnapshot | null>
⋮----
async query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>
⋮----
async countByName(name: string, fromDate?: string, toDate?: string): Promise<number>
```

## File: src/modules/analytics/subdomains/event-contracts/application/index.ts
```typescript

```

## File: src/modules/analytics/subdomains/event-contracts/application/use-cases/AnalyticsEventUseCases.ts
```typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { AnalyticsEvent, type TrackEventInput } from "../../domain/entities/AnalyticsEvent";
import type { AnalyticsEventRepository } from "../../domain/repositories/AnalyticsEventRepository";
⋮----
export class TrackAnalyticsEventUseCase {
⋮----
constructor(private readonly repo: AnalyticsEventRepository)
⋮----
async execute(input: TrackEventInput): Promise<CommandResult>
⋮----
export class QueryAnalyticsEventsUseCase {
⋮----
async execute(params: {
    name?: string;
    source?: string;
    workspaceId?: string;
    actorId?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
})
```

## File: src/modules/analytics/subdomains/event-contracts/domain/entities/AnalyticsEvent.ts
```typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type AnalyticsEventId = z.infer<typeof AnalyticsEventIdSchema>;
⋮----
export type AnalyticsEventSnapshot = z.infer<typeof AnalyticsEventSchema>;
⋮----
export interface TrackEventInput {
  readonly name: string;
  readonly source: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly properties?: Record<string, unknown>;
  readonly occurredAt?: string;
}
⋮----
export class AnalyticsEvent {
⋮----
private constructor(private readonly _props: AnalyticsEventSnapshot)
⋮----
static create(input: TrackEventInput): AnalyticsEvent
⋮----
static reconstitute(snapshot: AnalyticsEventSnapshot): AnalyticsEvent
⋮----
get id(): string
get name(): string
get source(): string
get actorId(): string | undefined
get workspaceId(): string | undefined
get occurredAt(): string
⋮----
getSnapshot(): Readonly<AnalyticsEventSnapshot>
```

## File: src/modules/analytics/subdomains/event-contracts/domain/events/AnalyticsDomainEvent.ts
```typescript
export type AnalyticsDomainEventType =
  | {
      type: "analytics.event.tracked";
      eventId: string;
      occurredAt: string;
      payload: { analyticsEventId: string; name: string; source: string };
    }
  | {
      type: "analytics.event.ingestion_failed";
      eventId: string;
      occurredAt: string;
      payload: { name: string; reason: string };
    };
```

## File: src/modules/analytics/subdomains/event-contracts/domain/index.ts
```typescript

```

## File: src/modules/analytics/subdomains/event-contracts/domain/repositories/AnalyticsEventRepository.ts
```typescript
import type { AnalyticsEventSnapshot } from "../entities/AnalyticsEvent";
⋮----
export interface AnalyticsEventQuery {
  readonly name?: string;
  readonly source?: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface AnalyticsEventRepository {
  save(snapshot: AnalyticsEventSnapshot): Promise<void>;
  findById(id: string): Promise<AnalyticsEventSnapshot | null>;
  query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>;
  countByName(name: string, fromDate?: string, toDate?: string): Promise<number>;
}
⋮----
save(snapshot: AnalyticsEventSnapshot): Promise<void>;
findById(id: string): Promise<AnalyticsEventSnapshot | null>;
query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>;
countByName(name: string, fromDate?: string, toDate?: string): Promise<number>;
```

## File: src/modules/analytics/subdomains/event-contracts/domain/value-objects/EventName.ts
```typescript
import { z } from "zod";
⋮----
export type EventName = z.infer<typeof EventNameSchema>;
⋮----
export function createEventName(value: string): EventName
```

## File: src/modules/analytics/subdomains/event-ingestion/adapters/inbound/index.ts
```typescript
// event-ingestion — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/event-ingestion/adapters/index.ts
```typescript
// event-ingestion — adapters aggregate
```

## File: src/modules/analytics/subdomains/event-ingestion/adapters/outbound/index.ts
```typescript
// event-ingestion — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/event-ingestion/application/index.ts
```typescript
// event-ingestion — application layer placeholder
// TODO: export use-cases, DTOs, ports
```

## File: src/modules/analytics/subdomains/event-ingestion/application/use-cases/IngestionUseCases.ts
```typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";
import type { IngestionBatch, IngestionBatchRepository } from "../../domain/entities/IngestionBatch";
⋮----
export class IngestEventBatchUseCase {
⋮----
constructor(private readonly repo: IngestionBatchRepository)
⋮----
async execute(events: AnalyticsEventSnapshot[]): Promise<CommandResult>
```

## File: src/modules/analytics/subdomains/event-ingestion/domain/entities/IngestionBatch.ts
```typescript
import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";
⋮----
export type IngestionStatus = "pending" | "processed" | "failed";
⋮----
export interface IngestionBatch {
  readonly id: string;
  readonly events: AnalyticsEventSnapshot[];
  readonly status: IngestionStatus;
  readonly processedAt?: string;
  readonly failedReason?: string;
  readonly createdAtISO: string;
}
⋮----
export interface IngestionBatchRepository {
  save(batch: IngestionBatch): Promise<void>;
  findById(id: string): Promise<IngestionBatch | null>;
  findPending(limit?: number): Promise<IngestionBatch[]>;
}
⋮----
save(batch: IngestionBatch): Promise<void>;
findById(id: string): Promise<IngestionBatch | null>;
findPending(limit?: number): Promise<IngestionBatch[]>;
```

## File: src/modules/analytics/subdomains/event-ingestion/domain/events/IngestionDomainEvent.ts
```typescript
export type IngestionDomainEventType =
  | {
      type: "analytics.ingestion.batch_created";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; eventCount: number };
    }
  | {
      type: "analytics.ingestion.batch_processed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string };
    }
  | {
      type: "analytics.ingestion.batch_failed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; reason: string };
    };
```

## File: src/modules/analytics/subdomains/event-ingestion/domain/index.ts
```typescript
// event-ingestion — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: src/modules/analytics/subdomains/event-projection/adapters/inbound/index.ts
```typescript
// event-projection — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/event-projection/adapters/index.ts
```typescript
// event-projection — adapters aggregate
```

## File: src/modules/analytics/subdomains/event-projection/adapters/outbound/index.ts
```typescript
// event-projection — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/event-projection/application/index.ts
```typescript
// event-projection — application layer placeholder
// TODO: export use-cases, DTOs, ports
```

## File: src/modules/analytics/subdomains/event-projection/application/use-cases/ProjectionUseCases.ts
```typescript
// TODO: implement use-cases for computing and querying event projections
// Depends on EventProjectionRepository
```

## File: src/modules/analytics/subdomains/event-projection/domain/entities/EventProjection.ts
```typescript
export interface EventProjection {
  readonly id: string;
  readonly name: string;
  readonly filter: Record<string, unknown>;
  readonly aggregation: "count" | "sum" | "avg" | "distinct";
  readonly metricName?: string;
  readonly windowSeconds?: number;
  readonly result?: number;
  readonly computedAtISO?: string;
  readonly createdAtISO: string;
}
⋮----
export interface EventProjectionRepository {
  save(projection: EventProjection): Promise<void>;
  findById(id: string): Promise<EventProjection | null>;
  findByName(name: string): Promise<EventProjection | null>;
  listAll(): Promise<EventProjection[]>;
}
⋮----
save(projection: EventProjection): Promise<void>;
findById(id: string): Promise<EventProjection | null>;
findByName(name: string): Promise<EventProjection | null>;
listAll(): Promise<EventProjection[]>;
```

## File: src/modules/analytics/subdomains/event-projection/domain/index.ts
```typescript
// event-projection — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: src/modules/analytics/subdomains/experimentation/adapters/inbound/index.ts
```typescript
// experimentation — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
```

## File: src/modules/analytics/subdomains/experimentation/adapters/index.ts
```typescript
// experimentation — adapters aggregate
```

## File: src/modules/analytics/subdomains/experimentation/adapters/outbound/index.ts
```typescript
// experimentation — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
```

## File: src/modules/analytics/subdomains/experimentation/application/index.ts
```typescript
// experimentation — application layer placeholder
// TODO: export use-cases, DTOs, application services
```

## File: src/modules/analytics/subdomains/experimentation/application/use-cases/ExperimentUseCases.ts
```typescript
// TODO: implement experiment lifecycle and variant assignment use-cases
```

## File: src/modules/analytics/subdomains/experimentation/domain/entities/Experiment.ts
```typescript
export type ExperimentStatus = "draft" | "running" | "paused" | "completed";
⋮----
export interface Experiment {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly variants: string[];
  readonly trafficAllocation: Record<string, number>;
  readonly status: ExperimentStatus;
  readonly workspaceId?: string;
  readonly startedAtISO?: string;
  readonly endedAtISO?: string;
  readonly createdAtISO: string;
}
⋮----
export interface ExperimentRepository {
  save(experiment: Experiment): Promise<void>;
  findById(id: string): Promise<Experiment | null>;
  findRunning(workspaceId?: string): Promise<Experiment[]>;
  assignVariant(experimentId: string, actorId: string): Promise<string>;
}
⋮----
save(experiment: Experiment): Promise<void>;
findById(id: string): Promise<Experiment | null>;
findRunning(workspaceId?: string): Promise<Experiment[]>;
assignVariant(experimentId: string, actorId: string): Promise<string>;
```

## File: src/modules/analytics/subdomains/experimentation/domain/index.ts
```typescript
// experimentation — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: src/modules/analytics/subdomains/insights/adapters/inbound/index.ts
```typescript
// insights — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/insights/adapters/index.ts
```typescript
// insights — adapters aggregate
```

## File: src/modules/analytics/subdomains/insights/adapters/outbound/index.ts
```typescript
// insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/insights/application/index.ts
```typescript
// insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
```

## File: src/modules/analytics/subdomains/insights/application/use-cases/InsightUseCases.ts
```typescript
// TODO: implement insight generation use-cases
// Depends on MetricRepository and InsightRepository
```

## File: src/modules/analytics/subdomains/insights/domain/entities/Insight.ts
```typescript
export interface Insight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: "usage" | "performance" | "engagement" | "anomaly";
  readonly severity: "info" | "warning" | "critical";
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly data: Record<string, unknown>;
  readonly generatedAtISO: string;
}
⋮----
export interface InsightRepository {
  save(insight: Insight): Promise<void>;
  findById(id: string): Promise<Insight | null>;
  listForWorkspace(workspaceId: string, limit?: number): Promise<Insight[]>;
  listForOrganization(organizationId: string, limit?: number): Promise<Insight[]>;
}
⋮----
save(insight: Insight): Promise<void>;
findById(id: string): Promise<Insight | null>;
listForWorkspace(workspaceId: string, limit?: number): Promise<Insight[]>;
listForOrganization(organizationId: string, limit?: number): Promise<Insight[]>;
```

## File: src/modules/analytics/subdomains/insights/domain/index.ts
```typescript
// insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: src/modules/analytics/subdomains/metrics/adapters/inbound/index.ts
```typescript
// metrics — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/metrics/adapters/index.ts
```typescript
// metrics — adapters aggregate
```

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/index.ts
```typescript
// metrics — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/memory/InMemoryMetricRepository.ts
```typescript
import type { MetricSnapshot, MetricType } from "../../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../../domain/repositories/MetricRepository";
⋮----
export class InMemoryMetricRepository implements MetricRepository {
⋮----
async save(snapshot: MetricSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<MetricSnapshot | null>
⋮----
async query(params: MetricQuery): Promise<MetricSnapshot[]>
⋮----
async sumByName(name: string, params?: MetricQuery): Promise<number>
⋮----
async avgByName(name: string, params?: MetricQuery): Promise<number>
```

## File: src/modules/analytics/subdomains/metrics/application/index.ts
```typescript

```

## File: src/modules/analytics/subdomains/metrics/application/use-cases/MetricUseCases.ts
```typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Metric, type RecordMetricInput } from "../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../domain/repositories/MetricRepository";
⋮----
export class RecordMetricUseCase {
⋮----
constructor(private readonly repo: MetricRepository)
⋮----
async execute(input: RecordMetricInput): Promise<CommandResult>
⋮----
export class QueryMetricsUseCase {
⋮----
async execute(params: MetricQuery)
⋮----
export class SumMetricUseCase {
⋮----
async execute(name: string, params?: MetricQuery): Promise<number>
```

## File: src/modules/analytics/subdomains/metrics/domain/entities/Metric.ts
```typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type MetricId = z.infer<typeof MetricIdSchema>;
⋮----
export type MetricType = z.infer<typeof MetricTypeSchema>;
⋮----
export interface MetricSnapshot {
  readonly id: string;
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO: string;
}
⋮----
export interface RecordMetricInput {
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels?: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO?: string;
}
⋮----
export class Metric {
⋮----
private constructor(private readonly _props: MetricSnapshot)
⋮----
static record(input: RecordMetricInput): Metric
⋮----
static reconstitute(snapshot: MetricSnapshot): Metric
⋮----
get id(): string
get name(): string
get type(): MetricType
get value(): number
get timestampISO(): string
⋮----
getSnapshot(): Readonly<MetricSnapshot>
```

## File: src/modules/analytics/subdomains/metrics/domain/index.ts
```typescript

```

## File: src/modules/analytics/subdomains/metrics/domain/repositories/MetricRepository.ts
```typescript
import type { MetricSnapshot, MetricType } from "../entities/Metric";
⋮----
export interface MetricQuery {
  readonly name?: string;
  readonly type?: MetricType;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
}
⋮----
export interface MetricRepository {
  save(snapshot: MetricSnapshot): Promise<void>;
  findById(id: string): Promise<MetricSnapshot | null>;
  query(params: MetricQuery): Promise<MetricSnapshot[]>;
  sumByName(name: string, params?: MetricQuery): Promise<number>;
  avgByName(name: string, params?: MetricQuery): Promise<number>;
}
⋮----
save(snapshot: MetricSnapshot): Promise<void>;
findById(id: string): Promise<MetricSnapshot | null>;
query(params: MetricQuery): Promise<MetricSnapshot[]>;
sumByName(name: string, params?: MetricQuery): Promise<number>;
avgByName(name: string, params?: MetricQuery): Promise<number>;
```

## File: src/modules/analytics/subdomains/metrics/domain/value-objects/MetricName.ts
```typescript
import { z } from "zod";
⋮----
export type MetricName = z.infer<typeof MetricNameSchema>;
⋮----
export type MetricValue = z.infer<typeof MetricValueSchema>;
```

## File: src/modules/analytics/subdomains/realtime-insights/adapters/inbound/index.ts
```typescript
// realtime-insights — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/analytics/subdomains/realtime-insights/adapters/index.ts
```typescript
// realtime-insights — adapters aggregate
```

## File: src/modules/analytics/subdomains/realtime-insights/adapters/outbound/index.ts
```typescript
// realtime-insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/analytics/subdomains/realtime-insights/application/index.ts
```typescript
// realtime-insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
```

## File: src/modules/analytics/subdomains/realtime-insights/application/use-cases/RealtimeInsightUseCases.ts
```typescript
// TODO: implement use-cases for real-time metric ingestion and query
// Depends on RealtimeInsightPort
```

## File: src/modules/analytics/subdomains/realtime-insights/domain/entities/RealtimeMetric.ts
```typescript
export interface RealtimeMetricSample {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly sampledAtISO: string;
}
⋮----
export interface RealtimeMetricWindow {
  readonly metric: string;
  readonly windowSeconds: number;
  readonly samples: RealtimeMetricSample[];
  readonly aggregated: number;
}
⋮----
export interface RealtimeInsightPort {
  /** Pushes a sample to the real-time buffer. */
  push(sample: RealtimeMetricSample): Promise<void>;
  /** Returns aggregated window data. */
  queryWindow(metric: string, windowSeconds: number): Promise<RealtimeMetricWindow>;
}
⋮----
/** Pushes a sample to the real-time buffer. */
push(sample: RealtimeMetricSample): Promise<void>;
/** Returns aggregated window data. */
queryWindow(metric: string, windowSeconds: number): Promise<RealtimeMetricWindow>;
```

## File: src/modules/analytics/subdomains/realtime-insights/domain/index.ts
```typescript
// realtime-insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: docs/structure/contexts/analytics/README.md
```markdown
# Analytics Context

本 README 在本次重切作業下，定義 analytics 作為下游 read-model 主域的邊界。

## Purpose

analytics 是報表、指標與儀表板主域。它主要消費其他主域的事件、usage signal 與 projection input，形成可查詢的分析視圖。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | reporting、metrics、dashboard、projection |
| Upstream Dependency | iam、billing、platform、workspace、notion、notebooklm 的事件與訊號 |
| Downstream Consumers | 產品與營運分析使用者 |
| Core Principle | analytics 是下游投影，不反向成為 canonical owner |

## Document Network

- [AGENTS.md](./AGENTS.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [context-map.md](./context-map.md)
- [subdomains.md](./subdomains.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [README.md](../../../README.md)
- [architecture-overview.md](../../system/architecture-overview.md)
- [integration-guidelines.md](../../system/integration-guidelines.md)
```

## File: src/modules/analytics/AGENTS.md
```markdown
# analytics Agent Rules

## ROLE

- The agent MUST treat analytics as the read-model and insights capability module.
- The agent MUST keep analytics focused on event ingestion, projection, and reporting outputs.

## DOMAIN BOUNDARIES

- The agent MUST keep analytics downstream from source domains.
- The agent MUST NOT place upstream business write ownership in analytics.
- The agent MUST expose integration through [index.ts](index.ts) and event contracts.

## TOOL USAGE

- The agent MUST validate subdomain path references before updates.
- The agent MUST keep metric/projection contract changes explicit.
- The agent MUST keep edits scoped to analytics ownership.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select owning analytics subdomain.
	4. Apply bounded changes.
	5. Validate links and boundaries.

## DATA CONTRACT

- The agent MUST keep event and projection contract naming stable.
- The agent MUST keep subdomain index synchronized with actual directories.
- The agent MUST keep links relative and valid.

## CONSTRAINTS

- The agent MUST NOT mutate upstream domain ownership from analytics.
- The agent MUST NOT bypass event-contract boundaries.
- The agent MUST NOT duplicate strategic authority text in this routing file.

## ERROR HANDLING

- The agent MUST report stale links or missing subdomain docs.
- The agent MUST stop on ownership conflicts and request direction.

## CONSISTENCY

- The agent MUST keep AGENTS as routing/rules and README as overview.
- The agent MUST keep analytics terminology aligned with strategic docs.

## SECURITY

- The agent MUST avoid exposing sensitive event payload examples.
- The agent MUST preserve tenant/account scope in analytics contracts.

## Route Here When

- You update event ingestion/projection/metrics/insights capabilities.
- You change analytics module contracts or subdomain implementation placement.

## Route Elsewhere When

- Route composition and UI rendering: [../../app/AGENTS.md](../../app/AGENTS.md)
- Upstream business ownership: owning module AGENTS under [../](../)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
```

## File: src/modules/analytics/README.md
```markdown
# analytics

## PURPOSE

analytics 模組承接事件輸入、投影、指標與洞察能力。
它作為下游分析層，為多個上游 context 生成可觀測與決策支援輸出。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

analytics 由事件契約、輸入、投影、指標與洞察子域組成。
跨模組協作以事件與公開邊界為主，不承接上游寫入所有權。

## PROJECT STRUCTURE

- [subdomains/event-contracts](subdomains/event-contracts)
- [subdomains/event-ingestion](subdomains/event-ingestion)
- [subdomains/event-projection](subdomains/event-projection)
- [subdomains/experimentation](subdomains/experimentation)
- [subdomains/insights](subdomains/insights)
- [subdomains/metrics](subdomains/metrics)
- [subdomains/realtime-insights](subdomains/realtime-insights)

## DEVELOPMENT RULES

- MUST keep analytics as downstream projection/reporting owner.
- MUST keep contracts explicit for event ingestion and projection.
- MUST avoid upstream domain mutation responsibility.
- MUST expose module capabilities via [index.ts](index.ts).

## AI INTEGRATION

analytics 可消費 AI 相關事件或評估訊號，但不應直接承接 AI provider 管理。
若需要 AI 驅動分析，應透過明確事件契約整合。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 analytics 子域入口。
- 可在 3 分鐘內判斷需求是事件輸入、投影、指標或洞察修改。
```

## File: src/modules/analytics/subdomains/event-contracts/AGENTS.md
```markdown
# event-contracts Subdomain Agent Rules

## ROLE

- The agent MUST treat event-contracts as the analytics subdomain for published event shapes and ingestion-facing contracts.
- The agent MUST keep event-contracts documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-contracts inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep contract naming explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine upstream domain facts here.

## Route Here When

- You document analytics event contract boundaries.

## Route Elsewhere When

- Projection logic: [../event-projection/AGENTS.md](../event-projection/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/event-contracts/README.md
```markdown
# event-contracts

## PURPOSE

event-contracts 子域負責 analytics 事件契約與 ingestion-facing published language。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接事件契約與投影輸入語言。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep event contract names explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 event-contracts 邊界。
```

## File: src/modules/analytics/subdomains/event-ingestion/AGENTS.md
```markdown
# event-ingestion Subdomain Agent Rules

## ROLE

- The agent MUST treat event-ingestion as the analytics subdomain for receiving and normalizing analytics inputs.
- The agent MUST keep event-ingestion documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-ingestion inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep ingestion terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT move upstream write ownership into analytics.

## Route Here When

- You document analytics event ingestion boundaries.

## Route Elsewhere When

- Event contracts: [../event-contracts/AGENTS.md](../event-contracts/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/event-ingestion/README.md
```markdown
# event-ingestion

## PURPOSE

event-ingestion 子域負責接收、正規化與承接 analytics 事件輸入。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接事件輸入與投影前置能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep ingestion terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 event-ingestion 邊界。
```

## File: src/modules/analytics/subdomains/event-projection/AGENTS.md
```markdown
# event-projection Subdomain Agent Rules

## ROLE

- The agent MUST treat event-projection as the analytics subdomain for read-model projection semantics.
- The agent MUST keep event-projection documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-projection inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep projection terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine source-domain ownership here.

## Route Here When

- You document analytics projection boundaries.

## Route Elsewhere When

- Metrics logic: [../metrics/AGENTS.md](../metrics/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/event-projection/README.md
```markdown
# event-projection

## PURPOSE

event-projection 子域負責事件到 read model 的投影語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 projection 與下游 read-model 能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep projection terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 event-projection 邊界。
```

## File: src/modules/analytics/subdomains/experimentation/AGENTS.md
```markdown
# experimentation Subdomain Agent Rules

## ROLE

- The agent MUST treat experimentation as the analytics subdomain for experiment and observation semantics.
- The agent MUST keep experimentation documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep experimentation inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep experimentation terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT move product write ownership into analytics.

## Route Here When

- You document analytics experimentation boundaries.

## Route Elsewhere When

- Insights logic: [../insights/AGENTS.md](../insights/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/experimentation/README.md
```markdown
# experimentation

## PURPOSE

experimentation 子域負責實驗觀測與分析試驗語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 experiment 與 observation 能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep experimentation terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 experimentation 邊界。
```

## File: src/modules/analytics/subdomains/insights/AGENTS.md
```markdown
# insights Subdomain Agent Rules

## ROLE

- The agent MUST treat insights as the analytics subdomain for derived analysis outputs and interpretation semantics.
- The agent MUST keep insights documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep insights inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep insight terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT present source-domain models as analytics-owned facts.

## Route Here When

- You document analytics insights boundaries.

## Route Elsewhere When

- Metrics logic: [../metrics/AGENTS.md](../metrics/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/insights/README.md
```markdown
# insights

## PURPOSE

insights 子域負責衍生分析輸出與洞察語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 interpreted output 與洞察能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep insights terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 insights 邊界。
```

## File: src/modules/analytics/subdomains/metrics/AGENTS.md
```markdown
# metrics Subdomain Agent Rules

## ROLE

- The agent MUST treat metrics as the analytics subdomain for measurement and aggregation semantics.
- The agent MUST keep metrics documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep metrics inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep metric terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT turn metrics docs into generic business logic docs.

## Route Here When

- You document analytics metrics boundaries.

## Route Elsewhere When

- Insights logic: [../insights/AGENTS.md](../insights/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/metrics/README.md
```markdown
# metrics

## PURPOSE

metrics 子域負責指標定義、聚合與 measurement 語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 metric definition 與 aggregation 能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep metrics terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 metrics 邊界。
```

## File: src/modules/analytics/subdomains/realtime-insights/AGENTS.md
```markdown
# realtime-insights Subdomain Agent Rules

## ROLE

- The agent MUST treat realtime-insights as the analytics subdomain for live analytical signal semantics.
- The agent MUST keep realtime-insights documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep realtime-insights inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep realtime signal terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine upstream real-time behavior as analytics-owned writes.

## Route Here When

- You document analytics realtime-insights boundaries.

## Route Elsewhere When

- Insights logic: [../insights/AGENTS.md](../insights/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/analytics/subdomains/realtime-insights/README.md
```markdown
# realtime-insights

## PURPOSE

realtime-insights 子域負責即時分析訊號與即時洞察語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 live analytical signal 能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep realtime-insights terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 realtime-insights 邊界。
```

## File: docs/structure/contexts/analytics/AGENTS.md
```markdown
# Analytics Context Agent Rules

## ROLE

- The agent MUST treat this directory as the documentation authority for the analytics context inside docs/structure/contexts.
- The agent MUST keep analytics framed as downstream projection and insight owner.

## DOMAIN BOUNDARIES

- The agent MUST preserve analytics ownership for reporting, metrics, dashboards, telemetry-projection, experimentation, and decision-support.
- The agent MUST NOT let analytics become an upstream canonical aggregate owner.

## TOOL USAGE

- The agent MUST align context docs with strategic docs before local edits.
- The agent MUST keep cross-context references explicit and valid.

## EXECUTION FLOW

- The agent MUST identify whether the question is projection, metrics, dashboards, or context routing.
- The agent MUST update local context docs without competing with root strategic docs.

## CONSTRAINTS

- The agent MUST preserve analytics as downstream sink and read-model owner.
- The agent MUST avoid implementation-level framework detail in context governance docs.

## Route Here When

- You document analytics context ownership, boundaries, or cross-context routing.

## Route Elsewhere When

- Root strategic ownership decisions: [../../../README.md](../../../README.md)
```