---
title: Parser development contract
description: Implementation contract for parser module inputs, summary outputs, future parser job ownership, and acceptance rules.
status: "🏗️ Midway"
---

# Parser development contract

> **開發狀態**：🏗️ Midway — 開發部分完成

## Scope

Parser module: read-side summary of workspace parser readiness, source discovery, and future job ownership rules.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Parser summary derivation | `modules/parser` |
| Asset readiness input | `modules/asset` query boundary |
| Workspace capability and cover context | `modules/workspace` read model |

## Current query contract

### Entry point

`getWorkspaceParserSignalSummary(workspace)` resolves asset data through the asset module and returns a `WorkspaceParserSummary`.

### Output shape

| Field | Type | Meaning |
| --- | --- | --- |
| `supportedSources` | `number` | Sources for parser |
| `readyAssetCount` | `number` | Usable assets |
| `blockedReasons` | `string[]` | Not-ready reasons |
| `nextActions` | `string[]` | Follow-ups |

## Input contract

Parser may use only:
- Workspace cover/media
- Workspace capability count
- Asset-module items + lifecycle status

❌ Forbidden: storage blobs, parser-job collections, RAG chunks

Future parser execution creates parser-owned job contract:

| Field | Type | Notes |
| --- | --- | --- |
| `jobId` | `string` | UUID |
| `workspaceId` | `string` | Scope |
| `sourceFileId` | `string` | File ref |
| `status` | `queued\|processing\|ready\|failed` | Lifecycle |
| `triggeredByAccountId` | `string` | Audit |
| `errorCode` | `string?` | Failure class |
| `errorMessage` | `string?` | Failure detail |

## State machine

| `blocked` | derived | `ready` | From source readiness |
| `ready` | derived/job | `processing`, `blocked` | |
| `processing` | worker | `ready`, `failed` | Future |
| `failed` | worker | `processing`, `blocked` | Future |

## Invariants

1. Summary = parser projection, not file shadow
2. File metadata = canonical
3. Execution state → parser records (not workspace entity)
4. Query path: read-only, deterministic

## Acceptance gates

Before write-side, define:
- Asset eligibility rules
- Job storage (parser-owned infra)
- File-module boundary (query/port)
- Failure/retry semantics
