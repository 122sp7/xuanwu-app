---
name: Xuanwu Copilot Configuration Rules
description: Use these rules when editing Copilot-related files under .github.
applyTo: ".github/**/*"
---
# Copilot configuration rules

- Keep Copilot customization files on the official VS Code/GitHub paths and suffixes:
  - `.github/copilot-instructions.md`
  - `.github/instructions/*.instructions.md`
  - `.github/prompts/*.prompt.md`
  - `.github/agents/*.agent.md`
  - `.github/hooks/*.json`
  - `.github/skills/*/SKILL.md`
- Keep GitHub Copilot coding-agent environment bootstrap in `.github/workflows/copilot-setup-steps.yml` when repository-specific setup is needed.
- If `.github/workflows/copilot-setup-steps.yml` exists, it must contain a single job named exactly `copilot-setup-steps`.
- Prefer updating existing instructions, prompts, agents, and skills before creating near-duplicate files.
- Keep `.github/README.md` aligned with the actual configured files, not a hypothetical future layout.
- Keep Serena as the default symbol-aware exploration and edit path for `.github/*` workflows; document other MCP tools as fallback layers instead of equal peers.
- Keep `.github/copilot/serena-coding-agent-mcp.json` aligned with `.serena/project.yml` so browser coding-agent sessions can use Serena's LSP navigation plus project memory bootstrap and handoff tools.
- Keep Sequential Thinking documented as the step that expands plans and routing only after Serena has gathered code evidence.
- When documenting Serena, cover both symbol tools (`find_symbol`, `find_referencing_symbols`, `get_symbols_overview`, `find_referencing_code_snippets`, `search_for_pattern`) and memory/orchestration tools (`activate_project`, `list_memories`, `read_memory`, `write_memory`, `prepare_for_new_conversation`).
- If client-local memory such as Server-Memory is documented, keep the responsibility split explicit: Serena owns repository facts and `.serena` continuity, while the client-local layer owns user preferences and workflow habits.
- Do not add workflows that auto-commit `.serena` or client-local memory changes back to branches unless ownership, rollback, and review rules are already documented.
- Only add hook JSON files after the trigger event, ownership, and rollback behavior are documented.
- When documenting MCP usage, describe real tools and real repo workflows already available in this project.
