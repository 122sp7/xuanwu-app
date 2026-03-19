---
title: Knowledge development contract
description: Implementation contract for the current knowledge read-side surface, visible workspace UI, and future ingestion or retrieval ownership.
---

# Knowledge development contract

## Scope

This contract defines the current knowledge boundary as a read-side summary surfaced in the workspace UI. It also records the ownership rules that future ingestion, chunk, retrieval, and governance work must preserve while the broader knowledge architecture in `/home/runner/work/xuanwu-app/xuanwu-app/docs/architecture/knowledge.md` remains the target design.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Workspace knowledge summary and visible tab | `modules/knowledge` |
| Registered file metadata and readiness | `modules/file` |
| Parser readiness signal | `modules/parser` |
| Workspace shell surface | `modules/workspace` |

## Current query contract

### Entry point

`getWorkspaceKnowledgeSummary(workspace)` returns a `WorkspaceKnowledgeSummary`.

### Output shape

| Field | Type | Meaning |
| --- | --- | --- |
| `registeredAssetCount` | `number` | Count of registered workspace assets |
| `readyAssetCount` | `number` | Count of active assets already usable as knowledge inputs |
| `supportedSourceCount` | `number` | Count of sources the parser summary can stage |
| `status` | `needs-input \| staged \| ready` | Derived knowledge posture |
| `blockedReasons` | `string[]` | Why the workspace is not fully knowledge-ready |
| `nextActions` | `string[]` | Recommended follow-up steps |
| `visibleSurface` | `"workspace-tab-live"` | Confirms a user-visible UI is online |
| `contractStatus` | `"contract-live"` | Confirms the contract slice is published |

## Current visible UI

The shipped visible surface is the workspace detail page Knowledge tab:

- component: `/home/runner/work/xuanwu-app/xuanwu-app/modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx`
- shell mount: `/home/runner/work/xuanwu-app/xuanwu-app/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx`
- purpose: make the contract visible and testable before knowledge write-side work lands

## Input contract

The current knowledge summary may derive state from these inputs only:

- file-module list items and their lifecycle status
- parser summary state derived from workspace plus file metadata
- workspace context needed to scope the query

The current query path must not directly read storage blobs, chunk collections, vector indexes, or retrieval logs.

## Future write-side boundary

When ingestion and retrieval are introduced, they should become knowledge-owned records rather than being written into workspace or file projections.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `knowledgeDocumentId` | `string` | yes | Knowledge-owned document identifier |
| `workspaceId` | `string` | yes | Workspace boundary |
| `sourceFileId` | `string` | yes | File module reference |
| `sourceVersionId` | `string` | no | File-version correlation |
| `status` | `queued \| processing \| ready \| failed \| archived` | yes | Knowledge document lifecycle |
| `chunkCount` | `number` | no | Terminal write-back metric |
| `retrievalPolicyId` | `string` | no | Future retrieval or governance linkage |
| `triggeredByAccountId` | `string` | yes | Audit actor |
| `errorCode` | `string` | no | Failure classification |
| `errorMessage` | `string` | no | Failure detail |

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `needs-input` | derived knowledge summary | `staged` | No ready assets yet |
| `staged` | derived knowledge summary | `ready`, `needs-input` | Visible UI is online, but some blocking inputs remain |
| `ready` | derived knowledge summary or future knowledge orchestration | `processing`, `staged` | Read-side summary may show ready before write-side exists |
| `processing` | future knowledge worker | `ready`, `failed`, `archived` | Knowledge-owned write-side state |
| `failed` | future knowledge worker | `processing`, `staged` | Retry path must keep audit history |
| `archived` | governance flow | terminal until an explicit restore flow exists | Not owned by workspace UI |

`needs-input`, `staged`, and `ready` are summary states. `processing`, `failed`, and `archived` belong to a future knowledge-owned aggregate and must not be backfilled into workspace or parser summaries.

## Invariants

1. Knowledge remains a separate module boundary even while it derives its current posture from file and parser inputs.
2. The visible workspace Knowledge tab is allowed to coordinate presentation, but not to own ingestion or retrieval business rules.
3. File metadata stays canonical for asset availability, and parser stays canonical for parser readiness.
4. Future chunk, vector, and retrieval writes must land in knowledge-owned infrastructure rather than being hidden inside workspace or parser UI code.

## Acceptance gates

Before expanding beyond the current read-side slice, the team should define:

- the canonical knowledge document aggregate and storage boundary,
- how knowledge write-side status maps to the architecture spec fields in `/home/runner/work/xuanwu-app/xuanwu-app/docs/architecture/knowledge.md`,
- how retrieval governance and archive flows are audited,
- and which runtime owns chunk persistence plus vector indexing.
