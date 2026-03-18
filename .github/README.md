# .github Copilot Configuration Map

This document aligns Xuanwu's `.github/` layout with VS Code Copilot customization mechanisms, and records which paths are active in this repository.

## 1) Official mechanism mapping

| Mechanism | Official path pattern | Required suffix | Trigger mode |
|---|---|---|---|
| Repository instructions | `.github/copilot-instructions.md` (or root `AGENTS.md`) | `.md` | Always-on |
| File-based instructions | `.github/instructions/*.instructions.md` | `.instructions.md` | `applyTo` glob match |
| Prompt files | `.github/prompts/*.prompt.md` | `.prompt.md` | Manual `/prompt-name` |
| Custom agents | `.github/agents/*.agent.md` | `.agent.md` | Agent picker |
| Hooks | `.github/hooks/*.json` | `.json` | Lifecycle event |
| Skills | `.github/skills/<name>/SKILL.md` | `SKILL.md` + folder | On-demand |

## 2) Xuanwu current status

- ✅ Repository instructions: `.github/copilot-instructions.md`
- ✅ File-based instructions: `.github/instructions/`
  - `mddd-migration.instructions.md`
  - `nextjs-ui.instructions.md`
- ✅ Prompt files: `.github/prompts/`
- ✅ Custom agents: `.github/agents/`
- ✅ Skills: `.github/skills/*/SKILL.md`
- ✅ Hooks directory scaffold: `.github/hooks/`
  - Currently reserved for future hook activation.

## 3) Conventions for future additions

- Keep filenames strictly aligned with official suffixes (`.instructions.md`, `.prompt.md`, `.agent.md`).
- Prefer extending existing instructions/prompts/agents before adding near-duplicates.
- Add hook JSON files only when a concrete lifecycle automation is approved.
- Keep this map in sync when adding or removing Copilot customization assets.
