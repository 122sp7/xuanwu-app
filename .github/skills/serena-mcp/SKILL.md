---
name: serena-mcp
description: >-
  Use when working with Serena MCP, .serena memories, Serena project indexing,
  onboarding, health-checks, or Serena bootstrap/repair tasks. Governs
  project memory operations, .serena scoped work, and Serena MCP startup.
user-invocable: false
disable-model-invocation: true
---

# Serena MCP (Unified)

## Outcome
- Keep Serena as the single authority for memory/index operations.
- Ensure Serena MCP server can be auto-bootstrapped before Serena-dependent work.
- Keep `.serena/` structured so future sessions can recover the current project baseline quickly.

## When to Use
- Before any task that reads/writes project memory.
- Any `.serena/` scoped operation.
- Phase start/end (plan, impl, review, qa).
- When Serena MCP is not running or tools are unavailable.
- When the user mentions `serena`, `Serena MCP`, `project index`, `health-check`, `onboarding`, or `.serena` cleanup.

## Official Serena Facts
- Serena uses a project workflow: create or activate project, optionally index, onboard, then work with memories.
- `serena project index` is the official CLI entrypoint for refreshing symbol cache; Serena also updates index during normal operation as files change.
- `.serena/project.yml` is the project-level Serena configuration and is applied on activation.
- Context is fixed at startup; modes can be switched during a session.
- Tool inclusion must use valid Serena tool names; validate names with `serena tools list` before adding them to project configuration.

## Repo-Specific Rules
- Treat `.github/copilot-instructions.md` as the authoritative Serena workflow contract for this repository.
- Use Serena MCP tools for `.serena/` work; do not patch `.serena/` directly with generic file editors.
- If the current Serena context does not expose `create_text_file` or `summarize_changes`, record the limitation explicitly and keep memory/index updates structured through available Serena memory tools.
- Verify concrete tool names first.

## Serena Tools List

### symbol_tools
- find_referencing_symbols
- find_symbol
- get_symbols_overview
- insert_after_symbol
- insert_before_symbol
- rename_symbol
- replace_symbol_body
- restart_language_server
- safe_delete_symbol

### jetbrains_tools
- jet_brains_find_declaration
- jet_brains_find_implementations
- jet_brains_find_referencing_symbols
- jet_brains_find_symbol
- jet_brains_get_symbols_overview
- jet_brains_inline_symbol
- jet_brains_move
- jet_brains_rename
- jet_brains_safe_delete
- jet_brains_type_hierarchy

### cmd_tools
- execute_shell_command

### config_tools
- activate_project
- get_current_config
- open_dashboard
- remove_project
- switch_modes

### file_tools
- create_text_file
- delete_lines
- find_file
- insert_at_line
- list_dir
- read_file
- replace_content
- replace_lines
- search_for_pattern

### memory_tools
- delete_memory
- edit_memory
- list_memories
- read_memory
- rename_memory
- write_memory

### query_project_tools
- list_queryable_projects
- query_project

### workflow_tools
- check_onboarding_performed
- initial_instructions
- onboarding
- prepare_for_new_conversation
- summarize_changes
- think_about_collected_information
- think_about_task_adherence
- think_about_whether_you_are_done

## Bootstrap (Auto Install + Start)

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

## Workflow
1. Define concrete outcome and success criteria.
2. Bootstrap Serena MCP server if needed.
3. Activate project.
4. List/read relevant memories.
5. Reconfirm official Serena behavior if config schema, tool naming, or CLI behavior is uncertain.
6. Perform the smallest safe Serena-native change.
7. Run required validation and report evidence.
8. Write phase-end memory update.

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
- Keep guidance concise.
