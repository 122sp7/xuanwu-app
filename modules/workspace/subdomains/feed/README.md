
# Workspace Feed Subdomain

## Overview

The **Feed** subdomain handles activity aggregation and timeline presentation within a workspace. It publishes and organizes domain events from across the workspace into a chronological feed that provides visibility into resource changes, member activities, and collaborative actions.

## Responsibilities

- **Activity Aggregation**: Collect and normalize domain events from workspace operations into feed entries
- **Timeline Management**: Maintain chronological ordering and pagination of feed entries
- **Event Enrichment**: Augment raw domain events with context (actor details, resource snapshots, impact summary)
- **Feed Filtering & Querying**: Support filtering by event type, actor, resource, or date range
- **Feed Visibility**: Enforce workspace-scoped and permission-based access to feed contents

## Core Entities & Value Objects

### Feed Entry

Represents a single activity record in the workspace feed.

- **FeedEntryId** (value object): Unique identifier
- **WorkspaceId** (value object): Scope boundary
- **EventType** (value object): `workspace.member-joined`, `workspace.member-removed`, `knowledge.page-created`, etc.
- **ActorId** (value object): Identity of the member performing the action
- **ResourceType** (value object): Type of affected resource (`Workspace`, `KnowledgePage`, `Member`, etc.)
- **ResourceId** (value object): Affected resource identifier
- **OccurredAt** (value object): Timestamp in ISO 8601 format
- **Payload** (value object): Event-specific metadata
- **Visibility** (value object): Access level (`public`, `members-only`, `actor-only`)

### Feed Query

Represents a request for feed entries with filters.

- **WorkspaceId** (value object): Required scope
- **Limit** (value object): Page size (default 20, max 100)
- **Offset** (value object): Pagination cursor
- **FilterByEventType** (value object, optional): Single event type or list
- **FilterByActorId** (value object, optional): Activity by specific member
- **FilterByResourceType** (value object, optional): Changes to specific resource type
- **SinceOccurredAt** (value object, optional): Include entries after this timestamp

## Aggregates

### WorkspaceFeed (Root)

- **WorkspaceId**: Immutable reference to the workspace
- **FeedEntries**: List of feed entries (read-only, append-only)
- **LastUpdatedAt**: Timestamp of the most recent entry
- **CurrentSize**: Total number of entries in the feed

**Invariants:**
- All entries belong to the same workspace
- Entries are immutable once persisted
- Entries are ordered by `OccurredAt` descending
- Duplicate events are not stored

## Domain Events

| Event Name | When | Payload |
|---|---|---|
| `feed.entry-created` | Feed entry is recorded from a domain event | `feedEntryId`, `workspaceId`, `eventType`, `actorId`, `resourceId` |
| `feed.enriched` | Entry is enhanced with actor/resource context (async) | `feedEntryId`, `actorName`, `resourceSnapshot` |
| `feed.visibility-changed` | Entry visibility level is updated | `feedEntryId`, `oldVisibility`, `newVisibility` |

## Use Cases

### Create Feed Entry

**Trigger:** Domain event from any workspace subdomain (e.g., `knowledge.page-created`)

**Process:**
1. Receive domain event from event bus
2. Normalize to `FeedEntry` with eventType, actorId, resourceId
3. Set `Visibility` based on event type and workspace policy
4. Persist to feed store
5. Publish `feed.entry-created`

**Example:**
```
Input:  { type: "knowledge.page-created", pageId, createdBy, title }
Output: FeedEntry {
    feedEntryId: "feed_abc123",
    eventType: "knowledge.page-created",
    resourceType: "KnowledgePage",
    resourceId: "page_xyz",
    actorId: "member_creator",
    payload: { title: "...", contentPreview: "..." }
}
```

### Query Feed

**Trigger:** Member requests workspace activity feed (UI list view)

**Process:**
1. Validate workspace membership and feed access
2. Apply filters (eventType, actorId, dateRange)
3. Order by `OccurredAt` descending
4. Paginate using limit/offset
5. Enrich entries with actor names and resource snapshots
6. Return paginated result

**Example Query:**
```
input: {
    workspaceId: "workspace_123",
    limit: 20,
    offset: 0,
    filterByEventType: "knowledge.page-created",
    filterByActorId: "member_abc"
}
output: [
    {
        feedEntryId: "feed_1",
        eventType: "knowledge.page-created",
        actorName: "Alice",
        resourceType: "KnowledgePage",
        resourceTitle: "Meeting Notes",
        occurredAt: "2025-03-15T10:30:00Z"
    }
]
```

### Enrich Feed Entry (Async)

**Trigger:** `feed.entry-created` event

**Process:**
1. Fetch actor profile (via `@/modules/platform/api`)
2. Fetch resource snapshot based on resourceType
3. Generate human-readable summary
4. Update feed entry with enrichment context
5. Publish `feed.enriched`

## Repository Interfaces

### IFeedRepository

```typescript
interface IFeedRepository {
    saveFeedEntry(entry: FeedEntry): Promise<void>;
    queryFeedEntries(query: FeedQuery): Promise<FeedEntry[]>;
    findFeedEntryById(feedEntryId: FeedEntryId): Promise<FeedEntry | null>;
    countFeedEntries(workspaceId: WorkspaceId): Promise<number>;
    deleteFeedEntriesOlderThan(date: Date): Promise<number>;
}
```

## Cross-Module Dependencies

### Inbound (Consumed Events)

- `workspace.*` — Member joins, leaves, settings change
- `knowledge.*` — Page created, modified, deleted, shared
- `notebooklm.conversation.*` — Thread created, message added
- Any workspace subdomain event (via event bus)

### Outbound (Published Events)

- `feed.entry-created` → Event bus for enrichment
- `feed.enriched` → Triggers cache invalidation in UI

### API Dependencies

| Target Module | Purpose | Boundary |
|---|---|---|
| `@/modules/platform/api` | Fetch actor profile, member details | `getMemberDetails(memberId)` |
| `@/modules/workspace/api` | Workspace context (workspace name, members) | `getWorkspaceById(workspaceId)` |
| Any resource module | Fetch resource snapshot | Module-specific API |

## Constraints & Policies

1. **Retention**: Feed entries older than 90 days may be archived (configurable per workspace plan)
2. **Privacy**: Only workspace members can view feed; entries respect resource-level permissions
3. **Event Normalization**: Non-critical events (e.g., member edits) may be batched or sampled
4. **Performance**: Feed queries must complete within 500ms; requires indexing on `workspaceId`, `occurredAt`

## File Structure

```
modules/workspace/subdomains/feed/
├── domain/
│   ├── entities/
│   │   ├── FeedEntry.ts
│   │   └── WorkspaceFeed.ts
│   ├── repositories/
│   │   └── IFeedRepository.ts
│   ├── services/
│   │   └── FeedNormalizer.ts
│   └── value-objects/
│       ├── FeedEntryId.ts
│       ├── FeedQuery.ts
│       └── EventType.ts
├── application/
│   └── use-cases/
│       ├── create-feed-entry.use-case.ts
│       ├── query-feed.use-case.ts
│       └── enrich-feed-entry.use-case.ts
├── infrastructure/
│   ├── firebase/
│   │   └── FirebaseFeedRepository.ts
│   └── memory/
│       └── InMemoryFeedRepository.ts
└── interfaces/
        ├── components/
        │   └── FeedList.tsx
        ├── _actions/
        │   └── get-workspace-feed.action.ts
        └── hooks/
                └── useFeed.ts
```
