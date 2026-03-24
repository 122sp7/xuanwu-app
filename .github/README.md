# .github Customization Index

This file is the operational index for repository-scoped customization assets.

## Boundary

- Keep executable customization assets in `.github/`.
- Keep explanation, governance, and lifecycle context in `docs/`.
- Do not duplicate full definitions across both locations.
- If behavior changes in `.github/`, update the docs mirror in the same change.

## Read order

1. [copilot-instructions.md](./copilot-instructions.md)
2. [../docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md)
3. the target folder in `.github/`
4. the exact file being edited

## Folder map

| Path | Purpose | Entry |
| --- | --- | --- |
| [agents/](./agents/) | Delivery-stage and specialized agents | [agents/planner.agent.md](./agents/planner.agent.md) |
| [copilot/](./copilot/) | Copilot-specific reserved assets | reserved placeholder |
| [hooks/](./hooks/) | Hook and enforcement wiring assets | reserved placeholder |
| [instructions/](./instructions/) | Always-on and `applyTo`-scoped instructions | [instructions/xuanwu-app-nextjs-mddd.instructions.md](./instructions/xuanwu-app-nextjs-mddd.instructions.md) |
| [ISSUE_TEMPLATE/](./ISSUE_TEMPLATE/) | GitHub issue templates | reserved placeholder |
| [prompts/](./prompts/) | Slash-command prompt workflows | [prompts/plan-feature.prompt.md](./prompts/plan-feature.prompt.md) |
| [rules/](./rules/) | Machine-readable rule library | [rules/README.md](./rules/README.md) |
| [skills/](./skills/) | Reusable multi-step skills | [skills/xuanwu-mddd-boundaries/SKILL.md](./skills/xuanwu-mddd-boundaries/SKILL.md) |
| [workflows/](./workflows/) | GitHub Actions automation | [workflows/link-check.yml](./workflows/link-check.yml) |

## Core files

| File | Role |
| --- | --- |
| [copilot-instructions.md](./copilot-instructions.md) | Copilot baseline and routing |
| [agents/planner.agent.md](./agents/planner.agent.md) | Planning stage entry |
| [agents/implementer.agent.md](./agents/implementer.agent.md) | Implementation stage entry |
| [agents/reviewer.agent.md](./agents/reviewer.agent.md) | Review stage entry |
| [agents/qa.agent.md](./agents/qa.agent.md) | QA stage entry |

## Maintenance

- Use relative links.
- Keep one concrete entry file per folder.
- Keep placeholders as plain text, not fake links.
- Update this file and [../docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md) together when routing changes.