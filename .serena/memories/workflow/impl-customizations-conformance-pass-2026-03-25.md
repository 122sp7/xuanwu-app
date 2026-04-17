## Phase: impl
## Task: customizations conformance for agents, instructions, and related prompts
## Date: 2026-03-25

### Scope
- Normalize .github/agents frontmatter, valid handoff targets, and Serena agent definition
- Normalize .github/instructions frontmatter and applyTo globs
- Align related prompt agent references so custom agents are usable on demand
- Update agents/instructions README notes for diagnostics and maintenance

### Decisions / Findings
- VS Code diagnostics required exact visible custom agent names in handoffs and prompt agent references
- Unsupported tool alias `write` in md-writer caused agent load failure; replaced with `edit`
- Invalid model strings in module agents were removed instead of guessing unsupported identifiers
- serena.agent.md used unsupported `agent` frontmatter; converted into a valid custom agent definition with Serena-focused workflow
- Brace-expansion globs are safer and clearer than comma-separated applyTo strings in one pattern

### Validation / Evidence
- get_errors on .github/agents, .github/instructions, and .github/prompts returned no errors
- Prompt references for Implementer, Reviewer, QA, and serena-coding-agent now resolve without diagnostics failures

### Deviations / Risks
- Serena summarize_changes tool was not available in the current tool set, so only write_memory was completed
- Repomix-generated reference snapshots under .github/skills/xuanwu-skill/references still contain historical text and were not regenerated in this pass

### Open Questions
- Whether repo maintainers want prompt files beyond the directly related delivery chain normalized in the same naming style
