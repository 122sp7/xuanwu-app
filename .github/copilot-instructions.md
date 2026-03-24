# Xuanwu Copilot Delivery Suite

Baseline for Copilot agents to stay aligned with the repository and toolchain.

## Authoritative Sources (read in order)

1. [AGENTS.md](../AGENTS.md) — repository-wide operating rules  
2. [CLAUDE.md](../CLAUDE.md) — cross-agent compatibility  
3. [agents/knowledge-base.md](../agents/knowledge-base.md) — module ownership and MDDD boundaries  
4. [agents/commands.md](../agents/commands.md) — build, lint, and deployment commands  
5. [CONTRIBUTING.md](../CONTRIBUTING.md) — contribution and validation expectations  
6. Contract work: [development-contracts/overview.md](../docs/development-reference/reference/development-contracts/overview.md) and [development-contract-governance.md](../docs/diagrams-events-explanations/explanation/development-contract-governance.md)

## Operating rules (concise)

- Plan first for cross-module, cross-runtime, or contract-governed work.  
- Each `modules/` context is isolated; cross-module access must use the target `api/` boundary.  
- Keep business logic in `domain` + `application`; keep UI/transport in `interfaces` and `app/`.  
- Treat the approved plan as the contract; stay within scope and update docs when boundaries or public APIs change.  

## Serena MCP — mandatory

All agents must use Serena MCP tools for project memory, index, and `.serena/` management:

- **Activate first**: call `serena/activate_project` (project: `xuanwu-app`) before any memory operation.
- **Phase-end update**: every delivery stage (Plan, Implement, Review, QA) must call `serena/write_memory` and `serena/summarize_changes` before handing off.
- **`.serena/` is protected**: never use file-editing tools (`edit`, `create`, `write`, `replace_lines`, `insert_at_line`, `delete_lines`) on paths under `.serena/`. Route all `.serena/` changes through the matching Serena MCP tool.
- See [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md) for the full workflow, tool reference, and memory naming convention.

## Orchestration pattern

1. Use Planner → Implementer → Reviewer → QA for non-trivial work (re-enter via prompts if a stage restarts).  
2. Activate skills as needed:  
   - [serena-mcp](skills/serena-mcp/SKILL.md) *(mandatory — activate first)*  
   - [xuanwu-mddd-boundaries](skills/xuanwu-mddd-boundaries/SKILL.md)  
   - [xuanwu-development-contracts](skills/xuanwu-development-contracts/SKILL.md)  
   - [xuanwu-rag-runtime-boundary](skills/xuanwu-rag-runtime-boundary/SKILL.md)  
   - [vercel-react-best-practices](skills/vercel-react-best-practices/SKILL.md)  
3. Prefer Copilot tools per the VS Code overview: search/read before edit, run lint/build commands from `agents/commands.md`, and use diagnostics when customizations fail to load.  

## Validation

- Run the matching validation for the files you change using [agents/commands.md](../agents/commands.md).  
- Do not close work until required checks and documentation updates are complete.  

## Terminology

See [terminology-glossary.md](./terminology-glossary.md) for efficiency and vocabulary.
