## Phase: plan
## Task: platform hexagonal markdown docs
## Date: 2026-04-09

### Scope
- Plan only for modules/platform root markdown files
- Requested files: AGENT.md, aggregates.md, application-services.md, bounded-context.md, context-map.md, domain-events.md, domain-services.md, README.md, repositories.md, subdomains.md, ubiquitous-language.md
- Excludes global DDD docs, code implementation, and folder renames

### Decisions / Findings
- User requires Context7 as the only fact source; do not use existing repo code/docs as content source
- Context7 has no official Cockburn hexagonal architecture handbook entry; available sources are demo/sample projects
- Accepted source posture: derive ports/adapters structure from Context7 demo docs and write files as architecture blueprint
- modules/platform files are currently empty/skeleton, so future docs must avoid claiming existing implementation

### Validation / Evidence
- Queried Context7 for hexagonal architecture / ports and adapters candidates
- Reviewed two Context7 sources: /alicanakkus/modular-architecture-hexagonal-demo-project and /dasiths/portsandadapterspatterndemo
- Saved comprehensive execution plan to /memories/session/plan.md

### Deviations / Risks
- Local platform docs remain non-canonical relative to global inventory because user excluded global strategic sync
- Context7 sources are demo projects, not canonical theory docs

### Open Questions
- None for current plan scope; user explicitly narrowed scope to modules/platform only