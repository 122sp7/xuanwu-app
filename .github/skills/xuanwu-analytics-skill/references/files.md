# Files

## File: src/modules/analytics/orchestration/index.ts
````typescript
// analytics — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement AnalyticsFacade if needed.
````

## File: src/modules/analytics/shared/errors/index.ts
````typescript
// analytics shared/errors placeholder
````

## File: src/modules/analytics/shared/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/event-contracts/adapters/inbound/index.ts
````typescript
// event-contracts — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/index.ts
````typescript
// event-contracts — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/index.ts
````typescript
// event-contracts — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/memory/InMemoryAnalyticsEventRepository.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-contracts/domain/events/AnalyticsDomainEvent.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-contracts/domain/repositories/AnalyticsEventRepository.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/inbound/index.ts
````typescript
// event-ingestion — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/index.ts
````typescript
// event-ingestion — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/outbound/index.ts
````typescript
// event-ingestion — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-ingestion/application/index.ts
````typescript
// event-ingestion — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/entities/IngestionBatch.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/events/IngestionDomainEvent.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/index.ts
````typescript
// event-ingestion — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/event-projection/adapters/inbound/index.ts
````typescript
// event-projection — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-projection/adapters/index.ts
````typescript
// event-projection — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-projection/adapters/outbound/index.ts
````typescript
// event-projection — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-projection/application/index.ts
````typescript
// event-projection — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/event-projection/application/use-cases/ProjectionUseCases.ts
````typescript
// TODO: implement use-cases for computing and querying event projections
// Depends on EventProjectionRepository
````

## File: src/modules/analytics/subdomains/event-projection/domain/entities/EventProjection.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-projection/domain/index.ts
````typescript
// event-projection — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/experimentation/adapters/inbound/index.ts
````typescript
// experimentation — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
````

## File: src/modules/analytics/subdomains/experimentation/adapters/index.ts
````typescript
// experimentation — adapters aggregate
````

## File: src/modules/analytics/subdomains/experimentation/adapters/outbound/index.ts
````typescript
// experimentation — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
````

## File: src/modules/analytics/subdomains/experimentation/application/index.ts
````typescript
// experimentation — application layer placeholder
// TODO: export use-cases, DTOs, application services
````

## File: src/modules/analytics/subdomains/experimentation/application/use-cases/ExperimentUseCases.ts
````typescript
// TODO: implement experiment lifecycle and variant assignment use-cases
````

## File: src/modules/analytics/subdomains/experimentation/domain/entities/Experiment.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/experimentation/domain/index.ts
````typescript
// experimentation — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/insights/adapters/inbound/index.ts
````typescript
// insights — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/insights/adapters/index.ts
````typescript
// insights — adapters aggregate
````

## File: src/modules/analytics/subdomains/insights/adapters/outbound/index.ts
````typescript
// insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/insights/application/index.ts
````typescript
// insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/insights/application/use-cases/InsightUseCases.ts
````typescript
// TODO: implement insight generation use-cases
// Depends on MetricRepository and InsightRepository
````

## File: src/modules/analytics/subdomains/insights/domain/entities/Insight.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/insights/domain/index.ts
````typescript
// insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/metrics/adapters/inbound/index.ts
````typescript
// metrics — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/metrics/adapters/index.ts
````typescript
// metrics — adapters aggregate
````

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/index.ts
````typescript
// metrics — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/memory/InMemoryMetricRepository.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/metrics/domain/repositories/MetricRepository.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/inbound/index.ts
````typescript
// realtime-insights — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/index.ts
````typescript
// realtime-insights — adapters aggregate
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/outbound/index.ts
````typescript
// realtime-insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/realtime-insights/application/index.ts
````typescript
// realtime-insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/realtime-insights/application/use-cases/RealtimeInsightUseCases.ts
````typescript
// TODO: implement use-cases for real-time metric ingestion and query
// Depends on RealtimeInsightPort
````

## File: src/modules/analytics/subdomains/realtime-insights/domain/entities/RealtimeMetric.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/realtime-insights/domain/index.ts
````typescript
// realtime-insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/index.ts
````typescript
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
````

## File: src/modules/analytics/shared/events/index.ts
````typescript
// analytics shared events
````

## File: src/modules/analytics/shared/types/index.ts
````typescript
// analytics shared types
````

## File: src/modules/analytics/subdomains/event-contracts/application/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/event-contracts/application/use-cases/AnalyticsEventUseCases.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-contracts/domain/entities/AnalyticsEvent.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/event-contracts/domain/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/event-contracts/domain/value-objects/EventName.ts
````typescript
import { z } from "zod";
⋮----
export type EventName = z.infer<typeof EventNameSchema>;
⋮----
export function createEventName(value: string): EventName
````

## File: src/modules/analytics/subdomains/event-ingestion/application/use-cases/IngestionUseCases.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/metrics/application/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/metrics/application/use-cases/MetricUseCases.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/metrics/domain/entities/Metric.ts
````typescript
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
````

## File: src/modules/analytics/subdomains/metrics/domain/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/metrics/domain/value-objects/MetricName.ts
````typescript
import { z } from "zod";
⋮----
export type MetricName = z.infer<typeof MetricNameSchema>;
⋮----
export type MetricValue = z.infer<typeof MetricValueSchema>;
````

## File: src/modules/analytics/README.md
````markdown
# Analytics Module

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `event-contracts` | 🔨 骨架建立，實作進行中 | 事件契約定義 |
| `event-ingestion` | 🔨 骨架建立，實作進行中 | 事件接收 / 攝取 |
| `event-projection` | 🔨 骨架建立，實作進行中 | 事件投影（讀模型）|
| `experimentation` | 🔨 骨架建立，實作進行中 | A/B 測試與功能實驗管理 |
| `insights` | 🔨 骨架建立，實作進行中 | 洞察報表 |
| `metrics` | 🔨 骨架建立，實作進行中 | 指標計算 |
| `realtime-insights` | 🔨 骨架建立，實作進行中 | 即時洞察 |

---

## 預期目錄結構

```
src/modules/analytics/
  index.ts
  README.md
  AGENT.md
  orchestration/
  shared/
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    event-projection/
      domain/
      application/
      adapters/outbound/
    metrics/
    event-ingestion/
    event-contracts/
    experimentation/
    insights/
    realtime-insights/
```

---

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `domain/` 中 import Firebase SDK、React | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/analytics/AGENT.md
````markdown
# Analytics Module — Agent Guide

## Purpose

`src/modules/analytics` 是 **Analytics 能力模組**，為 Xuanwu 系統提供事件投影、指標計算、洞察報表等分析能力的實作落點。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `event-contracts` | 事件契約定義（Published Language）| 🔨 骨架建立，實作進行中 |
| `event-ingestion` | 事件接收 / 攝取 | 🔨 骨架建立，實作進行中 |
| `event-projection` | 事件投影（讀模型計算）| 🔨 骨架建立，實作進行中 |
| `experimentation` | A/B 測試與功能實驗管理 | 🔨 骨架建立，實作進行中 |
| `insights` | 洞察報表 | 🔨 骨架建立，實作進行中 |
| `metrics` | 指標計算 | 🔨 骨架建立，實作進行中 |
| `realtime-insights` | 即時洞察 | 🔨 骨架建立，實作進行中 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 Analytics 的新 use case、entity、adapter 實作。
- 實作事件投影、指標計算 port 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/analytics/AGENT.md`
- 跨模組 API boundary → `src/modules/analytics/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/analytics/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/analytics/`（本層） |
| 跨模組 API boundary | `src/modules/analytics/index.ts` |

**嚴禁事項：**
- ❌ 在 `domain/` 匯入 Firebase SDK、React
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````