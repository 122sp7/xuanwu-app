## Phase: impl
## Task: source upload post-process draft knowledge page
## Date: 2026-04-07

### Scope
- Extended workspace file post-upload dialog to support optional Draft Knowledge Page creation.
- Kept source -> knowledge collaboration API-only through modules/knowledge/api.
- Reduced FileProcessingDialog.tsx below ESLint max-lines limit via presentational extraction.

### Decisions / Findings
- parse_document now already supports doc_id override and run_rag=false for manual user-consent flows.
- Draft page creation is implemented in source dialog utils by calling createKnowledgePage + addKnowledgeBlock through the knowledge public API, then linking users to the created page.
- Parsed text is loaded from json_gcs_uri in Firebase Storage to seed the first draft block with source metadata and excerpt text.

### Validation / Evidence
- npm run lint: pass
- npm run build: pass
- No repo PDF/image fixture was available for a safe in-repo Playwright upload verification pass, so this phase has static/build validation only.

### Deviations / Risks
- Draft page strategy is intentionally single-page bootstrap; section splitting / multi-page decomposition is deferred.
- Full end-to-end browser verification still depends on a real supported upload file and authenticated workspace flow.

### Open Questions
- Whether to evolve the draft builder into section-aware page/block generation after parse quality is reviewed.
