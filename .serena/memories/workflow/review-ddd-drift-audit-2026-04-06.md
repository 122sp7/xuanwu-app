## Phase: review
## Task: audit root-cause drift after DDD doc sync
## Date: 2026-04-06

### Scope
- Audited canonical DDD entrypoints, llms router, module markdown links, and stale wiki/knowledge-graph references in code/docs.

### Decisions / Findings
- Repository-wide instructions still treat docs/ddd as the canonical DDD surface, but docs/ddd is absent from the live docs tree.
- Only docs/architecture/bounded-contexts.md was found as a bounded-context map under docs/.
- Module markdown now contains many links to nonexistent docs/ddd paths; sync propagated broken canonical references into modules.
- Stale topology remains in live code/comments: modules/wiki and knowledge-graph references still appear despite current module inventory not including wiki.

### Validation / Evidence
- list_dir docs/ shows no ddd/ directory.
- file_search found docs/architecture/bounded-contexts.md but no docs/**/subdomains.md.
- grep_search found 34 docs/ddd references inside modules/**/*.md and multiple wiki/knowledge-graph remnants in modules/**.

### Deviations / Risks
- Repomix-generated skill references likely preserve stale docs/ddd routing until regenerated from corrected sources.
- Some stale references are only comments/docs, but they can still misroute future agents and reviewers.

### Open Questions
- Was docs/ddd intentionally removed in favor of docs/architecture + modules/*.md, or is the migration incomplete?
