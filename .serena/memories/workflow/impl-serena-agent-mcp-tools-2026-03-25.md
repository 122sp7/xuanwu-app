## Phase: impl
## Task: expand serena.agent.md MCP tool access
## Date: 2026-03-25

### Scope
- Update .github/agents/serena.agent.md so the Serena coding agent can autonomously use configured MCP servers for docs, UI verification, Next runtime evidence, Markdown conversion, and shadcn workflows

### Decisions / Findings
- The active MCP server names from .vscode/mcp.json are `context7`, `shadcn`, `io.github.vercel/next-devtools-mcp`, `microsoft/markitdown`, and `microsoft/playwright-mcp`
- The agent frontmatter must include these servers via `server/*` tool entries for autonomous use
- The body now includes explicit routing and guardrails so MCP use complements, rather than replaces, Serena symbolic workflow

### Validation / Evidence
- get_errors returned no errors for .github/agents/serena.agent.md after the edit

### Deviations / Risks
- This pass only updated the Serena agent definition; it did not update README or prompt docs because the user asked specifically for the agent file

### Open Questions
- Whether to also expose these MCP capabilities in related prompts or in agents/README for discoverability
