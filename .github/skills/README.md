# Agent Skills

Specialized capabilities bundled with resources, examples, and workflows. Skills are auto-discovered based on request content and loaded on-demand.

## Core Xuanwu Skills

| Skill | File | Purpose |
| --- | --- | --- |
| MDDD Boundaries | `xuanwu-mddd-boundaries/` | Enforce module ownership, layer placement, API boundaries, dependency direction |
| Development Contracts | `xuanwu-development-contracts/` | Follow contract-first workflows for RAG, parser, schedule, acceptance, billing, audit |
| RAG Runtime Boundary | `xuanwu-rag-runtime-boundary/` | Preserve Next.js/Python ownership split for uploads, ingestion, retrieval |

## Customization & Architecture

| Skill | File | Purpose |
| --- | --- | --- |
| Customization Architecture | `vscode-customization-architecture/` | Design instructions, agents, skills, prompts, hooks, MCP correct placement |
| Agent Foundations | `vscode-agent-foundations/` | Learn agent models, planning, memory, tools, subagents, handoffs |
| Context Engineering | `vscode-context-engineering/` | Build high-signal workflows, context layers, documentation strategies |
| Skillbook Router | `vscode-copilot-skillbook/` | Route customization questions to correct skill |
| Tasks Authoring | `vscode-tasks-authoring/` | Author build, test, watch, shell, background tasks in tasks.json |
| TypeScript Workbench | `vscode-typescript-workbench/` | Configure tsconfig, transpile, debug, refactor TypeScript |
| Testing & Debugging | `vscode-testing-debugging-browser/` | Generate tests, debug, validate with browser automation |

## Best Practices

| Skill | File | Purpose |
| --- | --- | --- |
| Documentation Writer | `documentation-writer/` | Create tutorial, how-to, reference, explanation with Diátaxis |
| React Best Practices | `vercel-react-best-practices/` | Optimize React/Next.js performance, bundle size, data fetching |
| Web Design Guidelines | `web-design-guidelines/` | Review UI for accessibility and design compliance |

## Total: 13 Skills

All skills are under version control. When editing a skill, update the `description` field to improve auto-discovery.

## Related References

- [.github/README.md](../README.md) — Root navigation
- [../.github/agents/](../agents/) — Delivery workflow agents
- [../.github/instructions/](../instructions/) — Always-on coding standards
