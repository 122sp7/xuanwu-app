Scope: Continue AGENTS violation #1 root-cause remediation with minimal-risk changes.

Decisions/Findings:
- Used xuanwu-app-skill index + workspace grep to confirm remaining root couplings to notebooklm ai subdomain.
- Implemented an Occam-style slice: removed notebooklm root API dependency on ai for RagQueryView without broad migration.
- Moved RagQueryView to notebooklm root interfaces and switched modules/notebooklm/api/index.ts export to root interfaces path.
- Kept createAnswerRagQueryUseCase server export unchanged (still from ai) to avoid introducing new boundary lint warnings through transitional cross-subdomain server re-export.

Validation/Evidence:
- npm run lint completed with 0 errors and 3 warnings (same non-boundary baseline warnings as before).
- No new notebooklm boundary warnings introduced.

Files touched:
- modules/notebooklm/interfaces/components/RagQueryView.tsx (new)
- modules/notebooklm/api/index.ts (RagQueryView export now from root interfaces)
- modules/notebooklm/subdomains/synthesis/api/index.ts (temporary change reverted)
- modules/notebooklm/api/server.ts (temporary change reverted)

Open Questions:
- Next slice should migrate AnswerRagQuery use-case + generation/retrieval adapters from ai into Tier-2 synthesis/retrieval to remove final root server dependency on ai.
