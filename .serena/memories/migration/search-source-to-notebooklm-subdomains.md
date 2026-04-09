# Migration: modules/search + modules/source → notebooklm subdomains

## Status: COMPLETE ✅

## Scope
- Deleted: `modules/search/`, `modules/source/`
- Replaced by: `modules/notebooklm/subdomains/ai/{grounding,synthesis,qa}` and `modules/notebooklm/subdomains/source`

## Public API
- Client: `@/modules/notebooklm/api` (index.ts)
- Server: `@/modules/notebooklm/api/server` (server.ts, exports `createAnswerRagQueryUseCase`)

## Key files per subdomain
- `grounding/`: vector hit + search hit domain entity + Firebase grounding adapter
- `synthesis/`: generation entity + Genkit synthesis service + Firebase adapter
- `qa/`: `AnswerRagQueryUseCase`, `RagQueryView`, domain + dto types, Firestore + vector query adapters
- `source/`: source file upload/delete/rename actions, `RegisterUploadedRagDocumentUseCase`, Firebase adapter, wiki library CRUD, `LibrariesView`, `LibraryTableView`

## TypeScript validation
- All cross-subdomain import paths verified (3-level depth from qa/ to grounding/)
- `SourceFileCommandResult` uses `ok: true/false` pattern (not `CommandResult` from @shared-types)
- `RegisterUploadedRagDocumentResult` has own `commandId` field
- `RagQueryView` citations state typed as `readonly WikiCitation[]`
- `tsc --noEmit` exits 0 (clean)

## Consumers updated
- `app/(shell)/notebook/rag-query/page.tsx`
- `app/(shell)/source/libraries/page.tsx`
- `app/(shell)/source/documents/page.tsx`
- `modules/workspace/interfaces/web/components/screens/WorkspaceDetailScreen.tsx`
- `modules/notebooklm/interfaces/_actions/notebook.actions.ts` (relative imports to qa subdomain)
