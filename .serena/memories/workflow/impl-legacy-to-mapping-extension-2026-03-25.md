## Phase: impl
## Task: make legacy .github assets extensions of MCP mapping architecture
## Date: 2026-03-25

### Scope
- Updated orchestration and index docs so old agents/instructions/prompts are explicitly treated as extension layers under MCP mapping baseline
- Added migration matrix section in .github/mcp_to_agent_mapping.md
- Updated instruction index for context7/markitdown extension files and corrected file count

### Decisions / Findings
- Kept existing legacy workflow chain intact and reframed it as core extension lane
- Avoided destructive file moves; used policy/index alignment for safer rollout
- Terminal execution for `npm run repomix:skill` is not available via current tool interface in this session

### Validation / Evidence
- get_errors returned no issues for modified markdown/index files
- grep verification confirms baseline and extension language is present in copilot-instructions and .github indexes

### Deviations / Risks
- Could not execute repomix command directly due missing terminal execution capability in active toolset

### Open Questions
- Whether to proceed with physical folder migration of legacy assets in a separate controlled pass