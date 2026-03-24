## Serena MCP Enforcement Rules (xuanwu-app)

### Mandatory rules

- All GitHub Copilot agents must use Serena MCP tools — `serena/activate_project` is required at the start
  of every delivery phase (Planner, Implementer, Reviewer, QA).
- Memory updates and index updates must be executed via Serena MCP tools **only**.
  No file-editing tool (`edit`, `create`, `write`, `replace_lines`, `insert_at_line`, `delete_lines`)
  may be used on any path under `.serena/`.
- Phase-end update is mandatory: every stage must call `serena/write_memory` and `serena/summarize_changes`
  before handing off to the next stage.

### .serena/ directory protection

- `.serena/` is a protected directory.  All changes must go through:
  - `serena/write_memory` — create or update a memory entry
  - `serena/delete_memory` — remove a stale memory entry
  - `serena/create_text_file` — create a new skill/config file inside `.serena/`
- Direct file edits are prohibited.  If `serena/write_memory` is unavailable, report `blocked`.
- Core memories listed in `read_only_memory_patterns` (project.yml) require an explicit
  delete + rewrite cycle — never an in-place overwrite.

### Phase-end execution order

1. `serena/activate_project`
2. `serena/list_memories` — identify stale entries
3. `serena/write_memory` — record phase completion (scope, decisions, delta)
4. `serena/delete_memory` — remove confirmed stale entries
5. `serena/summarize_changes` — generate phase summary

### Memory naming convention

| Phase          | Memory name pattern            |
|----------------|-------------------------------|
| Planning       | `workflow/plan-{task-id}`      |
| Implementation | `workflow/impl-{task-id}`      |
| Review         | `workflow/review-{task-id}`    |
| QA             | `workflow/qa-{task-id}`        |
| Maintenance    | `workflow/maintenance-{date}`  |

### Additional operational rules

- URL-first and no-detour: if user provides a target URL/flow, execute that exact path first;
  no side exploration unless user approves.
- Playwright execution rule: for UI tasks, use Playwright MCP for direct action completion,
  not exploratory diagnostics by default.
- Post-fix hygiene: after major fixes, perform Serena memory/index refresh in the same turn.

### Reference

See `.github/skills/serena-mcp/SKILL.md` for the full policy, tool reference, and activation workflow.
