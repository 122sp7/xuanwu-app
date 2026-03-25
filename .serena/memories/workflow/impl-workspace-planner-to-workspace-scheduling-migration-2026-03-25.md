## Phase: impl
## Task: migrate-workspace-planner-to-workspace-scheduling
## Date: 2026-03-25

### Scope
- Migrated module directory from modules/workspace-planner to modules/workspace-scheduling.
- Renamed UI symbols to scheduling naming (WorkspaceSchedulingTab, AccountSchedulingView).
- Updated consumer imports in organization schedule page and workspace detail screen.

### Decisions / Findings
- Used git mv for folder and file renames to preserve history.
- Avoided broad text replacement after encoding corruption risk; used targeted edits only.

### Validation / Evidence
- Build succeeded (next build).
- No diagnostics on changed files via get_errors.

### Deviations / Risks
- none

### Open Questions
- none
