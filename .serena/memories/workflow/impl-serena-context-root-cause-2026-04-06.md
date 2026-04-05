## Phase: impl
## Task: Diagnose Serena context root cause
## Date: 2026-04-06

### Scope
- Investigate Serena activation failure and context drift.
- Repair workspace-level and Serena-project-level causes.

### Decisions / Findings
- `.serena/project.yml` contained mutually exclusive tool-set fields enabled together.
- `.vscode/mcp.json` Serena command had drifted from repo bootstrap guidance.
- `llms.txt` had stale docs and agent routing.
- The combined effect caused unstable Serena activation and stale broad-context lookup.

### Validation / Evidence
- Read and corrected `.serena/project.yml` using Serena tooling.
- Updated `.vscode/mcp.json` and `llms.txt` with no editor errors.

### Deviations / Risks
- Existing sessions may still need a Serena/MCP restart to pick up corrected startup config cleanly.

### Open Questions
- none
