---
title: RAG ingestion development contract
description: Authoritative cross-runtime contract for RAG upload registration, worker execution, lifecycle transitions, and acceptance gates.
---

# RAG ingestion development contract

## Scope

This contract is the authoritative implementation reference for the upload-to-worker boundary that spans Next.js registration, Firestore document metadata, Python ingestion execution, and retrieval readiness.

## Owning modules and runtimes

| Responsibility | Owner |
| --- | --- |
| Upload registration and browser-facing orchestration | `modules/file` and Next.js interfaces |
| Retrieval orchestration and answer generation | `modules/ai` |
| Parsing, chunking, embedding, and lifecycle write-back | `py_fn` |

## Canonical upload request

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `organizationId` | `string` | yes | Tenant boundary |
| `workspaceId` | `string` | yes | Retrieval working-set boundary |
| `uploaderId` | `string` | yes | Actor for audit and attribution |
| `sourceFileName` | `string` | yes | Original user-facing file name |
| `mimeType` | `string` | yes | Required for parser routing |
| `sizeBytes` | `number` | yes | Artifact size at registration |
| `checksum` | `string` | yes | Idempotency key component |

## Canonical `documents` metadata

**Collection Path**: `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Server-generated document identifier, duplicated from the Firestore doc id so collection-group consumers can project a stable field without depending on snapshot metadata |
| `organizationId` | `string` | yes | Tenant boundary |
| `workspaceId` | `string` | yes | Workspace retrieval boundary |
| `title` | `string` | yes | Human-readable document title |
| `sourceFileName` | `string` | yes | Upload file name |
| `mimeType` | `string` | yes | Parser routing metadata |
| `storagePath` | `string` | yes | Organization/workspace-scoped storage pointer |
| `checksum` | `string` | no | Required in production flow even if compatibility paths still allow omission |
| `taxonomy` | `string` | no | Optional hint before ingestion completes |
| `status` | `uploaded \| processing \| ready \| failed \| archived` | yes | Shared lifecycle field |
| `processingStartedAt` | timestamp | no | Worker-owned |
| `readyAt` | timestamp | no | Worker-owned |
| `failedAt` | timestamp | no | Worker-owned |
| `archivedAt` | timestamp | no | Maintenance or product-owned |
| `errorCode` | `string` | no | Worker-owned classified failure |
| `errorMessage` | `string` | no | Worker-owned failure detail |
| `createdAt` | timestamp | yes | Registration timestamp |
| `updatedAt` | timestamp | yes | Last metadata update |

## Worker invocation boundary

### Target boundary

The primary boundary is now a Firestore-driven ingestion flow that begins when a document is registered with `status=uploaded` under `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}`. The worker resolves the document metadata, reads the source artifact from Cloud Storage, transitions the document to `processing`, and then persists chunks plus the final lifecycle result.

### Compatibility boundary

The Python HTTPS callable remains available as a secondary internal/admin bridge. It may still accept `rawText` for explicit reprocess/testing flows, but when `rawText` is omitted it should resolve the source text from the document `storagePath` instead of inventing a second browser-facing ingestion contract.

## Worker command fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `documentId` | `string` | yes | Primary correlation key |
| `organizationId` | `string` | yes | Reject if missing |
| `workspaceId` | `string` | yes | Reject if missing |
| `title` | `string` | yes | Prompt and audit context |
| `sourceFileName` | `string` | yes | File name carried into worker audit context |
| `mimeType` | `string` | yes | Parser routing hint |
| `storagePath` | `string` | yes | Cloud Storage object path for worker download |
| `checksum` | `string` | no | Idempotency guard |
| `taxonomyHint` | `string` | no | Optional pre-classification hint |

## `chunks` persistence contract

**Collection Path**: `/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `chunkId` | `string` | yes | Deterministic chunk identifier, duplicated from the Firestore doc id so collection-group consumers can project a stable field without depending on snapshot metadata; guaranteed on new MVP ingestion writes |
| `docId` | `string` | yes | Parent document id |
| `organizationId` | `string` | yes | Tenant filter |
| `workspaceId` | `string` | yes | Workspace filter |
| `chunkIndex` | `number` | yes | Deterministic sequence |
| `text` | `string` | yes | Retrieval source text |
| `embedding` | `number[]` | yes | Vector payload |
| `taxonomy` | `string` | yes | Retrieval filter field |
| `page` | `number` | no | Optional page reference |
| `tags` | `string[]` | no | Optional retrieval metadata |

## Lifecycle state machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `uploaded` | Next.js upload registration | `processing` | Registration-only state |
| `processing` | ingestion worker | `ready`, `failed` | Worker writes `processingStartedAt` |
| `ready` | ingestion worker or product governance | `processing`, `archived` | `processing` is reprocess; `archived` is not worker-owned |
| `failed` | ingestion worker | `processing` | Retry path |
| `archived` | maintenance or product governance | terminal until an explicit unarchive flow is defined | Do not let worker self-revive archived documents |

## Invariants

1. `organizationId` and `workspaceId` must exist on both `documents` and `chunks`.
2. Embeddings are computed once during ingestion and reused for organization-scoped or workspace-scoped retrieval.
3. Workspace-scoped retrieval should be preferred whenever the caller has a workspace boundary, because organization-only collection-group scans are broader and more expensive.
4. Archive is a governance transition, not an ingestion side effect.
5. The worker must never persist chunks without also writing a terminal document status.
6. Idempotency is keyed by `documentId + checksum`, and reprocess must replace prior chunk records rather than duplicate them.

## Legacy data note

- Retrieval currently falls back to Firestore snapshot ids, so pre-MVP `documents` or `chunks` rows without duplicated `id` or `chunkId` fields remain readable.
- No automatic backfill is included in this slice; legacy rows pick up the duplicated fields the next time they are reprocessed.

## Acceptance gates

A slice is ready for implementation only when all of the following are true:

- TypeScript registration DTOs, Firestore metadata fields, and Python worker command fields match this page.
- The chosen trigger path is explicit: either compatibility callable or target Firestore event, with one marked as primary.
- `firestore.indexes.json` supports the documented retrieval and retry patterns.
- The ingestion worker records `processingStartedAt`, terminal timestamps, and classified error fields.

## Open blockers still to resolve

- Replace the compatibility callable boundary with the target Firestore `status=uploaded` trigger.
- Consolidate ADR-010 with the current `mimeType` and `sourceFileName` field usage.
- Add the archive or unarchive write-side flow before exposing document governance in the UI.
