## Phase: impl
## Task: implement mcp-to-agent mapping strategy
## Date: 2026-03-25

### Scope
- Implemented MCP routing strategy assets based on .github/mcp_to_agent_mapping.md and .github/mcp_to_agent_mapping.svg
- Added MCP-specialized custom agents and instruction files
- Updated agents catalog and replaced conceptual mapping tree with executable matrix

### Decisions / Findings
- Kept new custom agents at .github/agents top-level to align with existing workspace discovery behavior
- Used least-privilege tools with server-scoped MCP entries in each agent
- Kept skill format assumptions aligned to folder-based SKILL.md convention

### Validation / Evidence
- Diagnostics returned no errors for newly added agent files and instruction files
- mcp_to_agent_mapping.md updated to implemented status matrix with concrete file references

### Deviations / Risks
- Could not execute npm run repomix:skill in this turn because available toolset did not provide direct terminal execution
- Existing SVG was treated as canonical visual reference and not regenerated in this pass

### Open Questions
- Whether to create additional specialized prompts under prompts/diagnosis and prompts/rag now, or after usage telemetry confirms recurring demand