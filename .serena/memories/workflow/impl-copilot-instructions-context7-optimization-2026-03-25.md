## Phase: impl
## Task: optimize workspace copilot-instructions with Context7 guidance
## Date: 2026-03-25

### Scope
- Rewrote .github/copilot-instructions.md as a concise workspace-wide instruction layer.
- Preserved repo-specific authority chain, architecture guardrails, Serena requirements, validation rules, and routing guidance.
- Strengthened terminology normalization by referencing .github/terminology-glossary.md.

### Decisions / Findings
- Context7 guidance for VS Code custom instructions favors short, self-contained, low-noise directives and using multiple scoped .instructions.md files for detailed rules.
- The prior file mixed global rules with workflow/tutorial wording; this was compacted into stable sections and explicit delegation to instructions/prompts/skills.
- Added explicit anti-overfitting guidance so temporary module counts or migration mappings do not become permanent global rules.

### Validation / Evidence
- get_errors run on .github/copilot-instructions.md after edit.
- Context7 sources used: /websites/code_visualstudio_copilot_customization and /websites/code_visualstudio_copilot.

### Deviations / Risks
- Serena summarize_changes tool was not available in current tool set, so only write_memory was completed.

### Open Questions
- none