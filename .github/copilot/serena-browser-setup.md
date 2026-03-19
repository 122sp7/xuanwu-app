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
4. Confirm Serena starts against the checked-out repo and that its initial prompt reads `.serena/memories/INDEX.md`.
5. Confirm the tool list includes both:
   - LSP navigation tools such as `find_symbol`, `find_referencing_symbols`, and `get_symbols_overview`
   - Memory / handoff tools such as `activate_project`, `list_memories`, `read_memory`, `write_memory`, and `prepare_for_new_conversation`

## Notes

- This template uses `--context ide` to reduce tool duplication with coding agents.
- `--project .` binds Serena to the checked-out repository workspace.
- `.serena/project.yml` and `.serena/memories/` are the source of truth for Serena bootstrap, local-context recovery, and conversation continuity.
- The MCP template intentionally exposes Serena's LSP + memory workflow but not Serena shell tools; use the coding agent's native shell for command execution.
- If your organization blocks MCP, update Copilot policy first.

## Optional collaboration with client-local memory

Some clients such as Claude Desktop or Cursor may also expose a separate memory server such as Server-Memory. When that layer exists:

- use **Serena** for repository facts, symbol definitions, path discovery, and `.serena/memories` updates
- use **Server-Memory** for user-specific workflow preferences, environment reminders, and review habits
- validate solutions in this order: Serena project state first, then client-local preference rules

Suggested prompt for those clients:

> Treat Serena MCP as the project-structure expert for this repository, and treat Server-Memory as the user-preference layer. Use Serena first for symbol search, path lookup, and `.serena/memories` updates. Then cross-check the proposed solution against the user habits stored in Server-Memory. After major changes, ask whether Serena memory and the client-local memory rules should both be updated.

This repository does not add a GitHub workflow that auto-commits `.serena` changes back to the branch. Client-local memory usually lives outside the repository, and branch-writing automation should not be added until ownership, rollback, and review rules are explicit.
