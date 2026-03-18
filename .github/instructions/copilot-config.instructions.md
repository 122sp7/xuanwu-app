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
- Prefer updating existing instructions, prompts, agents, and skills before creating near-duplicate files.
- Keep `.github/README.md` aligned with the actual configured files, not a hypothetical future layout.
- Only add hook JSON files after the trigger event, ownership, and rollback behavior are documented.
- When documenting MCP usage, describe real tools and real repo workflows already available in this project.
