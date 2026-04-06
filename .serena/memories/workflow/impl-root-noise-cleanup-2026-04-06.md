## Phase: impl
## Task: root noise cleanup
## Date: 2026-04-06

### Scope
- Removed tracked temporary ESLint snapshot files from repo root.
- Added gitignore coverage for `.tmp-eslint*.json`.
- Deleted local `.playwright-mcp/` runtime artifacts.

### Decisions / Findings
- `.tmp-eslint.json` and `.tmp-eslint-config.json` had no active repo references beyond Serena historical memory, so they were treated as noise.
- `.playwright-mcp/` is gitignored local output and safe to clear.
- Kept `.github`, `.claude`, `.serena`, `.vscode`, `docs`, `diagrams`, `AGENTS.md`, `CLAUDE.md`, and `.beads` because they are part of active governance, tooling, or local workflow state.
- Kept compatibility pointer files under `agents/`, `.agents/`, `.cursor/`, `.opencode/` because they are tiny bridge files for multi-agent/editor compatibility, not dead content.

### Validation / Evidence
- Root compatibility files were inspected and confirmed to point into `.github/*`.
- Git tracked-state audit confirmed `.tmp-eslint*` were tracked; `.playwright-mcp/` was local runtime output.
- Post-cleanup change set limited to `.gitignore` plus deletion of the two tmp files.

### Deviations / Risks
- `.beads/` was not removed because it stores local Beads workflow state and deleting it could discard local issue-tracking data.

### Open Questions
- If the team wants to drop Cursor/OpenCode/generic agent compatibility entirely, a separate coordinated cleanup could remove `agents/`, `.agents/`, `.cursor/`, and `.opencode/` after confirming no consumer still relies on them}.