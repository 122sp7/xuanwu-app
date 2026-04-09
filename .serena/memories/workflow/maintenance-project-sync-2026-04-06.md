## Phase: maintenance
## Task: Serena memory and index sync with current project
## Date: 2026-04-06

### Scope
- Read Serena MCP skill and both Xuanwu repomix skills requested by the user.
- Inspect active Serena config, existing Serena memories, current root docs/modules structure, llms routing, MCP configuration, and git working tree state.
- Refresh stale memory facts so future sessions align with the current repository layout.

### Decisions / Findings
- Serena current config already had active project `xuanwu-app`; explicit activate_project call failed due tool-side configuration error, so current config was used as the source of truth.
- Working tree was clean at sync time.
- Current docs root is not README-only; docs/README.md and docs/SOURCE-OF-TRUTH.md are both live entrypoints.
- Current domain boundary references are `modules/subdomains.md` and `modules/bounded-contexts.md`.
- `modules/` currently contains the 18 bounded contexts plus support files at root.
- `.vscode/mcp.json` shows active workspace MCP topology, including Serena, Context7, Playwright MCP, Next DevTools, Chrome DevTools, sequential-thinking, filesystem, shadcn, mongodb, supabase-mcp, markitdown, and mcp-run-python.
- `llms.txt` currently contains route drift to older docs trees and `agents/*` paths that now resolve to `.github/agents/*`; it should not be treated as authoritative without verification.
- Historical wiki-beta terminology is no longer backed by a live modules/wiki-beta directory and should be treated as migration context only.

### Validation / Evidence
- Serena get_current_config confirmed active project `xuanwu-app`.
- get_changed_files returned no staged or unstaged changes.
- list_dir confirmed current docs/, modules/, .github/agents/, and root agents/ structures.
- Read docs/SOURCE-OF-TRUTH.md, docs/README.md, modules/subdomains.md, modules/bounded-contexts.md, llms.txt, and .vscode/mcp.json.
- Verified missing files behind stale llms routes with file_search.

### Deviations / Risks
- Serena activate_project returned a tool-configuration error, but the project was already active; no blocking impact for memory sync.
- This maintenance pass refreshed memory/index metadata only and did not modify repository source files.
- llms routing drift remains a live repo issue until the document itself is updated.

### Open Questions
- none