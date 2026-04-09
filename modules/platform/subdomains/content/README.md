<!-- Purpose: Subdomain scaffold overview for platform 'content'. -->
# Content Subdomain

## Overview

The **content** subdomain manages content asset lifecycle, publishing workflows, and multi-format content delivery within the platform domain.

## Core Responsibilities

- Content classification and metadata management
- Publishing state transitions and visibility rules
- Multi-format rendering and distribution
- Content versioning and archival
- Access control integration with platform policies

## Ubiquitous Language

| Term | Definition |
|---|---|
| Content | Publishable asset with metadata, format, and visibility scope |
| PublishedContent | Content in published state, eligible for discovery and delivery |
| ContentFormat | Structured representation (markdown, html, pdf, etc.) |
| ContentMetadata | Descriptive attributes (title, tags, category, created by, etc.) |
| ContentPublished | Domain event: content transitioned to published state |
| ContentArchived | Domain event: content moved to archived state |

## Architecture

### Domain Layer

**Aggregates:**
- `Content` — root aggregate managing asset lifecycle and state
- `ContentMetadata` — value object grouping descriptive attributes

**Repositories:**
- `IContentRepository` — contract for persisting and querying content

**Domain Services:**
- `ContentPublishingService` — stateless rules for publishing transitions
- `ContentVisibilityService` — visibility rule evaluation

### Application Layer

**Use Cases:**
- `publish-content.use-case.ts` — transition content to published state
- `archive-content.use-case.ts` — move content to archived state
- `list-published-content.use-case.ts` — query published content with filters
- `get-content-metadata.use-case.ts` — retrieve content details

### Infrastructure Layer

**Implementations:**
- `FirebaseContentRepository` — Firestore-backed persistence
- `ContentPublishingAdapter` — publishing event emission

### Interfaces Layer

**Server Actions:**
- `_actions/publish-content.action.ts`
- `_actions/archive-content.action.ts`

**Query Hooks:**
- `queries/use-published-content-list.ts`
- `queries/use-content-metadata.ts`

## Cross-Module Contracts

**Upstream Dependencies:**
- `@/modules/platform/api` — access-control, organization scope
- `@/modules/shared/api` — event publishing

**Downstream Consumers:**
- `@/modules/search/api` — published content indexing
- `@/modules/workspace-feed/api` — content activity tracking

## Validation

Run before merge:

```bash
npm run lint
npm run build
npm run test
```

Ensure all cross-boundary imports use `@/modules/<target>/api`.
