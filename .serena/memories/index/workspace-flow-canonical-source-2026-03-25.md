## Phase: maintenance
## Task: workspace-flow canonical source index refresh (post-cleanup)
## Date: 2026-03-25

### Scope
- Consolidate workspace-flow source-of-truth memory
- Remove stale memories that still reference deprecated diagram names or pre-canonical assumptions

### Decisions / Findings
- Canonical authority order for workspace-flow docs:
  1) modules/workspace-flow/AGENT.md
  2) modules/workspace-flow/README.md
  3) modules/workspace-flow/Workspace-Flow-Tree.mermaid
  4) modules/workspace-flow/Workspace-Flow-UI.mermaid
  5) Remaining Mermaid set for complementary views (Flow/States/Sequence/ERD/Architecture/Permissions/Events/Lifecycle)
- Cross-module access remains strict: external consumers import only via @/modules/workspace-flow/api.
- Legacy types/ is removed and must not be recreated as an external boundary.

### Validation / Evidence
- Canonical files are present in modules/workspace-flow module root.
- AGENT.md and README.md describe the same module positioning: logic-first bounded context, UI composed outside module.

### Deviations / Risks
- Documented module shape remains target-state blueprint; implementation folders/files may still be incomplete.
- README event labels are simplified and should be normalized during implementation.

### Open Questions
- none