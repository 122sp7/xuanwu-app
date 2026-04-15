/**
 * Analytics Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// event-contracts
export * from "./subdomains/event-contracts/domain";
export * from "./subdomains/event-contracts/application";
export { InMemoryAnalyticsEventRepository } from "./subdomains/event-contracts/adapters/outbound/memory/InMemoryAnalyticsEventRepository";

// metrics
export * from "./subdomains/metrics/domain";
export * from "./subdomains/metrics/application";
export { InMemoryMetricRepository } from "./subdomains/metrics/adapters/outbound/memory/InMemoryMetricRepository";

// event-ingestion domain types
export type { IngestionBatch, IngestionBatchRepository, IngestionStatus } from "./subdomains/event-ingestion/domain/entities/IngestionBatch";
export { IngestEventBatchUseCase } from "./subdomains/event-ingestion/application/use-cases/IngestionUseCases";

// event-projection domain types
export type { EventProjection, EventProjectionRepository } from "./subdomains/event-projection/domain/entities/EventProjection";

// insights domain types
export type { Insight, InsightRepository } from "./subdomains/insights/domain/entities/Insight";

// realtime-insights domain types
export type { RealtimeMetricSample, RealtimeMetricWindow, RealtimeInsightPort } from "./subdomains/realtime-insights/domain/entities/RealtimeMetric";

// experimentation domain types
export type { Experiment, ExperimentRepository, ExperimentStatus } from "./subdomains/experimentation/domain/entities/Experiment";
