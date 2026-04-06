## Phase: review
## Task: classify root-level AI customization entrypoints for Copilot-first workflow
## Date: 2026-04-06

### Scope
- Read-only audit of root governance/customization surfaces: .github, .claude, .serena, .cursor, .opencode, .agents, agents, .vscode, docs, AGENTS.md, CLAUDE.md, llms.txt, README.md.

### Decisions / Findings
- .github is the canonical Copilot customization surface; .github/README.md and .github/copilot-instructions.md explicitly position Copilot as the active workflow.
- .claude remains an active Claude Code workflow surface, not runtime code; it is a parallel agent framework with hooks, commands, skills, and settings.
- docs/README.md is a stable docs index, but multiple top-level docs pages plus root README.md still describe the repository as a Claude Agentic Framework and point users into .claude workflows.
- root AGENTS.md is the canonical cross-agent repository rule entry; root CLAUDE.md is a Claude compatibility quick reference, not the main governance source.
- llms.txt is intended as AI-first router but repository memory already marks it as drift-prone; use with verification.
- agents/*, .agents/*, .cursor/*, and .opencode/* are indirection shims into .github/*; some are stale because they point to missing .github/rules and .github/hooks targets.
- .vscode/mcp.json is the canonical VS Code MCP config; root .mcp.json is a secondary compatibility config with overlapping server topology.
- .serena is active operational state/tooling because Copilot instructions require Serena every session; it is not a human-facing governance entry.

### Validation / Evidence
- Read .github/README.md, .github/copilot-instructions.md, .github/agents/README.md.
- Read .claude/settings.json, .claude/hooks/skill-activation-prompt.ts, docs/customization.md, docs/hooks.md, docs/skills.md, docs/getting-started.md, docs/handoffs.md, docs/swarm.md, README.md, llms.txt, .vscode/mcp.json, and .mcp.json.
- Verified shim files: agents/agents, agents/instructions, agents/hooks, agents/prompts, agents/rules, agents/skills, .agents/skills, .cursor/rules, .cursor/skills, .opencode/skill.
- Confirmed .cursor/rules and agents/rules point to ../.github/rules, and agents/hooks points to ../.github/hooks, while those .github targets do not exist.

### Deviations / Risks
- No edits were made, so conflicting entrypoints remain in place.
- If Copilot-first consolidation proceeds, docs and bootstrap scripts must be updated together or root-level drift will persist.

### Open Questions
- Whether Claude Code remains a supported workflow or should be demoted to compatibility-only status.
- Whether generic compatibility shims should be preserved only for active consumers, or removed entirely.