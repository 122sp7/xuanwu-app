---
name: serena-mcp
description: >-
  Unified Serena MCP skill for memory/index governance and integration bootstrap.
  Use for project memory operations, .serena scoped tasks, onboarding checks, and
  automatic Serena MCP server startup.
user-invocable: false
disable-model-invocation: true
---

# Serena MCP (Unified)

## Outcome
- Keep Serena as the single authority for memory/index operations.
- Ensure Serena MCP server can be auto-bootstrapped before Serena-dependent work.

## When to Use
- Before any task that reads/writes project memory.
- Any `.serena/` scoped operation.
- Phase start/end (plan, impl, review, qa).
- When Serena MCP is not running or tools are unavailable.

## Bootstrap (Auto Install + Start)
Run this first when Serena tools are missing or server is not active.

```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

If your runner requires a prefixed command wrapper, use:

```bash
run uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

## Mandatory Rules
1. Never edit `.serena/` with direct file tools.
2. Use Serena memory tools for create/update/delete.
3. Activate project before memory operations.
4. Execute phase-end memory update before handoff.
5. Serena owns orchestration; subagents assist but do not replace Serena's framing and synthesis.
6. If confidence in any library, framework, or config detail is below 99.99%, use Context7 before generating or recommending code.
7. Project memory and index updates are authoritative only when performed through Serena tools.

## Workflow
1. Define concrete outcome and success criteria.
2. Bootstrap Serena MCP server if needed.
3. Activate project.
4. List/read relevant memories.
5. Perform the smallest safe change.
6. Run required validation and report evidence.
7. Write phase-end memory update.

## Phase-End Memory Template
```markdown
## Phase: <plan|impl|review|qa>
## Task: <id or short description>
## Date: <YYYY-MM-DD>

### Scope
- <item>

### Decisions / Findings
- <item>

### Validation / Evidence
- <item>

### Deviations / Risks
- <item or none>

### Open Questions
- <item or none>
```

## Guardrails
- If Serena write tool is unavailable, report blocked; do not bypass with direct file writes.
- Keep memory names consistent (`workflow/<phase>-<task-id>`).
- Keep guidance concise; avoid duplicating repository-global policy text.
