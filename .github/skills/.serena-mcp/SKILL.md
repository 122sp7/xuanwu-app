---
name: serena-mcp-integration
description: >-
  Auto-loaded background skill for Serena MCP integration. Enables GitHub Copilot
  Agent to autonomously use Serena MCP tools for reading, querying, and updating
  project semantic memory, symbol index, and code understanding context. Triggered
  before any development task begins, after phase completion, or when .serena/
  memory and index data need to be accessed. Direct .serena/ file edits are forbidden.
user-invocable: false
disable-model-invocation: true
---

# serena執行失敗：run uvx --from git+https://github.com/oraios/serena serena start-mcp-server 
# .serena-mcp (Condensed)

## Scope
Use this skill only when the request clearly matches its description/frontmatter.

## Workflow
1. Define the concrete outcome and success criteria in one short block.
2. Collect only the minimum files/docs needed for that outcome.
3. Implement the smallest safe change that satisfies the request.
4. Validate with project-required commands and report evidence.

## Output Contract
- State owner/boundary impact (module, runtime, or integration).
- List changed files and why each changed.
- Report validation results and residual risk.

## Guardrails
- Do not duplicate repository-global policy text from AGENTS or copilot instructions.
- Do not copy long handbooks into responses; reference canonical docs instead.
- Keep examples short and directly executable.

## Anti-Noise
- Prefer checklist-style guidance over long prose.
- Keep this file focused on skill-specific execution intent.
- Remove repeated conceptual background that exists elsewhere.
