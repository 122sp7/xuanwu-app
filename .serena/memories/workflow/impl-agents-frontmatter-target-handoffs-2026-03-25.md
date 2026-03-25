## Phase: impl
## Task: configure workspace custom agents with official target and handoffs
## Date: 2026-03-25

### Scope
- Updated the listed .github/agents/*.agent.md files plus .github/agents/README.md.
- Added official custom-agent frontmatter fields validated via Context7: target and handoffs.
- Added a Target Scope section to each agent body to represent folder ownership because official target means environment, not folder scope.
- Simplified repo-architect.agent.md from an oversized template dump into a concise active agent definition.

### Decisions / Findings
- Context7 confirms VS Code custom agents support name, description, argument-hint, tools, model, target, and handoffs.
- Official target is the environment target (`vscode` or `github-copilot`), so folder responsibility was documented in agent body sections instead of overloading frontmatter.
- Handoffs must reference visible agent names, not file identifiers, in this workspace setup.
- YAML indentation in handoffs is strict; tab-indented list items produce agent-schema errors.

### Validation / Evidence
- Ran get_errors against all requested agent files and .github/agents/README.md after edits.
- Final targeted validation returned no errors.

### Deviations / Risks
- Validation was scoped to the requested active agent files. Legacy files under .github/agents/old still contain unrelated historical errors.

### Open Questions
- none