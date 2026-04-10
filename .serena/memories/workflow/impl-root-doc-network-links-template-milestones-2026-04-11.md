Scope:
- Extended the two new docs links across the remaining root-level docs Document Network sections.
- Targeted docs/*.md strategic files only, not context docs or decisions docs.

Decisions / Findings:
- Added bounded-context-subdomain-template.md and project-delivery-milestones.md to the Document Network sections of:
  - docs/architecture-overview.md
  - docs/bounded-contexts.md
  - docs/context-map.md
  - docs/integration-guidelines.md
  - docs/subdomains.md
  - docs/strategic-patterns.md
  - docs/ubiquitous-language.md
- Kept the change minimal: only document-network discovery links, no additional prose or new governance rules.
- docs/README.md had already been updated in the prior task and was left as the primary index entrypoint.

Validation / Evidence:
- get_errors returned no errors for all edited root docs and docs/README.md.
- grep_search confirmed both new filenames appear across docs/*.md root strategic files after the patch.

Deviations / Risks:
- decisions/ and contexts/ document networks were not expanded in this follow-up because the user selected only the root-doc-network option.

Open Questions:
- Whether the user wants the same two docs propagated into decisions/README.md and selected ADR/root-context documents as second-order discovery links.