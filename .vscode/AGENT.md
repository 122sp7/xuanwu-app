# .vscode — Agent Guide

## Route Here

- Adding or editing VS Code task definitions (`tasks.json`)
- Adjusting debug launch configs (`launch.json`)
- Adding recommended extensions (`extensions.json`)
- Configuring MCP server bindings for Copilot agents (`mcp.json`)

## Route Elsewhere

- `package.json` scripts — for npm script definitions (this is just a VS Code wrapper)
- `.github/copilot-instructions.md` — for Copilot governance and workspace instruction rules
- `.github/instructions/` — for scoped Copilot behavior instructions
- `.github/skills/` — for MCP skill definitions

## Key Rules

- `tasks.json` tasks must mirror `package.json` scripts — do not introduce logic here.
- `mcp.json` governs which MCP servers Copilot can access in this workspace; changes affect all agents.
- Do not store secrets or personal paths in any `.vscode/` file.
- `launch.json` debug configs should target Next.js dev server (port 3000) and Python Cloud Functions under `py_fn/`.
