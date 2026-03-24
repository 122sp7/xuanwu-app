## Phase: impl
## Task: workspace-flow mermaid
## Date: 2026-03-25

### Scope
- Created modules/workspace-flow/Workspace-Flow.mermaid
- Limited source material to workspace-flow README and types files only

### Decisions / Findings
- Used core.ts and transitions.ts event/status names as the canonical naming source
- Kept README guard rules and cross-flow semantics where types do not encode them directly
- Represented Task, Issue, Invoice as separate state machines with cross-flow links and Firestore collection mapping

### Validation / Evidence
- Mermaid markup rendered successfully via renderMermaidDiagram

### Deviations / Risks
- README event labels PASS/APPROVE differ from typed event names PASS_QA/APPROVE_ACCEPTANCE; diagram follows typed names

### Open Questions
- none