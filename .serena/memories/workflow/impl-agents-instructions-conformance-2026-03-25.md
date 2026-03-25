## Phase: impl
## Task: agents+instructions conformance and stale cleanup check
## Date: 2026-03-25

### Scope
- Audited .github/agents/*.md frontmatter keys and body references.
- Audited .github/instructions/*.instructions.md frontmatter keys.
- Searched .github/** and docs/** for stale markers (modules/file, deploy:functions:python, workspace-planner, infer:, .chatmode.md).

### Decisions / Findings
- No schema-breaking diagnostics in .github/agents or .github/instructions.
- All instruction files contain frontmatter with description/applyTo.
- Agent files include supported custom-agent keys (name/description/tools/model/target/handoffs/user-invocable/disable-model-invocation where applicable).
- Remaining stale hits are in generated repomix snapshot files under .github/skills/xuanwu-app-skill/references/, not active source docs.

### Validation / Evidence
- get_errors on .github/agents and .github/instructions: no errors.
- frontmatter audit scripts returned expected keys.
- grep sweeps across .github/** and docs/** found no actionable stale strings outside generated references.

### Deviations / Risks
- No code/doc edits required in this phase.
- Generated references may still contain historical snapshots by design.

### Open Questions
- Whether to refresh/trim generated repomix references to reduce stale historical text visibility.