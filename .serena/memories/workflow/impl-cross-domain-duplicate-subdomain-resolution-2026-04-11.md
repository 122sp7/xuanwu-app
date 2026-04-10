Scope:
- Audited cross-main-domain duplicate subdomain names in root docs and docs/contexts/*.
- Updated root strategic docs, four context doc sets, docs/README.md, and .github/copilot-instructions.md.
- Did not rename implementation-oriented modules/*/docs subdomain paths or folders.

Decisions / Findings:
- Exact duplicate generic subdomain names found across main domains: ai, analytics, integration, versioning, workflow.
- User-directed ownership decision accepted: generic ai is owned by platform; notion and notebooklm consume platform.ai as downstream/shared capability users.
- Resolution matrix applied:
  - ai -> platform owns generic ai; notion/notebooklm no longer own ai as subdomain.
  - analytics -> platform keeps analytics; notion renamed to knowledge-analytics.
  - integration -> platform keeps integration; notion renamed to knowledge-integration.
  - versioning -> notion renamed to knowledge-versioning; notebooklm renamed to conversation-versioning.
  - workflow -> platform keeps generic workflow; workspace renamed to workspace-workflow.
- Added root-level duplicate resolution guidance to docs/subdomains.md and naming anti-confusion rules to docs/ubiquitous-language.md.
- Added governance rule: when root docs and modules/*/docs differ on duplicate generic names, root docs win for strategic ownership and cross-domain communication; modules/*/docs are treated as implementation-aligned detail.

Validation / Evidence:
- get_errors returned no errors for all edited root docs, context docs, and .github/copilot-instructions.md.
- grep_search on docs/contexts/**/*.md showed generic ai/analytics/integration/versioning/workflow now remain only in platform context as intended.
- grep_search confirmed new names exist across notion, notebooklm, and workspace context docs.
- grep_search on modules/*/docs showed lingering implementation-era names there; they are now explicitly subordinated by governance rules instead of being strategically authoritative.

Deviations / Risks:
- modules/notion/docs, modules/notebooklm/docs, and modules/workspace/docs still preserve implementation-era names like ai/versioning/workflow. This is intentional for now to avoid misrepresenting current implementation paths such as workflow directories.
- Strategic docs are now the authority for ownership and naming; if implementation folders are later renamed, module docs should be synchronized in a separate migration.

Open Questions:
- Whether to do a follow-up migration that renames implementation-era module doc paths/folder names after corresponding code/module directories are actually renamed.
- Whether to add a dedicated duplicate-resolution ADR summarizing the ownership choices for ai/analytics/integration/versioning/workflow.