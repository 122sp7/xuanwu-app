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
- In this repo, `included_optional_tools` entries like `serena/*` or `context7/*` are not valid for direct SerenaAgent initialization in the current environment; verify concrete tool names first.

## Memory Structure
- Reserve protected root memories for stable baseline concepts such as project overview, architecture, coding conventions, task completion, and Serena tool reference.
- Use `index/` for sync snapshots, memory maps, and current-state navigation.
- Use `workflow/` for dated phase logs, maintenance notes, and execution evidence.
- Use `_archive/` only for stale or superseded historical memories that should remain traceable but not treated as active guidance.
- If protected core memory names cannot be recreated immediately, write clearly named replacement memories and point `index/` memories at them until canonical restoration is possible.

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

## Workflow
1. Define concrete outcome and success criteria.
2. Bootstrap Serena MCP server if needed.
3. Activate project.
4. List/read relevant memories.
5. Reconfirm official Serena behavior if config schema, tool naming, or CLI behavior is uncertain.
6. Perform the smallest safe Serena-native change.
7. Run required validation and report evidence.
8. Write phase-end memory update.

## Validation
- Use `serena tools list` to confirm concrete tool names before changing project-level tool configuration.
- Use `serena project index` after large syncs, memory cleanup phases, or repo-wide structural corrections.
- Use `serena project health-check` when configuration repair is part of the task, and record blockers if the command fails.
- Re-read updated memories after changes so the final state is verified, not inferred.

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
- Prefer fixing Serena drift at the source, but do not claim full repair when only replacement memories or partial index refresh were possible.
