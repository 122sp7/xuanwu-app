## Phase: review
## Task: research .claude role
## Date: 2026-04-06

### Scope
- Audited whether `.claude/` is active in development workflow.

### Decisions / Findings
- `.claude/` is active for Claude Code workflow, not for app runtime/build pipeline.
- `README.md`, `docs/getting-started.md`, `docs/hooks.md`, and `scripts/init-framework.sh` all treat `.claude/` as installed framework content and hook runtime.
- `.claude/settings.json` wires lifecycle hooks to `.claude/hooks/*.sh` and enables project MCP servers.
- `.claude/skills/skill-rules.json` is the registry consumed by the skill activation hook.
- `.github/` is the primary Copilot customization surface; repomix-generated `xuanwu-skill` excludes `.claude/**`.
- Search across app/modules/packages/py_fn/build configs found no `.claude/` references.

### Validation / Evidence
- Read `.claude/settings.json`, `.claude/hooks/package.json`, `.claude/hooks/skill-activation-prompt.sh`, `.claude/hooks/pre-tool-use-validator.sh`, `.claude/skills/skill-rules.json`.
- Read `README.md`, `docs/getting-started.md`, `docs/hooks.md`, `.github/README.md`, `.github/copilot-instructions.md`, and `scripts/init-framework.sh`.
- Repo search for `.claude/` in runtime/build config scope returned no matches.

### Deviations / Risks
- If the team no longer uses Claude Code, much of `.claude/` becomes dormant governance/tooling baggage.
- Removing `.claude/` without updating docs/bootstrap scripts would create drift and broken setup instructions.

### Open Questions
- Whether the team wants to retain Claude Code as a supported workflow alongside Copilot.