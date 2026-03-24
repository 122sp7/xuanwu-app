---
name: serena-mcp
description: >-
  Enforce Serena MCP tool usage for all GitHub Copilot agents.
  Use when starting a new delivery phase, writing or reading project memory, updating the project index,
  or enforcing the rule that .serena/ can only be modified via Serena MCP tools (never direct file edits).
  Triggers on any memory write, index rebuild, phase completion, onboarding, or .serena file access.
disable-model-invocation: true
---

# Serena MCP Enforcement

Use this skill for all interactions that involve reading or writing Serena project memory, updating the
project index, or verifying that `.serena/` is only modified through official Serena MCP tools.

## When to Use This Skill

- Starting any delivery phase (Planner, Implementer, Reviewer, QA)
- At the end of every delivery phase — to update memory and regenerate the index
- When reading project context, architecture notes, or coding conventions
- When any `.serena/` file needs to be created, updated, or deleted
- When an agent needs to record phase findings or update shared project knowledge

## Prerequisites

- Serena MCP server must be connected in the active agent environment
- Project must be activated via `serena/activate_project` before any other memory operation

## Core Rules

1. **`.serena/` is off-limits for direct file tools** — Never use `edit`, `create`, `write`, `replace_lines`,
   `insert_at_line`, `delete_lines`, or any equivalent file-editing tool on files whose path starts with `.serena/`.
   All content changes under `.serena/` must be routed through the corresponding Serena MCP tool.

2. **Memory writes via `serena/write_memory` only** — Create or update any project memory using `serena/write_memory`.
   If that tool is unavailable, report `blocked` and do not fall back to direct file writing.

3. **Memory deletes via `serena/delete_memory` only** — Remove stale entries using `serena/delete_memory`.
   Never `rm` or use a file-delete tool on `.serena/memories/**`.

4. **Index updates via Serena tools** — The `.serena/index.md` and `.serena/skills/*.md` files must be updated
   through `serena/write_memory` (or `serena/create_text_file` when creating a new skill file).
   Direct file edits are prohibited.

5. **Phase-end update is mandatory** — Every delivery phase must execute the Phase-End Update workflow before
   handing off to the next stage.

## Phase-End Memory Template

Use this markdown template for all `serena/write_memory` calls at phase end:

```markdown
## Phase: <plan|impl|review|qa>
## Task: <task-id or short description>
## Date: <YYYY-MM-DD>

### Scope
- <item>

### Decisions / Findings
- <decision or finding>

### Validation / Evidence
- <validation run or evidence collected>

### Deviations / Risks
- <deviation from plan or residual risk, or "none">

### Open Questions
- <question, or "none">
```

Pass this content as the `content` parameter to `serena/write_memory`.

### Tool call structure

```json
serena/write_memory: {
  "name": "workflow/impl-{task-id}",
  "content": "<markdown from template above>"
}
```

```json
serena/delete_memory: {
  "name": "workflow/plan-{task-id}"
}
```

```json
serena/activate_project: {
  "project_name": "xuanwu-app"
}
```

## Phase-End Update Workflow

Execute at the end of every delivery phase (Plan → Implement → Review → QA):

```
1. serena/activate_project      — Activate xuanwu-app project context
2. serena/list_memories         — Review existing memories; identify stale entries
3. serena/write_memory          — Write phase-completion memory (scope, decisions, delta summary)
4. serena/delete_memory         — Remove any outdated entries identified in step 2
5. serena/summarize_changes     — Generate a concise change summary for the phase
```

### Memory naming convention

| Phase          | Memory name pattern                    |
|----------------|----------------------------------------|
| Planning       | `workflow/plan-{task-id}`              |
| Implementation | `workflow/impl-{task-id}`              |
| Review         | `workflow/review-{task-id}`            |
| QA             | `workflow/qa-{task-id}`                |
| Maintenance    | `workflow/maintenance-{date}`          |

## Project Activation

Always activate the project before memory operations:

```json
serena/activate_project: { "project_name": "xuanwu-app" }
```

## Guardrails

- If a path starts with `.serena/`, route the operation through the matching Serena MCP tool — not a file tool.
- If `serena/write_memory` is unavailable, **do not** write the file directly; report `blocked` in the output.
- Do not add `.serena/**` entries to `.gitignore`; Serena memories are version-controlled by design.
- Index files are updated only by agents that have completed the full Phase-End Update workflow.
- `serena/execute_shell_command` may not be used to bypass the above rules (e.g., `echo > .serena/memories/...`).

## Tool Reference

| Tool | Purpose |
|------|---------|
| `serena/activate_project` | Activate project context before memory operations |
| `serena/check_onboarding_performed` | Verify onboarding completion |
| `serena/onboarding` | Run initial onboarding when missing |
| `serena/list_memories` | List current memory entries |
| `serena/read_memory` | Read a named memory |
| `serena/write_memory` | Create or overwrite a memory entry |
| `serena/delete_memory` | Remove a stale memory entry |
| `serena/summarize_changes` | Generate a change summary at phase end |
| `serena/create_text_file` | Create a new Serena skill/config file (`.serena/` only) |
| `serena/search_for_pattern` | Search across repo files |
| `serena/get_current_config` | Inspect Serena configuration and active tools |
| `serena/initial_instructions` | Load operating manual when system prompt unavailable |

## Output Expectations

When this skill is active, return:

1. Confirmation of project activation (tool call result)
2. Memory entries written — name and one-line summary each
3. Stale entries deleted — names only
4. Phase-end status: `updated | partial | blocked`
5. If `blocked`: reason and what was not persisted
