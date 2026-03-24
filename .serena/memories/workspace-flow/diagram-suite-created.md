## Phase: maintenance
## Task: refresh workspace-flow diagram suite memory
## Date: 2026-03-25

### Scope
- Replace older workspace-flow diagram memory with current canonical state

### Decisions / Findings
- Canonical diagram set is fixed at 10 files: Workspace-Flow, Tree, UI, States, Sequence, ERD, Architecture, Permissions, Events, Lifecycle.
- Tree diagram naming and node examples are aligned with AGENT.md target structure (interfaces/contracts/queries/_actions + kebab-case DTO/use-case examples).
- No legacy Workspace-Tree-Flow naming should be treated as active.

### Validation / Evidence
- Current module root contains AGENT.md, README.md, and all canonical diagram files.
- AGENT.md and README.md list the same root doc tree.

### Deviations / Risks
- Diagram suite is documentation target-state; implementation directories/files are still planned-state.

### Open Questions
- none