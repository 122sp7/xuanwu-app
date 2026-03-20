# Module Index

**Verified:** 2026-03-20 — 18 modules confirmed under `modules/`

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

### knowledge (EXISTS as modules/knowledge)
- **LIVE** at `modules/knowledge/` — do NOT use core/knowledge-core for workspace UI
- `interfaces/components/WorkspaceKnowledgeTab.tsx` — read-side summary + RAG document list
- `interfaces/queries/knowledge.queries.ts` — `getWorkspaceKnowledgeSummary(workspace)`
- Domain: KnowledgeSummary entity, KnowledgeRepository port, deriveKnowledgeSummary service
- Infrastructure: DefaultWorkspaceKnowledgeRepository (derives summary from file + parser data)
- Mounted in workspace detail screen under "Knowledge" tab

### file (upload + RAG document registration)
- Full upload pipeline: `uploadInitFile` → Firebase Storage → `uploadCompleteFile`
- `RagDocumentRecord` in domain with complete metadata: accountId, sizeBytes, versionGroupId, versionNumber, isLatest, language, accessControl, category, department, tags, statusMessage, chunkCount, indexedAtISO, expiresAtISO
- `FirebaseRagDocumentRepository`: `findByStoragePath()`, `findByWorkspace()`, `saveUploaded()`
- Firestore path: `/knowledge_base/{orgId}/workspaces/{wsId}/documents/{documentId}`
- `getWorkspaceRagDocuments(workspace)` query exported from file module interfaces

### knowledge / retrieval / taxonomy
- `modules/knowledge` EXISTS — see knowledge section above
- `core/knowledge-core` exists separately (MDDD — Knowledge entity, Upstash Redis + Vector infra)
- `retrieval` and `taxonomy` as separate top-level modules do NOT exist

## core/ Modules (separate from modules/)

| Core | Status | Notes |
|------|--------|-------|
| event-core | Complete | MDDD — DomainEvent, IEventStore, IEventBus, PublishDomainEvent use-case |
| knowledge-core | Complete | MDDD — Knowledge entity, 6 VOs, Upstash Redis + Vector infra adapters |
| namespace-core | Scaffolded only | All subdirs are .gitkeep placeholders |
