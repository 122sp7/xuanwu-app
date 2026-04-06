## Phase: research
## Task: audit .claude deprecation viability
## Date: 2026-04-06

### Scope
- Audited repo for active dependencies on `.claude/` and `CLAUDE.md`.
- Distinguished Claude Code tooling/docs/bootstrap dependencies from app/runtime/build dependencies.

### Decisions / Findings
- No `.claude` or `CLAUDE.md` references were found under `app/`, `modules/`, `packages/`, or `py_fn/`.
- `.claude/settings.json` actively wires Claude Code lifecycle hooks and project MCP enablement.
- `.claude/hooks/skill-activation-prompt.sh` -> `skill-activation-prompt.ts` -> `.claude/skills/skill-rules.json` is an active chain for Claude prompt-time skill suggestion.
- `scripts/init-framework.sh`, root `README.md`, `docs/getting-started.md`, `docs/customization.md`, `docs/hooks.md`, `docs/skills.md`, and `docs/handoffs.md` still treat `.claude` as installed framework surface.
- `.github/copilot-instructions.md` and `CONTRIBUTING.md` still reference root `CLAUDE.md` for cross-agent compatibility.
- Recommended path is archive/heavy reduction with a minimal compatibility shim rather than abrupt deletion.

### Validation / Evidence
- Read `.claude/settings.json`, `.claude/hooks/package.json`, `.claude/hooks/skill-activation-prompt.sh`, `.claude/hooks/skill-activation-prompt.ts`, `.claude/hooks/session-start-loader.sh`, `.claude/hooks/pre-tool-use-validator.sh`, `.claude/skills/skill-rules.json`.
- Read `scripts/init-framework.sh`, `README.md`, `docs/getting-started.md`, `docs/customization.md`, `docs/hooks.md`, `docs/skills.md`, `docs/handoffs.md`, `.github/copilot-instructions.md`, `CLAUDE.md`, `.github/workflows/link-check.yml`, `repomix.config.json`, `.gitignore`.
- Serena pattern search over `app`, `modules`, `packages`, and `py_fn` returned no `.claude` / `CLAUDE.md` matches.

### Deviations / Risks
- Runtime/build removal risk is low, but docs/bootstrap drift risk is medium-high if `.claude` is removed without coordinated cleanup.
- Generated repomix skill snapshots will remain stale until regenerated after doc updates.

### Open Questions
- Whether the team still wants any Claude Code support beyond a thin compatibility layer.
- Whether root `CLAUDE.md` should remain as a lightweight cross-agent compatibility doc even if `.claude/` is archived.