# Module Index

**Verified:** 2026-03-21 — 19 modules confirmed under `modules/`

## Full Module List

| Module | ports/ | AGENT.md | README.md | Notes |
|--------|--------|----------|-----------|-------|
| acceptance | ✗ | ✗ | ✓ | |
| account | ✓ | ✗ | ✗ | |
| ai | ✓ | ✓ | ✓ | Genkit flows |
| audit | ✓ | ✓ | ✗ | |
| billing | ✓ | ✓ | ✓ | See billing-lifecycle skill |
| daily | ✗ | ✗ | ✗ | |
| file | ✗ | ✗ | ✓ | Upload pipeline + RagDocumentRepository |
| finance | ✓ | ✗ | ✗ | |
| identity | ✓ | ✗ | ✗ | |
| issue | ✗ | ✗ | ✗ | |
| knowledge | ✗ | ✗ | ✗ | Read-side summary + workspace knowledge documents UI |
| notification | ✓ | ✗ | ✗ | |
| organization | ✓ | ✗ | ✗ | |
| parser | ✗ | ✗ | ✓ | |
| qa | ✗ | ✗ | ✗ | |
| schedule | ✗ | ✗ | ✓ | MDDD full implementation — see migration/schedule-mddd-progress |
| task | ✗ | ✗ | ✗ | |
| workspace | ✓ | ✗ | ✗ | |

## Standard MDDD Directory Pattern

Each module may contain:
```
modules/<name>/
├── domain/          entities, value-objects, domain-services, ports, events, errors
├── application/     use-cases, services
├── infrastructure/  firebase, adapters
├── interfaces/      components, hooks, queries, _actions
└── ports/           (if present) external port contracts
```

## Key Module Notes

### schedule (active MDDD implementation)
- Full MDDD domain under `domain/mddd/`
- 4 use-cases (run, cancel, reject-assignment, reject-request)
- 6 Firebase MDDD adapters (all implemented)
- Has Projection value-object + ProjectionQueryRepository port
- `domain/mddd/errors.ts` with `SCHEDULE_MDDD_ERROR_CODES`
- See `docs/reference/development-contracts/schedule-contract.md`

### ai
- Genkit-based flows, Genkit 1.30.1
- `ports/` contains domain port contracts

### workspace
- `interfaces/` has: WorkspaceDailyTab, WorkspaceDetailScreen, WorkspaceHubScreen, WorkspaceMembersTab + hooks + queries
- Shell routes: `app/(shell)/workspace/` + `app/(shell)/workspace/[workspaceId]/`

### billing
- Follows billing-lifecycle domain pattern
- `ports/` present

### wiki
- Knowledge and wiki ownership now live under `modules/wiki`
- `modules/wiki/interfaces/queries/knowledge.queries.ts` exports `getWorkspaceKnowledgeSummary(...)`
- `modules/wiki/infrastructure/default/DefaultWorkspaceKnowledgeRepository.ts` provides the default summary adapter
- Mounted into the workspace surface via `modules/workspace/interfaces/components/WorkspaceWikiTab.tsx`

### file (upload + RAG document registration)
- Full upload pipeline: `uploadInitFile` → Firebase Storage → `uploadCompleteFile`
- `RagDocumentRecord` in domain with complete metadata: accountId, sizeBytes, versionGroupId, versionNumber, isLatest, language, accessControl, category, department, tags, statusMessage, chunkCount, indexedAtISO, expiresAtISO
- `FirebaseRagDocumentRepository`: `findByStoragePath()`, `findByWorkspace()`, `saveUploaded()`
- Firestore path: `/knowledge_base/{orgId}/workspaces/{wsId}/documents/{documentId}`
- `getWorkspaceRagDocuments(workspace)` query exported from file module interfaces

### top-level module reality
- `modules/event`, `modules/namespace`, and `modules/wiki` are the active locations for those bounded contexts
- `retrieval` and `taxonomy` are not separate top-level modules on this branch
