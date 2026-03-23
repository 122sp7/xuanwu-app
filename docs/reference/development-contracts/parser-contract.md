---
title: Parser development contract
description: Implementation contract for parser module inputs, summary outputs, future parser job ownership, and acceptance rules.
status: "🏗️ Midway"
---

# Parser development contract

> **開發狀態**：🏗️ Midway — 開發部分完成

## Scope

This contract defines the parser module boundary for workspace parser readiness, source discovery, and future parser execution work. It is intentionally anchored to the current read-side summary while naming the rules that future write-side work must preserve.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Parser summary derivation | `modules/parser` |
| File readiness input | `modules/file` query boundary |
| Workspace capability and cover context | `modules/workspace` read model |

## Current query contract

### Entry point

`getWorkspaceParserSignalSummary(workspace)` resolves file data through the file module and returns a `WorkspaceParserSummary`.

### Output shape

| Field | Type | Meaning |
| --- | --- | --- |
| `supportedSources` | `number` | Count of sources that can feed parser work |
| `readyAssetCount` | `number` | Count of assets already usable for parsing |
| `blockedReasons` | `string[]` | Reasons the workspace is not parser-ready |
| `nextActions` | `string[]` | Actionable follow-up suggestions |

## Input contract

The parser module may derive summary state from these sources only:

- workspace cover or media context
- workspace capability count
- file-module list items and their lifecycle status

The parser module must not reach into storage blobs, Firestore parser-job collections, or RAG chunk records from the query path.

## Future parser job boundary

When parser execution is introduced, it should create a parser-owned job contract rather than mutate the summary directly.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `jobId` | `string` | yes | Parser execution identifier |
| `workspaceId` | `string` | yes | Scope boundary |
| `sourceFileId` | `string` | yes | File module reference |
| `sourceDocumentId` | `string` | no | RAG or document pointer if available |
| `status` | `queued \| processing \| ready \| failed` | yes | Parser job lifecycle |
| `triggeredByAccountId` | `string` | yes | Audit actor |
| `errorCode` | `string` | no | Failure classification |
| `errorMessage` | `string` | no | Failure detail |

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `blocked` | derived summary only | `ready` | Computed from source readiness |
| `ready` | derived summary or parser job creation | `processing`, `blocked` | Do not write this into file metadata |
| `processing` | parser worker or orchestrator | `ready`, `failed` | Future write-side state |
| `failed` | parser worker or orchestrator | `processing`, `blocked` | Retry must keep prior audit trail |

`blocked` and `ready` are summary states. `processing` and `failed` belong to a future parser job aggregate and must not be backfilled into the current summary shape.

## Invariants

1. Parser summary stays a parser-owned projection, not a shadow copy of file lifecycle.
2. File metadata remains canonical for asset availability.
3. Parser execution state, once introduced, must be stored in parser-owned records rather than on `WorkspaceEntity`.
4. The parser query path must stay read-only and deterministic from workspace plus file inputs.

## Acceptance gates

Future parser work should begin only when:

- the source asset eligibility rule is explicit,
- parser job storage is defined in parser-owned infrastructure,
- file-module references stay external through query or port boundaries,
- and failure or retry semantics are documented before the first write-side action lands.
