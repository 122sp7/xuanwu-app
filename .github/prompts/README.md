# Slash-Command Prompts

Entry points for quick workflows. Use `/prompt-name` in VS Code chat to invoke.

## Delivery Workflow

| Prompt | File | Purpose |
| --- | --- | --- |
| `/plan-feature` | `plan-feature.prompt.md` | Create formal implementation plan for feature/enhancement |
| `/plan-bugfix` | `plan-bugfix.prompt.md` | Create plan with reproduction, root cause, regression assessment |
| `/implement-plan` | `implement-plan.prompt.md` | Execute a saved implementation plan |
| `/review-changes` | `review-changes.prompt.md` | Review completed work against plan and boundaries |
| `/run-qa` | `run-qa.prompt.md` | Execute QA verification with scenario coverage and evidence |
| `/resume-delivery` | `resume-delivery.prompt.md` | Resume interrupted workflow from last checkpoint |

## Module Management

| Prompt | File | Purpose |
| --- | --- | --- |
| `/create-module` | `create-module.prompt.md` | Create new module under `modules/` with MDDD structure |
| `/refactor-module` | `refactor-module.prompt.md` | Refactor internal module structure |
| `/split-module` | `split-module.prompt.md` | Split one module into two bounded contexts |
| `/merge-module` | `merge-module.prompt.md` | Merge two modules into one bounded context |
| `/delete-module` | `delete-module.prompt.md` | Delete module with safe cross-module cleanup |

## Customization & Integration

| Prompt | File | Purpose |
| --- | --- | --- |
| `/serena-agent` | `serena-agent.prompt.md` | Serena coding workflow with symbolic editing guardrails |
| `/serena-maintenance` | `serena-maintenance.prompt.md` | Maintenance tasks for Serena MCP integration |
| `/markitdown-md-optimization` | `markitdown-md-optimization.prompt.md` | Markitdown-driven end-to-end markdown optimization |
| `/md-optimize` | `md-optimize.prompt.md` | Orchestrate markdown optimization pipeline |
| `/md-lint` | `md-lint.prompt.md` | Lint and validate markdown files |
| `/md-compress` | `md-compress.prompt.md` | Compress markdown while preserving information |
| `/md-dedup` | `md-dedup.prompt.md` | Remove duplicated concepts across docs |
| `/md-rules` | `md-rules.prompt.md` | Convert prose to rules and tables |
| `/md-structure` | `md-structure.prompt.md` | Enforce markdown section hierarchy |
| `/md-index` | `md-index.prompt.md` | Generate/update folder index files |

## Tool-Specific Prompts

| Prompt | File | Purpose |
| --- | --- | --- |
| `/playwright-mcp` | `playwright-mcp.prompt.md` | Browser automation for UI testing and verification |
| `/context7-mcp` | `context7-mcp.prompt.md` | Upstash Context7 integration workflows |
| `/shadcn-mcp` | `shadcn-mcp.prompt.md` | shadcn component management with MCP |
| `/next-devtools-mcp` | `next‑devtools‑mcp.prompt.md` | Next.js development tools integration |

## Total: 26 Prompts

## Quick Reference

Each prompt includes:
- Clear description and use case
- Required inputs and optional arguments
- Example invocations
- Validation or output format hints

## Related References

- [.github/README.md](../README.md) — Root navigation
- [../.github/agents/](../agents/) — Delivery workflow agents
- [docs/development-reference/reference/ai/implementation-plan-template.md](../../docs/development-reference/reference/ai/implementation-plan-template.md) — Plan structure
