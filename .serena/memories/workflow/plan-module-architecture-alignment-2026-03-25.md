## Phase: plan
## Task: modules architecture alignment to target xuanwu architecture
## Date: 2026-03-25

### Scope
- Align runtime module map with modules/xuanwu_architecture.mermaid and modules/Architecture.md.
- Target stable modules: content, knowledge-graph, knowledge, retrieval, agent, asset.
- Transitional modules to retire after extraction: file, ai, graph, search, interfaces.

### Current verified state
- modules/asset already exists with a near-complete copy of former file module responsibilities.
- modules/file is now a transitional bridge and should not gain new business logic.
- modules/knowledge-graph exists and is wired from modules/system.
- modules/knowledge currently acts as a compatibility bridge and must be repurposed to Layer 2 ingestion.
- modules/retrieval exists only as thin surface/port ownership and is not yet the real RAG query owner.
- modules/agent is effectively empty and not yet the orchestration owner.
- modules/ai still contains both retrieval-side and generation/orchestration-side logic, so it must be split rather than renamed wholesale.
- docs/development-contracts still reference modules/file and modules/ai as primary owners, so contract docs lag current direction.

### Architectural interpretation
- Layer 1: content owns Notion-like content/page/block workflows.
- Layer 1: knowledge-graph owns wiki links, relations, graph projections, graph view config.
- Layer 2: knowledge should own parse/clean/classify/chunk/embed/persist/status lifecycle for ingestion.
- Layer 3: retrieval should own query understanding, hybrid retrieval, rerank, citation, grounding, retrieval summaries, and retrieval-facing ports.
- Layer 4: agent should own tool orchestration, ReAct-style flow, thread/message interaction contracts, and API-level tool dispatch.
- asset should own source-file upload lifecycle, versions, permissions, retention, and document registration handoff into ingestion.

### Recommended execution phases
1. Boundary freeze
- Declare content, knowledge-graph, knowledge, retrieval, agent, asset as the canonical target module map.
- Declare file, ai, graph, search, interfaces as transitional only.
- Stop adding new business logic to all transitional modules.

2. Low-risk shell cleanup
- Finish removing real consumers of graph, search, and interfaces.
- Keep them only as deprecated bridges until no imports remain.
- Exit when all functional ownership is through knowledge-graph/api, retrieval/api, or app-local actions.

3. Complete file -> asset cutover
- Make asset the sole public boundary for workspace file/asset UI, queries, actions, repositories, and DTOs.
- Reduce file to deprecated bridge-only exports.
- Exit when no runtime feature depends on file internals.

4. Rebuild knowledge as real ingestion owner
- Move ingestion responsibilities out of legacy mixed locations into knowledge.
- knowledge should own document readiness, ingestion jobs, chunk lifecycle, embeddings metadata, and indexing status machine.
- asset remains the owner of upload/source-file lifecycle only.

5. Extract retrieval from ai
- Move AnswerRagQuery use case, retrieval repositories, retrieval summaries, citation/grounding contracts, and vector search ownership into retrieval.
- retrieval becomes the only RAG query boundary used by future callers.

6. Extract agent from ai
- Move generation/orchestration responsibilities, tool dispatch, and conversational interaction contracts into agent.
- agent must depend on retrieval/api instead of embedding retrieval logic internally.

7. Contract and documentation sync
- Update development-contract docs, module plans, and architecture-facing references from file/ai wording to asset/knowledge/retrieval/agent wording.
- Do this after code cutover is stable but before final deletion of transitional modules.

8. Final retirement
- Delete file, ai, graph, search, interfaces after imports and docs are fully migrated.
- Keep only backward-compatibility windows if explicitly needed.

### Critical sequencing rationale
- asset must be stabilized before rebuilding knowledge, because source document upload and registration are the upstream boundary for ingestion.
- knowledge must be rebuilt before retrieval is finalized, because retrieval depends on stable chunk/index ownership.
- retrieval should be extracted before agent, because agent should consume retrieval/api rather than own retrieval internals.
- documentation updates should land before final deletion to avoid a contract/code mismatch.

### Concrete hotspots already identified
- modules/ai/application/use-cases/answer-rag-query.use-case.ts belongs conceptually to retrieval.
- modules/ai/application/use-cases/generate-ai-response.use-case.ts belongs conceptually to agent.
- modules/ai/interfaces/_actions/ai.actions.ts will likely split into retrieval-facing and agent-facing actions or move to app routes.
- docs/development-reference/reference/development-contracts/overview.md still names modules/file + modules/ai + py_fn as RAG owners.
- docs/development-reference/reference/development-contracts/rag-ingestion-contract.md and parser-contract.md still reference file/ai boundaries.

### Validation / Evidence
- project structure confirms asset is populated while agent remains almost empty.
- current code confirms knowledge-graph is active and knowledge is in compatibility mode.
- current code confirms ai still mixes retrieval and generation concerns.
- current docs confirm contract drift against the intended target architecture.
- phase1 implementation completed: graph/search/interfaces are bridge-only surfaces, asset/workspace imports were tightened to api barrels, and workspace detail UI now consumes asset/workspace-audit/wiki-beta/workspace-scheduling through api boundaries.
- phase1 validation passed with targeted ESLint clean and full `npm run build` success on 2026-03-25.
- code search found no active runtime imports of `@/modules/file`; remaining references are documentation-heavy and can be handled in later contract/doc sync.

### Risks
- Renaming docs before code ownership is real will create false architecture claims.
- Deleting ai too early will strand both retrieval and orchestration entrypoints.
- Leaving file internals alive too long will keep duplicate ownership and encourage accidental new imports.

### Implementation progress
- Completed phase1 boundary cleanup on 2026-03-25.
- Completed phase2 file-retirement increment on 2026-03-25: `modules/file` internal `application/domain/infrastructure/interfaces` directories were removed, leaving bridge-only exports through `modules/file/api` and `modules/file/index.ts`.
- Validation for phase2 increment passed: targeted ESLint clean and full `npm run build` success.
- Completed phase3 bootstrap increment on 2026-03-25 for `modules/knowledge` Layer 2 ownership:
  - added ingestion domain entities (`IngestionDocument`, `IngestionChunk`, `IngestionJob`) and status transition rules,
  - added ingestion repository contract and in-memory implementation,
  - added application use-cases (`register-ingestion-document`, `advance-ingestion-stage`),
  - added `KnowledgeIngestionApi` and exported it via `modules/knowledge/api/index.ts` while preserving temporary knowledge-graph compatibility bridge exports.
- Validation for phase3 bootstrap increment passed: `npx eslint modules/knowledge` clean and full `npm run build` success.
- Completed phase3 integration increment on 2026-03-25:
  - wired `modules/asset/interfaces/_actions/file.actions.ts` `uploadCompleteFile` to call `KnowledgeIngestionApi.registerDocument` as a best-effort handoff,
  - kept upload completion behavior non-blocking even when ingestion registration fails,
  - added development-time warning logs for failed ingestion registration attempts.
- Validation for phase3 integration increment passed: full `npm run build` success after integration.
- Next recommended implementation step: replace bootstrap placeholder metadata (`title`/`mimeType`) in ingestion handoff with canonical values from asset/file repository read model, then begin extraction of retrieval responsibilities from `modules/ai` into `modules/retrieval`.

### Open Questions
- Decide whether thread/message/session contracts live entirely in agent or are split between retrieval session memory and agent conversation orchestration.
- Decide whether document registry ownership stays under asset or moves partially into knowledge once ingestion is formalized.
- Decide whether any public compatibility bridges are needed for more than one release window.