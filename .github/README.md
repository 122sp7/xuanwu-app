# .github Customization Index

This directory is the root index for repository-scoped Copilot, GitHub, and automation assets.

Use this page when you need one stable entry point for `.github/` instead of jumping directly into individual files or folders.

## Scope boundary

Treat `.github/` as the operational source of truth for active customization assets.

- Put live Copilot behavior, workflow entrypoints, applyTo instructions, agents, prompts, skills, and automation wiring here.
- Put explanatory, governance, onboarding, and maintenance documentation in `docs/`.
- Do not duplicate full operational content in both places.
- If a file under `.github/` changes behavior, update the docs-side index or explanation, but keep the operative definition here.

## Entry order

For AI customization work, read in this order:

1. [copilot-instructions.md](./copilot-instructions.md)
2. [../docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md)
3. the relevant folder in `.github/`
4. the specific file being edited or referenced

## Folder index

| Path | Purpose | Canonical entry |
| --- | --- | --- |
| [agents/](./agents/) | Delivery-stage agents and specialized personas | [agents/planner.agent.md](./agents/planner.agent.md) |
| [copilot/](./copilot/) | Reserved Copilot-specific assets | currently placeholder only |
| [hooks/](./hooks/) | Reserved hook assets and enforcement wiring | currently placeholder only |
| [instructions/](./instructions/) | Always-on or applyTo-scoped instructions | [instructions/xuanwu-app-nextjs-mddd.instructions.md](./instructions/xuanwu-app-nextjs-mddd.instructions.md) |
| [ISSUE_TEMPLATE/](./ISSUE_TEMPLATE/) | Reserved GitHub issue template assets | currently placeholder only |
| [prompts/](./prompts/) | Slash-command prompt workflows | [prompts/plan-feature.prompt.md](./prompts/plan-feature.prompt.md) |
| [rules/](./rules/) | Machine-readable engineering rule library | [rules/README.md](./rules/README.md) |
| [skills/](./skills/) | Reusable multi-step capabilities and domain skills | [skills/xuanwu-mddd-boundaries/SKILL.md](./skills/xuanwu-mddd-boundaries/SKILL.md) |
| [workflows/](./workflows/) | GitHub Actions and automation checks | [workflows/link-check.yml](./workflows/link-check.yml) |

## Key files

| File | Role |
| --- | --- |
| [copilot-instructions.md](./copilot-instructions.md) | Copilot baseline and workflow routing |
| [agents/planner.agent.md](./agents/planner.agent.md) | Planning stage entry |
| [agents/implementer.agent.md](./agents/implementer.agent.md) | Implementation stage entry |
| [agents/reviewer.agent.md](./agents/reviewer.agent.md) | Review stage entry |
| [agents/qa.agent.md](./agents/qa.agent.md) | QA stage entry |

## Link and reference policy

- Use relative links inside `.github/`.
- Prefer one canonical entry per folder.
- Treat `.github/` files as canonical when a docs page describes the same customization asset.
- Treat placeholder or example syntax as plain text, not live links.
- When adding or moving a customization file, update this index and [../docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md) in the same change if routing changed.

## Maintenance checklist

- Does the folder have a clear canonical entry?
- Does any newly added file need to be indexed here?
- Are example paths written in a way that will not be mistaken for broken links?
- If a delivery asset changed, is the docs-side index also updated?