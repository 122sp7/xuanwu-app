<!-- Purpose: Subdomain scaffold overview for platform 'observability'. -->

## Overview

The **Observability** subdomain within the **Platform** bounded context provides health metrics, distributed tracing, monitoring, and alerting capabilities across Xuanwu. It enables visibility into system behavior, performance characteristics, and operational health.

## Responsibility

- **Health Metrics**: Collect and expose system health indicators (response times, error rates, throughput).
- **Distributed Tracing**: Track requests across service boundaries to identify performance bottlenecks.
- **Monitoring & Alerting**: Define thresholds and trigger alerts on anomalies.
- **Observability Policy**: Establish standards for logging, metrics, and trace collection.
- **Diagnostic Dashboard**: Aggregate observability signals for operator review.

## Ubiquitous Language

| Term | Definition |
|---|---|
| **Metric** | Quantitative measurement (e.g., request latency, error count, memory usage). |
| **Trace** | Causal chain of spans across modules showing request flow. |
| **Span** | Single operation within a trace (e.g., function call, RPC, database query). |
| **Alert Rule** | Condition that triggers notification when metric breaches threshold. |
| **Observability Policy** | Organization-wide standards for instrumentation and data retention. |

## Key Aggregates

- **HealthMetric**: Root aggregate tracking system health signals.
- **TraceRecord**: Immutable record of a distributed trace and its constituent spans.
- **AlertRule**: Rule configuration for threshold-based alerting.
- **ObservabilityPolicy**: Organization-level configuration governing collection and retention.

## Cross-Context Collaboration

- **Upstream**: All other bounded contexts emit health metrics and traces.
- **Downstream**: Notification subdomain consumes alert events.
- **Published Language**: `HealthMetricEmitted`, `AnomalyDetected` (domain events).

## Implementation Status

- [ ] Health metric collection interface
- [ ] Trace instrumentation adapter
- [ ] Alert rule engine
- [ ] Dashboard query contract
