---
title: RAG ingestion development contract
description: Authoritative cross-runtime contract for RAG upload registration, worker execution, lifecycle transitions, and acceptance gates.
status: "🚧 Developing"
---

# RAG ingestion development contract

> **開發狀態**：🚧 Developing — 積極開發中

## Scope

Authoritative cross-runtime contract for upload-to-worker boundary spanning Next.js registration, Firestore metadata, Python execution, and retrieval readiness.

## Owning modules and runtimes

| Responsibility | Owner |
| --- | --- |
| Upload registration and browser-facing orchestration | `modules/asset` and Next.js interfaces |
| Ingestion registration and lifecycle intent | `modules/knowledge` |
| Retrieval orchestration and answer generation | `modules/retrieval` |
| Parsing, chunking, embedding, and lifecycle write-back | `py_fn` |

## Canonical upload request

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `organizationId` | `string` | Tenant |
| `workspaceId` | `string` | Retrieval scope |
| `uploaderId` | `string` | Audit actor |
| `sourceFileName` | `string` | File name |
| `mimeType` | `string` | Parser routing |
| `sizeBytes` | `number` | Size |
| `checksum` | `string` | Idempotency |

## Canonical `documents` metadata

**Path**: `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}`

| `id` | `string` | Doc ID |
| `organizationId` | `string` | Tenant |
| `workspaceId` | `string` | Retrieval scope |
| `title` | `string` | Display |
| `sourceFileName` | `string` | File name |
| `mimeType` | `string` | Parser routing |
| `storagePath` | `string` | Storage pointer |
| `checksum` | `string?` | Idempotency |
| `taxonomy` | `string?` | Classification hint |
| `status` | `uploaded\|processing\|ready\|failed\|archived` | Lifecycle |
| `processingStartedAt` | `timestamp?` | Worker-owned |
| `readyAt` | `timestamp?` | Worker-owned |
| `failedAt` | `timestamp?` | Worker-owned |
| `archivedAt` | `timestamp?` | Governance |
| `errorCode` | `string?` | Failure class |
| `errorMessage` | `string?` | Failure detail |
| `createdAt` | `timestamp` | Registered |
| `updatedAt` | `timestamp` | Updated |

## Worker invocation boundary

Firestore-driven: document `status=uploaded` triggers worker to resolve metadata, read artifact, set `processing`, persist chunks, write terminal status.

Python callable bridge remains for internal/admin reprocess flows when `rawText` omitted, uses document `storagePath`.

## Worker command fields

| `documentId` | `string` | Correlation key |
| `organizationId` | `string` | Tenant (reject if missing) |
| `workspaceId` | `string` | Scope (reject if missing) |
| `title` | `string` | Prompt/audit |
| `sourceFileName` | `string` | Audit context |
| `mimeType` | `string` | Router hint |
| `storagePath` | `string` | Storage path |
| `checksum` | `string?` | Idempotency |
| `taxonomyHint` | `string?` | Pre-classify hint |

## `chunks` persistence contract

**Path**: `/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}`

| `chunkId` | `string` | Deterministic ID |
| `docId` | `string` | Parent doc ID |
| `organizationId` | `string` | Tenant filter |
| `workspaceId` | `string` | Workspace filter |
| `chunkIndex` | `number` | Sequence |
| `text` | `string` | Retrieval source |
| `embedding` | `number[]` | Vector |
| `taxonomy` | `string` | Filter field |
| `page` | `number?` | Page ref |
| `tags` | `string[]?` | Metadata |

## Lifecycle state machine

| `uploaded` | Next.js | `processing` | Registration only |
| `processing` | Worker | `ready`, `failed` | Started |
| `ready` | Worker/governance | `processing`, `archived` | Terminal success |
| `failed` | Worker | `processing` | Retry |
| `archived` | Governance | terminal | No self-revive |

## Invariants

1. `organizationId` + `workspaceId` on both documents + chunks
2. Embeddings computed once, reused (org/workspace scoped)
3. Workspace retrieval preferred (cheaper than org-scoped)
4. Archive ≠ ingestion side-effect
5. Worker: never persist chunks without terminal status
6. Idempotency: `documentId + checksum`, reprocess replaces prior chunks

## Legacy note

Fallback to Firestore snapshot IDs (pre-MVP docs/chunks without duplicated `id`/`chunkId` still readable). No automatic backfill; legacy rows pick up duplicated fields on next reprocess.

## Acceptance gates

✓ DTOs, fields, command fields match this contract
✓ Trigger path explicit (Firestore or callable, one primary)
✓ Firestore indexes support documented patterns
✓ Worker records all timestamps + classified errors

## Open blockers

- Replace compatibility callable with Firestore `status=uploaded` trigger
- Consolidate ADR-010 with current `mimeType` + `sourceFileName` usage
- Add archive/unarchive write-side before UI governance
