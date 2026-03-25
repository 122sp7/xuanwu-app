## Phase: impl
## Task: remove broken docs references from workspace copilot instructions
## Date: 2026-03-25

### Scope
- Removed broken docs links from .github/copilot-instructions.md.
- Removed missing .github mapping links from the routing section.

### Decisions / Findings
- The workspace currently does not contain the referenced docs contract files.
- The workspace currently does not contain .github/mcp_to_agent_mapping.md or .svg.
- Kept valid repository, skill, instruction, and glossary references intact.

### Validation / Evidence
- get_errors run on .github/copilot-instructions.md after cleanup.

### Deviations / Risks
- none

### Open Questions
- none