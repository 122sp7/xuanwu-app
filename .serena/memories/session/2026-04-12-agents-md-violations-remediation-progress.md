Scope: Started active remediation for AGENTS.md violations.

Decisions/Findings:
- Fixed violation #2 in notebooklm source gateway by removing cross-domain dependency from infrastructure layer.
- Introduced constructor dependency injection in NotionKnowledgePageGatewayAdapter so infrastructure no longer imports notion API directly.
- Moved notion API binding (createKnowledgePage/addKnowledgeBlock) to source/api/factories.ts, which is boundary-allowed.
- Added published-language token normalization helper in adapter to keep cross-context semantics explicit.

Validation/Evidence:
- eslint run completed with 0 errors; modified files produced no lint violations.
- get_errors confirms no diagnostics in NotionKnowledgePageGatewayAdapter.ts.

Deviations/Risks:
- Violation #1 (modules/notebooklm/subdomains/ai ownership conflict) remains and requires phased migration.
- Repo still contains broader strategic debt (e.g. non-platform Firestore usage); not addressed in this focused fix.

Open Questions:
- Whether to execute phase-2 migration for notebooklm/ai in this session (high-impact multi-file change).