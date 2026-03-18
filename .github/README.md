# .github Copilot Configuration Map (VS Code Copilot aligned)

This document aligns Xuanwu's `.github/` layout with official VS Code Copilot customization mechanisms and the MCP toolchain used by this repository.

## 1) Official customization mechanism mapping

| Mechanism | Official path pattern | Required suffix | Trigger mode |
|---|---|---|---|
| Repository instructions | `.github/copilot-instructions.md` (or root `AGENTS.md`) | `.md` | Always-on |
| File-based instructions | `.github/instructions/*.instructions.md` | `.instructions.md` | `applyTo` glob match |
| Prompt files | `.github/prompts/*.prompt.md` | `.prompt.md` | Manual `/prompt-name` |
| Custom agents | `.github/agents/*.agent.md` | `.agent.md` | Agent picker / handoff / subagent |
| Hooks *(Preview)* | `.github/hooks/*.json` | `.json` | Agent lifecycle event |
| Skills | `.github/skills/<name>/SKILL.md` | `SKILL.md` + folder | On-demand / slash command |

## 2) MCP toolchain reference for this repo

| MCP server | Core capability | Role in Xuanwu workflow |
|---|---|---|
| `filesystem` | Safe file read/write/list/move in allowed directories | Default repo editing and structure inspection |
| `repomix` | Repository packing, structural grep, large-scale context extraction | Cross-file architecture analysis and onboarding context |
| `next-devtools` | Next.js runtime/dev diagnostics and route/runtime inspection | App Router, hydration, runtime error checks |
| `shadcn` | Search/view/install shadcn UI components | UI component reuse and consistency |
| `markitdown` | Convert external docs (PDF/Office/HTML) to Markdown | Knowledge ingestion for planning/docs |
| `serena` | Symbol-aware search/edit, project memory, LSP-style navigation | Semantic refactor support and durable project memory |

## 3) Current `.github/` status in Xuanwu

- ✅ Repository instruction
  - `.github/copilot-instructions.md`
- ✅ File instructions
  - `.github/instructions/copilot-config.instructions.md`
  - `.github/instructions/mddd-migration.instructions.md`
  - `.github/instructions/nextjs-ui.instructions.md`
  - `.github/instructions/typescript.instructions.md`
- ✅ Prompt files
  - `.github/prompts/*.prompt.md`
- ✅ Custom agents
  - `.github/agents/*.agent.md`
- ✅ Skills
  - `.github/skills/*/SKILL.md`
- ✅ Hooks path reserved
  - `.github/hooks/README.md` (no active hook JSON files yet; the official workspace path is reserved for approved lifecycle automation)

## 4) Documentation references checked

- VS Code custom instructions: `https://code.visualstudio.com/docs/copilot/customization/custom-instructions`
- VS Code prompt files: `https://code.visualstudio.com/docs/copilot/customization/prompt-files`
- VS Code custom agents: `https://code.visualstudio.com/docs/copilot/customization/custom-agents`
- VS Code agent skills: `https://code.visualstudio.com/docs/copilot/customization/agent-skills`
- VS Code hooks: `https://code.visualstudio.com/docs/copilot/customization/hooks`
- VS Code customization overview: `https://code.visualstudio.com/docs/copilot/customization/overview`
- GitHub repository instructions: `https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions?tool=vscode`

## 5) Recommended conventions for future additions

- Keep filenames strictly aligned with official suffix rules (`.instructions.md`, `.prompt.md`, `.agent.md`).
- Prefer extending existing instructions/prompts/agents before introducing near-duplicate files.
- Keep instruction `applyTo` globs explicit and narrow enough to avoid accidental global policy overlap.
- Keep skills in dedicated folders and make each `SKILL.md` `name` match its parent directory name.
- Add `.github/hooks/*.json` only after lifecycle event, ownership, and rollback behavior are defined, and remember hooks are currently a VS Code Copilot **Preview** feature.
- Document the difference between active config and reserved paths so readers do not mistake scaffolding for enabled automation.
- Update this map whenever customization files are added, renamed, or removed.
