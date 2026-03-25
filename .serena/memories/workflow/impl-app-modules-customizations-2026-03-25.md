## Phase: impl
## Task: add app/modules-specific .github customizations
## Date: 2026-03-25

### Scope
- Add app-specific and modules-specific custom agents, instructions, prompts, and skills
- Keep app composition API-only against modules
- Add module API-surface, index, interfaces, and infrastructure rules
- Update customization indexes and recursive authoring applyTo patterns

### Decisions / Findings
- Nested instructions, prompts, and skills are fine for this workspace structure
- Current diagnostics did not discover nested custom agents reliably; active app/modules agents were kept at top-level .github/agents/
- Reserved .github/agents/app and .github/agents/modules folders were kept with README notes to document the limitation
- Existing module prompts using lower-case custom agent ids were changed to visible diagnostics-recognized names

### Validation / Evidence
- get_errors returned no errors for .github/agents, .github/instructions, and .github/prompts after the changes
- New prompt references for App Router Composer and Modules API Surface Steward resolve cleanly

### Deviations / Risks
- Could not rerun repomix:skill in this turn because the current tool set did not expose a runnable terminal/task entry for that command
- Existing third-party skill example lint noise under .github/skills/llamaparse/scripts/example.ts was left untouched because it is unrelated to this change

### Open Questions
- Whether to add dedicated prompt/index README files under .github/instructions/app, .github/instructions/modules, .github/prompts/app, and .github/prompts/modules for extra discoverability
