## Phase: impl
## Task: prompts-conformance-and-stale-cleanup
## Date: 2026-03-25

### Scope
- Standardized `.github/prompts` metadata to align with VS Code prompt-file docs.
- Ensured markdown optimization prompts are invocable and routed via `md-writer` agent.
- Cleaned stale prompt index entries in `.github/prompts/README.md`.

### Decisions / Findings
- `markitdown-md-optimization.prompt.md` had no frontmatter; added `name/description/agent/argument-hint`.
- `md-*` prompts used `mode` only and lacked `name`; added `name/agent/argument-hint` for slash usability.
- `tools: ['serena/*', 'context7/*', markitdown, filesystem]` caused validation errors (`unknown tool`), so tools were removed and routing relies on `agent: md-writer`.
- Prompt index README had stale `/update-customizations` entry and outdated total count.

### Validation / Evidence
- Re-audited all prompt files: all now include valid frontmatter and key coverage.
- `get_errors` reports clean for all edited prompt files and `.github/prompts/README.md`.
- Confirmed no stale `update-customizations.md` entry remains under `.github/prompts/**`.

### Deviations / Risks
- Did not bulk-edit unrelated `.github/skills/xuanwu-app-skill/references/*` generated snapshots in this pass.

### Open Questions
- None.