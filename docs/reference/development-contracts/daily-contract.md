---
title: Daily development contract
description: Development contract for Workspace Daily and Organization Daily, covering the current digest boundary, target write-side model, and Instagram-inspired feed rules.
status: "🏗️ Midway"
---

# Daily development contract

> **開發狀態**：🏗️ Midway — 開發部分完成

## Purpose

This contract defines the target development boundary for Daily in xuanwu-app:

- **Workspace Daily** is the daily feed for a single workspace
- **Organization Daily** aggregates all workspace Daily feeds under one organization
- the current standardized baseline is canonical authored entries over `dailyEntries`
- notification-driven digest remains a compatibility layer during migration
- the target implementation evolves Daily into an explainable feed system with authored entries, system signals, ranking, and promotion paths

This contract exists to remove ambiguity before expanding Daily beyond its current authored-entry standard.

## Current runtime boundary

### Implemented read-side

The repository currently ships these Daily queries:

| Query | Purpose | Current source |
| --- | --- | --- |
| `getWorkspaceDailyDigest(workspaceId, accountId)` | Load the daily digest for a single workspace | `DefaultDailyDigestRepository` over notification data |
| `getOrganizationDailyDigest(organizationId, workspaceIds)` | Load the organization-level digest across owned workspaces | `DefaultDailyDigestRepository` over notification data |
| `getWorkspaceDailyFeed(workspaceId)` | Load canonical authored Daily entries for one workspace | `FirebaseDailyFeedRepository` over `dailyEntries` |
| `getOrganizationDailyFeed(organizationId, workspaceIds)` | Load canonical authored Daily entries across an organization | `FirebaseDailyFeedRepository` over `dailyEntries` |

### Implemented command-side

| Command | Purpose | Current source |
| --- | --- | --- |
| `publishDailyEntry(input)` | Publish a canonical authored Daily entry | `PublishDailyEntryUseCase` + `FirebaseDailyEntryRepository` |

### Implemented entity contract

```ts
interface DailyDigestItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: number;
  workspaceId: string | null;
}

interface WorkspaceDailyDigestEntity {
  workspaceId: string;
  accountId: string;
  summary: { total: number; unread: number };
  items: DailyDigestItem[];
}

interface OrganizationDailyDigestEntity {
  organizationId: string;
  summary: { total: number; unread: number };
  items: DailyDigestItem[];
}
```

### Current limitations

1. Organization Daily ranking is still freshness-only (`rankReason = ["freshness"]`)
2. authored entries and notification digest still coexist as dual read paths
3. no interaction contract implementation yet (ack / bookmark / reaction / comment)
4. no explicit promotion path to knowledge, task, schedule, or audit
5. `selected_workspaces` visibility is reserved in the contract but not yet fully implemented in read-side targeting

## Product contract

### Core product rules

1. `Workspace Daily` behaves like the workspace's daily profile feed
2. `Organization Daily` only aggregates workspace Daily entries belonging to the same organization
3. Daily is primarily for **today's visible operating narrative**, not long-term document storage
4. content with long-term value must be promotable out of Daily
5. Organization Daily must support explainable prioritization instead of raw chronological dumping

### Instagram value extraction rules

| Extracted mechanism | Daily rule |
| --- | --- |
| Profile | each workspace feed must remain attributable to one workspace identity |
| Feed | each audience sees a ranked stream of today's relevant entries |
| Story | ephemeral entries may expire automatically after 24 hours |
| Highlight | promoted entries may stay pinned beyond the default feed window |
| Engagement | the system must record whether a signal was seen, acknowledged, or bookmarked |
| Discovery | organization view may recommend related workspaces or related entries, but cannot cross organization boundaries |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Daily Authoring Context | draft, publish, archive, and promote human-authored entries |
| Daily Signal Context | map domain events from other modules into Daily-compatible signals |
| Daily Feed Context | assemble ranked feeds for workspace and organization audiences |
| Daily Interaction Context | record acknowledgement, bookmark, reaction, and follow-up actions |
| Daily Promotion Context | escalate Daily content into task, knowledge, schedule, audit, or notification workflows |

## Target domain model

### Core entities

| Entity | Role | Key fields |
| --- | --- | --- |
| `DailyEntry` | canonical authored or system-generated Daily item | `entryId`, `organizationId`, `workspaceId`, `authorId`, `entryType`, `status`, `visibility`, `title`, `summary`, `body`, `publishedAtISO`, `expiresAtISO` |
| `DailyInteraction` | visible user interaction with a Daily entry | `interactionId`, `entryId`, `actorId`, `interactionType`, `createdAtISO` |
| `DailyFeedItem` | read-side representation prepared for a target audience | `audienceKey`, `entryId`, `rankScore`, `rankReason`, `workspaceId`, `publishedAtISO`, `expiresAtISO` |
| `DailyPromotion` | record of escalation from Daily into another module | `promotionId`, `entryId`, `targetType`, `targetId`, `promotedBy`, `promotedAtISO` |

### Enumerations

#### `DailyEntryType`

- `update`
- `blocker`
- `ask`
- `milestone`
- `signal`
- `story`
- `highlight`

#### `DailyEntryStatus`

- `draft`
- `published`
- `archived`
- `promoted`

#### `DailyVisibility`

- `workspace_only`
- `organization`
- `selected_workspaces`
- `public_demo`

#### `DailyInteractionType`

- `seen`
- `acknowledged`
- `bookmarked`
- `reacted`
- `commented`
- `promoted`

## Aggregate rules

### `DailyEntryAggregate`

Boundary:

- owns draft → publish → archive → promote lifecycle
- owns authored content and system-signal normalization

Invariants:

1. a published entry must belong to exactly one workspace and one organization
2. `workspaceId` and `organizationId` become immutable after publish
3. `story` entries must define `expiresAtISO`
4. archived entries cannot receive new promotion events

### `DailyInteractionAggregate`

Boundary:

- owns user-visible acknowledgement trail
- must not mutate the original entry body

Invariants:

1. interaction must target one existing `DailyEntry`
2. duplicate `acknowledged` interaction by the same actor for the same entry must be idempotent
3. interaction timestamps must be append-only

### `DailyFeedProjection`

Boundary:

- consumes Daily entry and signal events
- materializes audience-specific ranked feed items

Invariants:

1. Organization audience may only contain entries whose `organizationId` matches the audience organization
2. workspace audience may only contain entries whose `workspaceId` matches the audience workspace or are intentionally shared into that audience
3. expired entries must disappear from default feed queries unless explicitly highlighted
4. rank metadata must be recomputable from deterministic inputs

## Repository contracts

### `DailyEntryRepository`

Required responsibilities:

- create draft entry
- publish entry
- archive entry
- find entry by id
- list entries by workspace and day window

### `DailyFeedRepository`

Required responsibilities:

- list workspace feed
- list organization feed
- rebuild feed projections for one audience

### `DailyInteractionRepository`

Required responsibilities:

- record interaction idempotently
- list interaction summary for an entry

### `DailyPromotionRepository`

Required responsibilities:

- create promotion record
- look up promotion target by entry

## Data contracts

### `dailyEntries`

**Collection Path**: `/dailyEntries/{entryId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `organizationId` | `string` | yes | owning organization |
| `workspaceId` | `string` | yes | owning workspace |
| `authorId` | `string` | yes | actor who created the entry |
| `entryType` | `DailyEntryType` | yes | feed semantics |
| `status` | `DailyEntryStatus` | yes | lifecycle state |
| `visibility` | `DailyVisibility` | yes | audience rule |
| `title` | `string` | yes | short headline |
| `summary` | `string` | yes | digest-safe summary |
| `body` | `string` | no | extended body |
| `media` | `DailyMedia[]` | no | optional attachments |
| `tags` | `string[]` | no | indexing and filtering |
| `publishedAtISO` | nullable `string` | no | null while draft |
| `expiresAtISO` | nullable `string` | no | required for `story` |
| `sourceModule` | nullable `string` | no | set for system signals |
| `sourceEventId` | nullable `string` | no | set for event-driven projections |
| `createdAtISO` | `string` | yes | creation time |
| `updatedAtISO` | `string` | yes | last mutation time |

### `dailyInteractions`

**Collection Path**: `/dailyInteractions/{interactionId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `entryId` | `string` | yes | target Daily entry |
| `organizationId` | `string` | yes | audience boundary |
| `workspaceId` | nullable `string` | no | optional scope |
| `actorId` | `string` | yes | acting account |
| `interactionType` | `DailyInteractionType` | yes | interaction kind |
| `payload` | nullable `object` | no | reaction emoji, comment reference, etc. |
| `createdAtISO` | `string` | yes | append-only timestamp |

### `dailyFeedProjections`

**Collection Path**: `/dailyFeedProjections/{audienceKey}/items/{entryId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `audienceKey` | `string` | yes | `workspace:{id}` or `organization:{id}` |
| `organizationId` | `string` | yes | audience organization |
| `workspaceId` | `string` | yes | origin workspace |
| `entryId` | `string` | yes | projected source |
| `entryType` | `DailyEntryType` | yes | projected semantics |
| `title` | `string` | yes | display headline |
| `summary` | `string` | yes | display summary |
| `rankScore` | `number` | yes | deterministic ranking score |
| `rankReason` | `string[]` | yes | explainable reason list |
| `interactionSummary` | `object` | yes | unread / acknowledged / bookmarked stats |
| `publishedAtISO` | `string` | yes | publish timestamp |
| `expiresAtISO` | nullable `string` | no | hidden after expiry |

## Query contracts

### Workspace Daily query

Input:

- `workspaceId: string`
- optional future filters: `entryTypes`, `includeArchived`, `cursor`

Output rules:

1. current implementation reads canonical feed rows from `FirebaseDailyFeedRepository`
2. workspace audience currently shows the workspace's own authored entries and filters expired entries
3. interaction summary is not implemented yet and remains future scope

### Organization Daily query

Input:

- `organizationId: string`
- `workspaceIds: string[]`
- optional future filters: `workspaceId`, `entryTypes`, `priority`, `cursor`

Output rules:

1. current implementation reads canonical feed rows from `FirebaseDailyFeedRepository`
2. it only returns entries whose `organizationId` matches and whose `workspaceId` belongs to the provided workspace list
3. current visibility enforcement includes `organization` and `public_demo` entries only
4. current ranking is freshness-only; explainable multi-factor ranking remains future scope
5. every row preserves the origin `workspaceId`

## Command contracts

### `publishDailyEntry`

Required input:

- `organizationId`
- `workspaceId`
- `authorId`
- `entryType`
- `visibility`
- `title`
- `summary`

Expected outcomes:

- validate required fields and supported enum values
- create and publish a canonical `DailyEntry`
- make the entry available through `getWorkspaceDailyFeed()` / `getOrganizationDailyFeed()`
- audit trail / projection rebuild remain future scope

### `acknowledgeDailyEntry`

Required input:

- `entryId`
- `actorId`

Expected outcomes:

- idempotently record acknowledgement
- update feed interaction summary
- never mutate entry content

### `promoteDailyEntry`

Required input:

- `entryId`
- `targetType`
- `actorId`

Expected outcomes:

- create promotion record
- hand off to the target module boundary
- keep source entry traceable

## Ranking contract

Organization Daily ranking must be explainable using deterministic factors. The first version should score on:

1. `urgency` — blocker, overdue, unresolved ask
2. `impact` — affects multiple workspaces or high-priority goals
3. `freshness` — newly published today
4. `engagement` — acknowledged, bookmarked, or escalated by multiple actors
5. `silenceRisk` — workspace expected to update but currently quiet

Every projected organization item must carry `rankReason[]` so the UI can explain why it appears near the top.

## Event contract

### Minimum required events

- `DailyEntryDrafted`
- `DailyEntryPublished`
- `DailyEntryArchived`
- `DailyEntryPromoted`
- `DailyInteractionRecorded`
- `DailyFeedProjected`

### Integration events from other modules

The Daily signal context may consume normalized events such as:

- `ScheduleRequestSubmitted`
- `TaskBlocked`
- `KnowledgeDocumentPublished`
- `InvoiceOverdue`
- `AuditFlagRaised`

These must be normalized into `DailyEntryType = signal` instead of leaking raw module payloads directly into the UI.

## Acceptance gates

Before Daily expands beyond the current authored-entry standard, these gates must be satisfied:

1. canonical write model for `DailyEntry` remains the only standard write surface
2. workspace and organization feeds stay behind an explicit `DailyFeedRepository` boundary, so projection materialization can replace direct scans without UI breakage
3. visibility and organization-boundary rules are enforced
4. ranking reasons are explainable and testable
5. promotion paths to at least one target module are defined
6. current digest compatibility is preserved during migration without reclaiming primary ownership of the surface
