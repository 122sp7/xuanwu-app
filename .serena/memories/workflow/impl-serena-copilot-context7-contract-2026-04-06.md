## Phase: impl
## Task: serena-copilot-context7 contract alignment
## Date: 2026-04-06

### Scope
- Elevated Serena-first orchestration, Context7 mandatory lookup, and Serena-only memory/index authority into repo entrypoints.
- Clarified `.claude/` as a supported compatibility surface, not a parallel governance tree.

### Decisions / Findings
- Every conversation must start with Serena MCP.
- Serena owns request framing, context gathering, and subagent delegation.
- Any library/framework/config uncertainty below 99.99% requires Context7 before generating or recommending code.
- Project memory and index updates are authoritative only when performed through Serena tools.
- `.github/*` remains the primary Copilot governance surface; `.claude/` is compatibility-only.

### Validation / Evidence
- Aligned `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`, and `.github/skills/serena-mcp/SKILL.md`.
- Verified the same contract language appears in all primary entrypoints.

### Deviations / Risks
- Copilot has no deterministic session-start hook, so enforcement is instruction-driven rather than hard-blocked.

### Open Questions
- None.