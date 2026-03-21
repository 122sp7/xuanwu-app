# Module: knowledge

## Description

The **knowledge** module represents the organizational knowledge management capability. It encompasses wiki pages, documents, RAG (Retrieval-Augmented Generation) search, embedding-based semantic retrieval, and knowledge taxonomy classification.

## Responsibilities

- Define the wiki page and knowledge document entity lifecycle
- Support RAG-based semantic search over workspace knowledge
- Manage knowledge taxonomy and document scoping (org/workspace)
- Provide embedding and vector similarity search capabilities

## Related Packages

| Package | Role |
|---------|------|
| `modules/wiki` | Full implementation: wiki pages, RAG, knowledge docs (canonical) |

## Input / Output

### Commands (write side)
```
CreateWikiPageInput     → CommandResult { aggregateId: pageId }
UpdateWikiPageInput     → CommandResult { aggregateId: pageId }
ArchiveWikiPageInput    → CommandResult { aggregateId: pageId }
```

### Queries (read side)
```
getRAGAnswer(query, workspaceId)          → RAGQueryResult
searchWikiDocuments(query, workspaceId)   → WikiDocument[]
getWorkspaceKnowledgeSummary(workspaceId) → WorkspaceKnowledgeSummary
```

## Used By

- `app/(shell)/wiki` — wiki hub page
- `modules/workspace` — WorkspaceWikiTab component
- `modules/file` — RAG document ingestion pipeline

## Notes

- The **canonical implementation** lives in `modules/wiki` (includes all domain, application, infrastructure, and interface layers)
- Firebase adapter: `DefaultWorkspaceKnowledgeRepository`
- Vector search: Upstash Vector via `@integration-upstash`
- This module definition covers the broader knowledge domain; `modules/wiki` is its primary implementation
