# Scope
- Completed synthesis infrastructure centralization slice by removing direct Firebase wrapper imports from notebooklm synthesis adapters.

# Decisions
- Extended platform firestore infrastructure API contracts:
  - Added query options (orderBy, limit).
  - Added queryDocuments(collectionPath) returning id+data.
  - Added queryCollectionGroup(collectionId) returning id+data.
- Refactored notebooklm synthesis adapters to consume platform APIs only:
  - FirebaseRagRetrievalAdapter -> firestoreInfrastructureApi.queryCollectionGroup
  - FirebaseRagQueryFeedbackAdapter -> firestoreInfrastructureApi.set/query
  - FirebaseKnowledgeContentAdapter -> functionsInfrastructureApi.call + firestoreInfrastructureApi.queryDocuments

# Validation
- Type diagnostics for all changed files: no errors.
- npm run lint: pass (0 errors, 3 pre-existing warnings).
- npm run build: pass.
- Global scan (@integration-firebase in workspace/notion/notebooklm): reduced from 34 matches to 30 matches.

# Remaining Debt
- 30 direct @integration-firebase imports remain, concentrated in:
  - workspace infrastructure adapters
  - notion infrastructure adapters
  - notebooklm source/conversation infrastructure adapters

# Next Suggested Slice
- Migrate notebooklm source infrastructure adapters (6 files) and conversation thread repository (1 file) to platform infrastructure APIs next for fastest reduction in remaining matches.