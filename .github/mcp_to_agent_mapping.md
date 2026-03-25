# MCP to Agent Mapping (Implemented)

This file records the implemented mapping strategy for using MCP tools through dedicated custom agents, instructions, prompts, and skills.

## Implementation policy

1. Keep custom agents at `.github/agents/` top-level for reliable discovery in this workspace.
2. Use least-privilege `tools` in agent frontmatter.
3. Use skills in folder form (`.github/skills/<name>/SKILL.md`), not `*.skill.md` files.
4. Treat MCP mapping as a preferred routing rule, not a hard lock.

## MCP routing matrix

| MCP server | Primary agent | Supporting assets | Status |
| --- | --- | --- | --- |
| `context7/*` | `.github/agents/commander.agent.md` | `.github/instructions/06-context7-usage.instructions.md`, `.github/prompts/context7-mcp.prompt.md` | Implemented |
| `shadcn/*` | `.github/agents/component.agent.md` | `.github/prompts/shadcn-mcp.prompt.md` | Implemented |
| `io.github.vercel/next-devtools-mcp/*` | `.github/agents/app-router.agent.md` | `.github/prompts/next‑devtools‑mcp.prompt.md` | Implemented |
| `microsoft/markitdown/*` | `.github/agents/rag-vector.agent.md` | `.github/instructions/07-markitdown-rag.instructions.md`, `.github/prompts/markitdown-md-optimization.prompt.md` | Implemented |
| `microsoft/playwright-mcp/*` | `.github/agents/e2e-qa.agent.md` | `.github/prompts/playwright-mcp.prompt.md` | Implemented |
| `serena/*` | `.github/agents/serena.agent.md`, `.github/agents/commander.agent.md` | `.github/skills/serena-mcp/SKILL.md` | Implemented |

## Phase 2 candidates

1. Add feature-specialized prompts under `prompts/diagnosis` and `prompts/rag` if workflow frequency justifies them.
2. Add additional agents only when a repeated workflow cannot be covered by existing delivery agents plus prompts.
3. Keep handoff targets aligned to diagnostics-recognized agent names.

## Legacy to extension mapping

| Legacy area | Extension role in current architecture | Notes |
| --- | --- | --- |
| `.github/agents/planner.agent.md`, `.github/agents/implementer.agent.md`, `.github/agents/reviewer.agent.md`, `.github/agents/qa.agent.md` | Core delivery chain | Remains authoritative for formal delivery handoffs |
| `.github/agents/modules-*.agent.md`, `.github/agents/app-router-composer.agent.md` | Domain-specialized extension lanes | Activated when scope is module boundary or app composition specific |
| `.github/agents/serena.agent.md` | Serena-first execution lane | Works as cross-cutting execution backbone with symbolic workflow |
| `.github/prompts/*` | Trigger surface for chain and MCP lanes | Prompt scope routes work to delivery agents or MCP-specialized agents |
| `.github/instructions/*` | Always-on policy layer | Narrow `applyTo` keeps context noise low while preserving guardrails |
| `.github/copilot-instructions.md` | Top-level orchestration contract | Defines precedence, boundaries, and mapping baseline usage |

## Legacy inventory decisions

### Agents

| Asset group | Decision | Why |
| --- | --- | --- |
| Delivery chain (`planner`, `implementer`, `reviewer`, `qa`) | Keep | Formal delivery workflow remains the primary quality gate for non-trivial work |
| MCP lanes (`commander`, `app-router`, `component`, `rag-vector`, `e2e-qa`) | Keep | These provide focused execution for MCP-heavy tasks and reduce prompt ambiguity |
| Domain lanes (`modules-*`, `app-router-composer`) | Keep with role split | Composition/refactor roles are still needed when runtime diagnostics are not the main problem |
| `serena` | Keep | Cross-cutting execution backbone with symbolic workflow and guarded MCP access |
| `planner-docs`, `md-writer` | Keep as optional extension | Required for doc-heavy delivery but not mandatory for every feature |
| `qa-legacy` | Keep hidden, retire later | Retained for historical traceability only; not part of primary routing |
| `custom-agent-foundry`, `repo-architect` | Keep as maintainer tools | Useful for customization authoring and bootstrap, but not core delivery path |

### Instructions

| Asset group | Decision | Why |
| --- | --- | --- |
| Foundation authoring rules (`agents`, `prompt`, `agent-skills`, `instructions`) | Keep | Prevents customization quality drift |
| Project/runtime rules (`xuanwu-*`, `modules-*`, `app/*`) | Keep | Enforces architecture boundaries and runtime split |
| MCP extensions (`06-context7`, `07-markitdown-rag`) | Keep | Required to keep external-doc and conversion behavior consistent with mapping |
| Dotnet guidance | Keep low-priority | Not currently primary stack, but valid for mixed-language contributions |

### Prompts

| Asset group | Decision | Why |
| --- | --- | --- |
| Delivery prompts (`plan-*`, `implement-plan`, `review-changes`, `run-qa`) | Keep | Mirrors formal delivery stages |
| Module/app prompts | Keep | Supports bounded-context and route composition work |
| MCP prompts (`context7`, `shadcn`, `next-devtools`, `playwright`, `markitdown`) | Keep with routing refactor | Must target MCP-specialized agents to stay self-consistent with mapping |
| Markdown optimization prompts (`md-*`) | Keep optional | High-value for docs maintenance, not required for code-only changes |