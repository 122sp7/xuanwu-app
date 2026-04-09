## Phase: review
## Task: audit root-cause drift after DDD doc sync
## Date: 2026-04-06

### Scope
- Audited canonical DDD entrypoints, llms router, module markdown links, and stale wiki/knowledge-graph references in code/docs.

### Decisions / Findings
- Repository-wide instructions referenced removed strategic docs paths; global strategic sources should point to `modules/subdomains.md` and `modules/bounded-contexts.md`.
- Module markdown contained many broken strategic references propagated from old sources.
- Stale topology remained in live code/comments: modules/wiki and knowledge-graph references still appeared despite current module inventory not including wiki.

### Validation / Evidence
- list_dir docs/ showed no strategic DDD folder.
- grep_search found multiple stale strategic references inside `modules/**/*.md` and stale wiki/knowledge-graph remnants in modules/**.

### Deviations / Risks
- Repomix-generated skill references may preserve stale strategic routing until regenerated from corrected sources.
- Some stale references are only comments/docs, but they can still misroute future agents and reviewers.

### Open Questions
- Whether strategic ownership is now permanently settled on module-level entrypoints or will be relocated again.