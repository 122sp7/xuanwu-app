# Scope
- Executed centralization slice for AGENTS.md compliance: remove direct Firebase usage from notebooklm source interface layer and remove app shell bypass of platform subdomain internals.

# Decisions
- Added platform dual-layer API primitives:
  - infrastructure: firestoreInfrastructureApi (get/set/query/watchCollection), storageInfrastructureApi, functionsInfrastructureApi, genkitInfrastructureApi.
  - service: authApi, permissionApi, fileApi.
- Introduced source pipeline chain in notebooklm/source:
  - domain port: ISourcePipelinePort
  - application: source-pipeline.use-cases.ts
  - infrastructure adapter: PlatformSourcePipelineAdapter
  - interface actions: source-pipeline.actions.ts
- Refactored source interfaces:
  - FileProcessingDialog.tsx now calls server actions (parseSourceDocument/reindexSourceDocument), no direct functions SDK.
  - useSourceDocumentsSnapshot.ts uses platform firestoreInfrastructureApi.watchCollection, no direct firestore SDK.
- Refactored app/(shell)/_shell imports to platform API boundary only.
- Added lint prevention rule in eslint.config.mjs:
  - downstream interfaces (workspace/notion/notebooklm) cannot import @integration-firebase or firebase/* directly.

# Validation
- get_errors: no compile errors in changed files.
- npm run lint: pass, 0 errors; only pre-existing 3 warnings unrelated to this slice.
- npm run build: pass.
- Global scans after fix:
  - source interfaces direct firebase patterns: no matches.
  - app imports from platform subdomains: no matches.
  - remaining direct @integration-firebase usage exists only under downstream infrastructure layers (34 matches).
- Ran npm run repomix:skill to refresh xuanwu-app-skill references.

# Risks / Remaining Debt
- Remaining architecture debt: downstream infrastructure still directly imports @integration-firebase (notion/workspace/notebooklm infra adapters). Next slices must route these through platform infrastructure APIs.
- eslint boundary plugin reports deprecation warnings (element-types -> dependencies); not addressed in this slice.

# Next Suggested Slice
- Migrate notebooklm synthesis infrastructure adapters to platform infrastructure API (highest impact).
- Then migrate notion database/collaboration/authoring infrastructure adapters.
- Then migrate workspace infrastructure adapters and flip stricter lint for non-platform infrastructure direct firebase imports.