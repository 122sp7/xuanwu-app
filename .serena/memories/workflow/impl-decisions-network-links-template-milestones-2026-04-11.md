Scope:
- Extended the new docs links into the decisions layer.
- Updated docs/decisions/README.md and ADRs 0001 through 0005.

Decisions / Findings:
- Added ../bounded-context-subdomain-template.md and ../project-delivery-milestones.md to the Document Network sections of the decisions index and all five root ADRs.
- Kept the change minimal and discoverability-focused; no new rule text or structural prose was added.
- This complements the previous root-doc-network update so both strategic docs and decisions docs can route readers back to the template and milestone references.

Validation / Evidence:
- get_errors returned no errors for docs/decisions/README.md and ADRs 0001-0005.
- grep_search confirmed both new filenames now appear across docs/decisions/*.md.

Deviations / Risks:
- Context-level docs under docs/contexts/* were not modified in this follow-up because the request was the next suggested step for the decisions layer.

Open Questions:
- Whether the user wants a final pass to add the same two links to selected docs/contexts/*/README.md or AGENT.md files for third-order discoverability.