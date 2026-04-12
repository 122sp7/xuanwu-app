# Scope
- Completed NotebookLM residual infrastructure centralization and app-shell workspace-orchestration consolidation checks.

# Decisions
- NotebookLM now has zero direct @integration-firebase imports in TypeScript files.
- Added/used richer platform Firestore infrastructure contract for migration seams:
  - setMany, update, delete, watchDocument
  - query/queryDocuments/queryCollectionGroup with options
- Added workspace orchestration hook at workspace API boundary:
  - useWorkspaceOrchestrationContext
  - app shell detail routes in knowledge/knowledge-base/knowledge-database/notebook/source consume workspace orchestration hook instead of duplicating platform/workspace context extraction.
- Route strategy decision: keep app/(shell)/knowledge*, knowledge-base, knowledge-database, notebook, source as thin route-entry/shim layer; do not hard-delete now because they preserve stable URLs and route ownership while delegating orchestration to workspace/module APIs.

# Validation
- npm run lint: pass (0 errors, 3 existing warnings unchanged).
- npm run build: pass.
- Global scan (@integration-firebase in workspace/notion/notebooklm): now 23 matches, all in workspace/notion infrastructure.
- NotebookLM-specific scan: 0 matches for @integration-firebase.
- Context7 check (Next.js App Router route groups): route groups are organizational and not URL segments; deleting route entries is not required for orchestration centralization.

# Remaining Debt
- 23 direct @integration-firebase imports remain:
  - workspace infrastructure adapters
  - notion infrastructure adapters

# Next Suggested Slice
- Migrate notion infrastructure adapters (13 files) to platform infrastructure APIs first, then workspace adapters (10 files).
- After migration, add stricter lint rule: non-platform infrastructure must not import @integration-firebase.
