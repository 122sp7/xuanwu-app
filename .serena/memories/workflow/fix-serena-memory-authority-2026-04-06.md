## Phase: impl
## Task: fix memory authority path
## Date: 2026-04-06

### Scope
- Corrected a prior mistake where part of the update was written to generic external memory instead of Serena project memory.

### Decisions / Findings
- For repository-authoritative orchestration memory, use Serena `write_memory` rather than generic `/memories/*` notes.
- Generic memory can still hold Copilot-side notes, but it is not a substitute for Serena project memory in this repo.

### Validation / Evidence
- Wrote this correction as a Serena project memory entry under `.serena/memories/workflow/`.

### Deviations / Risks
- None.

### Open Questions
- None.