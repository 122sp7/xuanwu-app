## Phase: plan
## Task: normalize 40 knowledge docs with Notion logic
## Date: 2026-04-06

### Scope
- Planning only for 40 files across knowledge, knowledge-base, knowledge-collaboration, knowledge-database.
- No implementation edits in this phase.

### Decisions / Findings
- Context7 was used with `/websites/notion_help` and topics: sidebar navigation, workspaces, sharing/permissions.
- User decisions captured:
  - D1: `KnowledgeCollection(spaceType="database")` => knowledge-database sole ownership.
  - D2: Page archive => cascade archive but recoverable.
  - D3: Promote(Page->Article) => knowledge-base owns protocol; knowledge emits event.
- Discovery indicates high-risk drift in context-map/README ownership wording.

### Validation / Evidence
- Context7 resolve + docs fetch completed.
- Explore subagent delivered 40-file inventory and risk map for sequencing.
- Session plan updated at `/memories/session/plan.md`.

### Deviations / Risks
- Explore report line references may require re-check during implementation before patching.
- D1 has larger compatibility impact; migration notes required before contract updates.

### Open Questions
- none
