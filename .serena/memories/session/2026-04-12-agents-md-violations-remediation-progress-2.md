Scope: Continue AGENTS.md violation remediation with xuanwu-app-skill indexed evidence.

Decisions/Findings:
- Confirmed notebooklm ai subdomain has broad footprint (30+ files and root API exports), so full removal touches multiple Tier-2 subdomains and public barrels.
- Updated modules/notebooklm/notebooklm.instructions.md to mark ai as legacy transition-only and forbid new dependencies on it.
- Added eslint guardrail in eslint.config.mjs to warn on new imports from notebooklm subdomains/ai outside approved migration surfaces.

Validation/Evidence:
- npm run lint completed with 0 errors (existing unrelated warnings remain).
- get_errors shows no new diagnostics in edited files.

Deviations/Risks:
- Full violation #1 (physical ai subdomain removal) remains incomplete and still requires staged migration due cross-file coupling and exported API compatibility.

Open Questions:
- Execute next migration slice now: move ai API type exports from modules/notebooklm/api/index.ts to Tier-2 APIs while preserving UI RagQueryView compatibility.