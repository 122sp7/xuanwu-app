## Phase: maintenance
## Task: Serena canonical core-memory replacements
## Date: 2026-04-06

### Scope
- Preserve corrected project baseline facts even though protected core memory names could not be recreated directly.
- Ensure future Serena sessions have explicit replacement targets for project overview and architecture context.

### Decisions / Findings
- Protected names `project_overview` and `architecture` were readable and renameable away from their original names, but recreating or renaming back into those exact names was blocked by Serena read-only naming rules in the current tool surface.
- Corrected authoritative replacements were written as `project_overview_current` and `architecture_current`.
- Archived stale copies were kept as `_archive/project_overview-stale-2026-04-06` and `_archive/architecture-stale-2026-04-06` for traceability.

### Validation / Evidence
- Serena `read_memory` confirmed corrected content in `project_overview_current` and `architecture_current`.
- Serena `list_dir` confirmed the replacement and archive memory files exist under `.serena/memories/`.

### Deviations / Risks
- The original protected memory names are currently absent, so sessions that assume those exact names exist may need to consult `index/project-sync-2026-04-06` first.
- Full canonical-name restoration likely requires a Serena tool surface that exposes delete/recreate or project-config repair capabilities.

### Open Questions
- none