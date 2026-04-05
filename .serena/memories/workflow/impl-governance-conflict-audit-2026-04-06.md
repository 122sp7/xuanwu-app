## Phase: impl
## Task: governance conflict audit and drift root-cause remediation
## Date: 2026-04-06

### Scope
- Audit root-level agent/configuration/documentation governance surfaces.
- Distinguish static lint results from semantic governance conflicts.
- Repair root-cause drift sources for MCP and Serena startup.

### Decisions / Findings
- `npm run lint` is not a valid proof of governance consistency; it reported warnings only and no syntax/blocking errors in the core governance docs.
- Real conflict class is governance overlap plus broken indirection, not lint failures.
- `.cursor/rules` points to `../.github/rules`, but `.github/rules` does not exist.
- Root `agents/*` and `.agents/skills` are indirection shims into `.github/*`; these are overlap surfaces and can drift silently.
- `.claude/*`, `.github/*`, root `AGENTS.md`, root `CLAUDE.md`, `llms.txt`, `.serena/*`, `.vscode/mcp.json`, and root `.mcp.json` are concurrent governance/config sources; they are not all conflicting, but they are not a single-source-of-truth system.
- Drift root causes already remediated in code/config: `scripts/init-framework.sh`, `.claude/hooks/pre-tool-use-validator.sh`, `.serena/project.yml`, `.mcp.json`, `.vscode/mcp.json`, and repomix skill snapshots.

### Validation / Evidence
- `npm run lint` completed with warnings, not errors.
- `get_errors` on AGENTS.md, README.md, CLAUDE.md, llms.txt, and .github/copilot-instructions.md returned no editor errors.
- Filesystem checks confirmed `.github/rules` is missing while `.cursor/rules` and `agents/rules` still redirect there.

### Deviations / Risks
- Governance indirection remains in place for compatibility; it still increases future drift risk until consolidated.
- `.mcp.json` and `.vscode/mcp.json` now align in intent, but dual-file topology remains a deliberate compatibility burden.

### Open Questions
- Whether to remove legacy indirection layers (`agents/*`, `.agents/*`, `.cursor/*`, `.opencode/*`) and define one canonical governance surface per toolchain.
