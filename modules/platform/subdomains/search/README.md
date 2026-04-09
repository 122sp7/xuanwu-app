<!-- Purpose: Subdomain scaffold overview for platform 'search'. -->

## Search

**Subdomain:** `platform.search`  
**Classification:** Generic Subdomain  
**Owner:** Platform  

### Purpose

Cross-domain search routing and execution. Enables unified search across knowledge content, notebooks, and platform assets with consistent query semantics and result aggregation.

### Core Responsibilities

- **Search Query Routing** — Route queries to appropriate domain handlers (knowledge, notebooklm, etc.)
- **Result Aggregation** — Combine and rank results from multiple sources
- **Search Index Management** — Maintain and sync searchable indexes
- **Query Semantics** — Define and enforce search grammar and filters
- **Performance & Pagination** — Handle large result sets efficiently

### Key Aggregates

- `SearchQuery` — Immutable query representation with filters and scope
- `SearchResult` — Ranked result item with source context and relevance score
- `SearchIndex` — Searchable artifact registry across domains

### Domain Events

- `SearchQueryExecuted` — Query processed and results returned
- `SearchIndexSynced` — Index updated with new or modified content

### Cross-Context Dependencies

- **Upstream** (suppliers): `notion.knowledge`, `notebooklm.conversation` — Content sources
- **Downstream** (customers): `workspace` — Search-scoped workspace context

### Key Entry Points

- `/api` — Public search facade and contracts
- `application/use-cases/execute-search.use-case.ts` — Primary search orchestration

### Known Constraints

- Search index eventual consistency may lag content updates
- Cross-domain result ranking requires domain-specific relevance signals
