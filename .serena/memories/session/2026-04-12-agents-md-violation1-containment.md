Scope: Containment work for AGENTS violation #1 (notebooklm ai ownership conflict).

Decisions/Findings:
- Used xuanwu-app-skill indexed project structure and files map to confirm ai subdomain footprint and coupling.
- Updated notebooklm local instruction guardrails to mark ai as legacy transition-only and ban new dependencies.
- Added eslint guardrail to warn against new imports from notebooklm/subdomains/ai in non-ai notebooklm surfaces.
- Reduced root API coupling by removing unused ai type re-exports from modules/notebooklm/api/index.ts, while keeping RagQueryView export for UI compatibility.

Validation/Evidence:
- npm run lint completed with 0 errors.
- Edited files show no diagnostics via get_errors.

Deviations/Risks:
- Full physical removal of ai subdomain is not complete; RagQueryView currently still comes from ai/api.
- Complete migration still requires moving the remaining UI/use-case surface to tier-2 subdomains or platform AI boundary.

Open Questions:
- Next execution slice: migrate RagQueryView and answer-query use case to synthesis/retrieval composition, then delete ai/api export.