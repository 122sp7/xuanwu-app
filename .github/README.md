# .github Copilot Configuration Map

This document aligns Xuanwu's `.github/` layout with the official VS Code Copilot customization mechanisms and the GitHub Copilot coding-agent setup workflow used by this repository.

## 1) Official customization mechanism mapping

| Mechanism | Official path pattern | Required suffix | Trigger mode |
| --- | --- | --- | --- |
| Repository instructions | `.github/copilot-instructions.md` (or root `AGENTS.md`) | `.md` | Always-on |
| File-based instructions | `.github/instructions/*.instructions.md` | `.instructions.md` | `applyTo` glob match |
| Prompt files | `.github/prompts/*.prompt.md` | `.prompt.md` | Manual `/prompt-name` |
| Custom agents | `.github/agents/*.agent.md` | `.agent.md` | Agent picker / handoff / subagent |
| Hooks *(Preview)* | `.github/hooks/*.json` | `.json` | Agent lifecycle event |
| Skills | `.github/skills/<name>/SKILL.md` | `SKILL.md` + folder | On-demand / slash command |

## 2) Related GitHub Copilot coding-agent bootstrap

GitHub Copilot coding agent setup steps are configured separately from the six VS Code customization mechanisms above:

- Workflow path: `.github/workflows/copilot-setup-steps.yml`
- Required job name: `copilot-setup-steps`
- Purpose in this repo: preinstall root Node dependencies, Python worker dependencies, and `uv` before the coding agent starts

## 3) MCP toolchain reference for this repo

| MCP server | Core capability | Role in Xuanwu workflow |
| --- | --- | --- |
| `filesystem` | Safe file read/write/list/move in allowed directories | Default repo editing and structure inspection |
| `repomix` | Repository packing, structural grep, large-scale context extraction | Cross-file architecture analysis and onboarding context |
| `next-devtools` | Next.js runtime/dev diagnostics and route/runtime inspection | App Router, hydration, runtime error checks |
| `shadcn` | Search/view/install shadcn UI components | UI component reuse and consistency |
| `markitdown` | Convert external docs (PDF/Office/HTML) to Markdown | Knowledge ingestion for planning/docs |
| `serena` | Symbol-aware search/edit, project memory, LSP-style navigation | Semantic refactor support and durable project memory |

## 4) Current live inventory in Xuanwu

### Repository instruction
- `.github/copilot-instructions.md`

### File-based instructions
- `.github/instructions/copilot-config.instructions.md`
- `.github/instructions/mddd-migration.instructions.md`
- `.github/instructions/nextjs-ui.instructions.md`
- `.github/instructions/typescript.instructions.md`

### Prompt files
- `.github/prompts/implement-vsa-mddd.prompt.md`
- `.github/prompts/plan-file-module-mddd.prompt.md`
- `.github/prompts/plan-vsa-mddd.prompt.md`
- `.github/prompts/refresh-serena-context.prompt.md`

### Custom agents
- `.github/agents/vsa-mddd-implementer.agent.md`
- `.github/agents/vsa-mddd-planner.agent.md`

### Hooks path
- `.github/hooks/README.md`
- No active `.github/hooks/*.json` files are enabled yet.

### Skills
- `.github/skills/awesome-rag-skill/SKILL.md`
- `.github/skills/chatbot-ui-skill/SKILL.md`
- `.github/skills/docmost-skill/SKILL.md`
- `.github/skills/google-cloud-skills-boost-skill/SKILL.md`
- `.github/skills/langchain-ai-skill/SKILL.md`
- `.github/skills/ragflow-skill/SKILL.md`
- `.github/skills/vsa-mddd-migration/SKILL.md`
- `.github/skills/xuanwu-skill/SKILL.md`

### Coding-agent setup workflow
- `.github/workflows/copilot-setup-steps.yml`

## 5) Documentation references checked

- VS Code custom instructions: `https://code.visualstudio.com/docs/copilot/customization/custom-instructions`
- VS Code prompt files: `https://code.visualstudio.com/docs/copilot/customization/prompt-files`
- VS Code custom agents: `https://code.visualstudio.com/docs/copilot/customization/custom-agents`
- VS Code agent skills: `https://code.visualstudio.com/docs/copilot/customization/agent-skills`
- VS Code hooks: `https://code.visualstudio.com/docs/copilot/customization/hooks`
- VS Code customization overview: `https://code.visualstudio.com/docs/copilot/customization/overview`
- GitHub repository instructions: `https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions?tool=vscode`
- GitHub coding-agent environment setup: `https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment`

## 6) Recommended conventions for future additions

- Keep filenames strictly aligned with official suffix rules (`.instructions.md`, `.prompt.md`, `.agent.md`).
- Prefer extending existing instructions, prompts, agents, and skills before introducing near-duplicate files.
- Keep instruction `applyTo` globs explicit and narrow enough to avoid accidental global policy overlap.
- Keep skills in dedicated folders and make each `SKILL.md` `name` match its parent directory name.
- Add `.github/hooks/*.json` only after lifecycle event, ownership, and rollback behavior are defined, and remember hooks are currently a VS Code Copilot **Preview** feature.
- Keep `.github/workflows/copilot-setup-steps.yml` limited to a single `copilot-setup-steps` job so GitHub Copilot coding agent can recognize it.
- Document the difference between active config and reserved paths so readers do not mistake scaffolding for enabled automation.
- Update this map whenever customization files are added, renamed, or removed.
