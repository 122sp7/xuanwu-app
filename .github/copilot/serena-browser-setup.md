# Serena for Browser GitHub Copilot Coding Agent

This guide enables Serena for GitHub-hosted Copilot coding agent sessions (browser workflow).

## Why this guide exists

GitHub Copilot coding agent MCP configuration is managed in repository settings on GitHub.com.
It is not auto-loaded from repository files.

This repository provides a ready-to-paste template in:

- `.github/copilot/serena-coding-agent-mcp.json`

## 1. Keep setup workflow ready

The coding agent runner must have required dependencies. This repo installs Node, Python, and uv in:

- `.github/workflows/copilot-setup-steps.yml`

## 2. Configure MCP in repository settings

On GitHub.com, open:

1. Repository `Settings`
2. `Copilot` -> `Coding agent`
3. `MCP configuration`

Paste the JSON from:

- `.github/copilot/serena-coding-agent-mcp.json`

Save and wait for validation.

## 3. Configure Copilot environment (if needed)

If your MCP server configuration needs secrets/variables, create environment `copilot` and add values prefixed with:

- `COPILOT_MCP_`

Serena in this template does not require secrets by default.

## 4. Validate in an agent session

1. Create an issue and assign it to Copilot coding agent.
2. Open the generated session logs.
3. Expand `Start MCP Servers`.
4. Confirm Serena tools are listed.

## Notes

- This template uses `--context ide` to reduce tool duplication with coding agents.
- `--project .` binds Serena to the checked-out repository workspace.
- If your organization blocks MCP, update Copilot policy first.