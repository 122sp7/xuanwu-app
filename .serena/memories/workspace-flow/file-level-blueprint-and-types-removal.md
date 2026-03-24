## Phase: impl
## Task: workspace-flow file-level blueprint
## Date: 2026-03-25

### Scope
- Expanded workspace-flow AGENT.md from folder-only guidance to concrete file-level blueprint
- Updated README.md and Workspace-Tree-Flow.mermaid to match file-level implementation design
- Updated Workspace-Flow.mermaid to reinforce api-only external usage
- Deleted legacy types/*.ts files

### Decisions / Findings
- workspace-flow is treated as a logic-first module with external UI composition
- api/index.ts remains the only allowed cross-module entry
- AGENT.md now contains concrete file names for api, domain, application, infrastructure, and optional interfaces
- legacy types files are removed and documented as non-recreatable migration input

### Validation / Evidence
- Workspace-Tree-Flow.mermaid rendered successfully after file-level updates
- grep confirmed no active references to workspace-flow/types before deletion

### Deviations / Risks
- The empty legacy types directory may still remain on disk because terminal directory removal was denied by command policy

### Open Questions
- none