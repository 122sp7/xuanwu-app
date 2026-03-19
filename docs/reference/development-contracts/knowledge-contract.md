---
title: Knowledge development contract
description: Implementation contract for the current knowledge read-side surface, visible workspace UI, and future ingestion or retrieval ownership.
---

# Knowledge development contract

## Scope

This contract defines the current knowledge boundary as a read-side summary surfaced in the workspace UI, and aligns the MVP write-side boundary with `docs/architecture/knowledge.md`.

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

- component: `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx`
- shell mount: `modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx`
- purpose: make the contract visible and testable before knowledge write-side work lands

## UI/UX delivery contract (workspace knowledge tab)

This contract defines the minimum UI/UX behavior required for delivery so the knowledge surface is testable, user-visible, and architecture-safe.

### Surface and navigation

- The user can reach `Knowledge` from the workspace detail tabs in `modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx`.
- The tab renders `WorkspaceKnowledgeTab` from `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx`.

### Required UI states

| UI state | Trigger | Required behavior |
| --- | --- | --- |
| `loading` | Knowledge summary query in-flight | Show loading hint and avoid stale error text |
| `loaded` | Summary query succeeds | Show counts, posture badge, blocked reasons, and next actions |
| `error` | Summary query fails | Show fallback message and keep contract-visible defaults (`visibleSurface`, `contractStatus`) |

### Required visible fields

The tab must visibly render at least:

- `registeredAssetCount`
- `readyAssetCount`
- `supportedSourceCount`
- `status` badge (`needs-input | staged | ready`)
- `visibleSurface` and `contractStatus` badges
- blocked reasons list (or explicit empty-state text)
- recommended next actions list

### UX acceptance criteria

1. A workspace user can open the Knowledge tab and see a non-empty contract surface even when data loading fails.
2. The tab clearly distinguishes derived summary posture (`needs-input | staged | ready`) from write-side lifecycle states.
3. The tab does not expose ingestion internals as if they were owned by workspace UI state.
4. The tab content maps directly to this contract and `docs/architecture/knowledge.md` without conflicting terminology.

## Input contract

The current knowledge summary may derive state from these inputs only:

- file-module list items and their lifecycle status
- parser summary state derived from workspace plus file metadata
- workspace context needed to scope the query

The current query path must not directly read storage blobs, chunk collections, vector indexes, or retrieval logs.

## MVP write-side boundary (architecture-aligned)

The current implementation-aligned MVP follows the architecture spec: file upload registration and ingestion lifecycle are recorded in knowledge-base documents and chunks, while the workspace Knowledge tab remains a read-side posture surface.

The long-term target remains a knowledge-owned aggregate, but this contract uses the current MVP write-side lifecycle and vocabulary to stay consistent with the shipped architecture.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `knowledgeDocumentId` | `string` | yes | Knowledge-owned document identifier |
| `workspaceId` | `string` | yes | Workspace boundary |
| `sourceFileId` | `string` | yes | File module reference |
| `sourceVersionId` | `string` | no | File-version correlation |
| `status` | `uploaded \| processing \| ready \| failed \| archived` | yes | Knowledge document lifecycle |
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
| `ready` | derived knowledge summary | `staged` | Read-side summary posture; not a write-side owner state transition |
| `uploaded` | ingestion trigger | `processing` | Write-side document registered and queued for processing |
| `processing` | ingestion worker | `ready`, `failed`, `archived` | Write-side lifecycle state |
| `failed` | ingestion worker | `processing` | Retry path must keep audit history |
| `archived` | governance flow | terminal until an explicit restore flow exists | Not owned by workspace UI |

`needs-input`, `staged`, and `ready` are summary states. `uploaded`, `processing`, `failed`, and `archived` are write-side lifecycle states and must not be backfilled into workspace or parser summaries.

## Invariants

1. Knowledge remains a separate module boundary even while it derives its current posture from file and parser inputs.
2. The visible workspace Knowledge tab is allowed to coordinate presentation, but not to own ingestion or retrieval business rules.
3. File metadata stays canonical for asset availability, and parser stays canonical for parser readiness.
4. Future chunk, vector, and retrieval writes must land in knowledge-owned infrastructure rather than being hidden inside workspace or parser UI code.

## Acceptance gates

Before expanding beyond the current read-side slice, the team should define:

- the canonical knowledge document aggregate and storage boundary,
- how knowledge write-side status maps to the architecture spec fields in `docs/architecture/knowledge.md`,
- how retrieval governance and archive flows are audited,
- and which runtime owns chunk persistence plus vector indexing.
