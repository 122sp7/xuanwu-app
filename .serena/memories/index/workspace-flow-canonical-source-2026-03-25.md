## Phase: maintenance
## Task: workspace-flow canonical source index refresh
## Date: 2026-03-25

### Scope
- Create a single index memory to reduce retrieval ambiguity for workspace-flow docs

### Decisions / Findings
- Source-of-truth order for workspace-flow architecture decisions:
  1) modules/workspace-flow/AGENT.md (target module shape and boundary rules)
  2) modules/workspace-flow/README.md (state-machine narrative and module positioning)
  3) modules/workspace-flow/Workspace-Flow-Tree.mermaid (visual boundary and layer map)
  4) Remaining Mermaid suite for complementary views (states/sequence/erd/architecture/permissions/events/lifecycle/ui/flow)
- Cross-module consumption rule: only via @/modules/workspace-flow/api.
- Legacy types/* are removed and must not be recreated as public surface.

### Validation / Evidence
- All canonical diagram files exist in modules/workspace-flow root.
- References in AGENT.md and README.md now align with canonical file names.

### Deviations / Risks
- Planned implementation files/folders (api/application/domain/infrastructure/interfaces/index.ts) are target-state, not present-state.

### Open Questions
- none