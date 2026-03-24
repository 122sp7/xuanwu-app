## Phase: impl
## Task: workspace-flow tree mermaid
## Date: 2026-03-25

### Scope
- Filled modules/workspace-flow/Workspace-Tree-Flow.mermaid
- Designed target module tree around an explicit api boundary

### Decisions / Findings
- External consumers must enter modules/workspace-flow only through api/index.ts
- Current types files were mapped into target MDDD layers rather than kept as a flat public types folder
- domain owns models/core/transitions, application owns service contracts/examples/query DTOs, infrastructure owns Firestore-specific records

### Validation / Evidence
- Mermaid markup rendered successfully
- Diagram explicitly marks forbidden direct imports into domain/application/infrastructure/interfaces

### Deviations / Risks
- Diagram is a target structure design, not a completed file-system refactor

### Open Questions
- none