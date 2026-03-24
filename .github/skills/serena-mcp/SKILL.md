---
name: serena-mcp
description: >-
  Enforce Serena MCP usage for project memory and .serena governance. Use for memory read/write, onboarding checks,
  phase-end updates, and any .serena scoped operation.
disable-model-invocation: true
---

# Serena MCP Enforcement (Condensed)

## When to Use

- Phase start/end (plan/impl/review/qa)
- Project memory read/write/update
- Any `.serena/` path operation

## Mandatory Rules

1. Never edit `.serena/` with direct file tools.
2. Use Serena memory tools for create/update/delete.
3. Activate project before memory operations.
4. Execute phase-end memory update before handoff.

## Phase-End Flow

1. Activate project
2. List memories
3. Write phase memory
4. Delete stale memories (if needed)
5. Summarize changes

## Minimal Phase Memory Template

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
