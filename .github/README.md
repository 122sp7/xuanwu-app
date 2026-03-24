# .github Customization Index

Operational index for repository-scoped customization assets.

## Commander flow (fast path)

1. Start with [copilot-instructions.md](./copilot-instructions.md) for orchestration rules and tool use.
2. Jump to [agents/README.md](./agents/README.md) for stage-specific agents or [prompts/README.md](./prompts/README.md) for slash commands.
3. Pull supporting skills from [skills/README.md](./skills/README.md) when extra capabilities are needed.
4. Cross-check mirrors in [../docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md) when routing changes.

## Boundary

- Keep executable customization assets in `.github/`.
- Keep explanation, governance, and lifecycle context in `docs/`.
- Update both locations together when behavior changes.

## Folder map

| Path | Purpose | Index |
| --- | --- | --- |
| [agents/](./agents/) | Delivery-stage and specialized agents | [agents/README.md](./agents/README.md) |
| [copilot/](./copilot/) | Copilot-specific reserved assets | reserved placeholder |
| [hooks/](./hooks/) | Hook and enforcement wiring assets | reserved placeholder |
| [instructions/](./instructions/) | Always-on and `applyTo`-scoped instructions | [instructions/README.md](./instructions/README.md) |
| [ISSUE_TEMPLATE/](./ISSUE_TEMPLATE/) | GitHub issue templates | reserved placeholder |
| [prompts/](./prompts/) | Slash-command prompt workflows | [prompts/README.md](./prompts/README.md) |
| [rules/](./rules/) | Machine-readable rule library | [rules/README.md](./rules/README.md) |
| [skills/](./skills/) | Reusable multi-step skills | [skills/README.md](./skills/README.md) |
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
