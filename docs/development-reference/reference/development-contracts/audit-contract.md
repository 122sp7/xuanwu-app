---
title: Audit development contract
description: Implementation contract for append-only audit queries, source boundaries, and future audit ingestion rules.
status: "🏗️ Midway"
---

# Audit development contract

> **開發狀態**：🏗️ Midway — 開發部分完成

## Scope

Audit module: append-only read boundary for workspace and organization audit visibility, plus rules for future write-side integration.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Workspace and organization audit queries | `modules/audit` |
| Durable storage adapter | `modules/audit` Firebase repository |
| Upstream audit event producers | other modules through future ports or adapters |

## Current query contract

### Workspace query

`getWorkspaceAuditLogs(workspaceId)` returns all logs for a workspace, or an empty list if the input is blank.

### Organization query

`getOrganizationAuditLogs(workspaceIds, maxCount?)` returns logs aggregated over a list of workspace ids.

### Audit log shape

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Audit event identifier |
| `workspaceId` | `string` | Workspace scope |
| `actorId` | `string` | Actor responsible for the event |
| `action` | `string` | Event action name |
| `detail` | `string` | Human-readable event detail |
| `source` | `workspace \| finance \| notification \| system` | Producing source boundary |
| `occurredAtISO` | `string` | Event timestamp |

## Target write-side boundary

Future audit ingestion should expose an append-only audit sink rather than let feature modules write directly to Firebase collections.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `workspaceId` | `string` | yes | Scope boundary |
| `actorId` | `string` | yes | Actor identifier or system principal |
| `action` | `string` | yes | Stable event name |
| `detail` | `string` | yes | Operator-facing summary |
| `source` | enum | yes | Producing module |
| `occurredAtISO` | `string` | yes | Source event time |
| `traceId` | `string` | no | Cross-service correlation |
| `metadata` | object | no | Structured audit context |

## State machine

Audit logs are append-only. The relevant workflow is event delivery, not business-state mutation.

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `accepted` | audit sink | `persisted`, `failed` | Validation passed |
| `persisted` | audit repository | terminal | Visible to queries |
| `failed` | audit sink or repository | `accepted` through explicit retry | Preserve original payload |

## Invariants

1. Queries never mutate audit records.
2. Audit records are append-only and must not be repurposed as operational state.
3. Source modules emit audit events through an audit-owned boundary rather than writing storage records directly.
4. Organization-level views aggregate workspace logs without duplicating the source event.

## Acceptance gates

Before expanding integrations, define:
- Canonical audit sink interface
- Idempotency rules for retried events
- Retention and redaction policy
- Minimum structured metadata for enterprise investigations
