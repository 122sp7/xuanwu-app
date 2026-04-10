<!-- Purpose: Subdomain scaffold overview for platform 'analytics'. -->
# analytics Subdomain

**Subdomain**: `analytics` | **Module**: `platform` | **Context**: Platform
**Classification**: Generic Subdomain | **Owner**: Platform Team

## Purpose

Measure and aggregate platform usage behavior. Captures anonymous and attributed usage signals from all modules, computes aggregated metrics, and exposes summaries for product and operational decision-making. Does **not** own compliance or audit responsibilities (those belong to `audit-log` and `compliance`).

## Core Responsibility

- Ingest usage events (`AnalyticsEvent`) from all platform consumers
- Aggregate events into metric snapshots (daily/weekly/monthly active counts, feature usage rates)
- Provide query API for usage summaries by time range, actor scope, or feature dimension
- Respect privacy settings: anonymise or skip events for accounts with analytics opt-out

## Key Aggregates

- **AnalyticsEvent** — single usage signal (eventId, eventType, subjectId?, workspaceId?, occurredAt, properties)
- **MetricSnapshot** — pre-computed aggregate over a time window (dimension, period, value, computedAt)

## Domain Events

- `analytics.event-recorded` — a usage signal has been ingested
- `analytics.snapshot-computed` — a metric aggregate has been refreshed

## Inbound Contracts

Consumes events from sibling and downstream modules; examples:
- `account.created`, `identity.subject-authenticated` → MAU, signup funnel metrics
- `notion.page-created`, `notebooklm.notebook-created` → feature engagement metrics
- `workspace.member-joined` → collaboration adoption metrics

## Outbound Contracts

- Read-only API: `getUsageSummary(dimension, period)` → `MetricSnapshot`
- No command dependency from analytics to other subdomains
- Does not publish domain events to other subdomains

## Technical Notes

- Events should be ingested asynchronously (event bus / job queue) to avoid blocking hot paths
- Anonymisation applies before storage when subject has opted out
- Snapshots recomputed by `background-job` on a schedule; do not recompute on every query
- Separate read-replica or analytics store recommended for heavy aggregation queries

## Status

🔨 Migration-Pending — scaffold only