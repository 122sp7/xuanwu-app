Scope:
- Added two new docs-only architecture files under docs/: bounded-context-subdomain-template.md and project-delivery-milestones.md.
- Updated docs/README.md as the docs index entrypoint.
- Updated .github/copilot-instructions.md to reference the two new docs as authoritative planning inputs.

Decisions / Findings:
- Kept to the user restriction for this task: no inspection of non-doc project code or non-doc repo content except .github/copilot-instructions.md and required governance/skill files.
- Used Context7 sources:
  - /sairyss/domain-driven-hexagon for layers, ports/adapters, application services, repository abstraction caution, and folder/use-case guidance.
  - /contextmapper/contextmapper.github.io for upstream/downstream, OHS/Published Language ownership, and ACL/Conformist semantics.
  - /joelparkerhenderson/architecture-decision-record for ADR timing, template expectations, and decisions as part of delivery planning.
- Chose docs/bounded-context-subdomain-template.md as the root-level delivery template for modules/<bounded-context>/subdomains/* scaffolding.
- Chose docs/project-delivery-milestones.md as the architecture-first milestone map from problem framing to release delivery.
- Updated docs/README.md to index both new docs and route Copilot to them before scaffolding or milestone planning.
- Updated .github/copilot-instructions.md to include both docs in DDD Reference Authority and Workspace-Wide Operating Rules.

Validation / Evidence:
- get_errors returned no errors for docs/bounded-context-subdomain-template.md, docs/project-delivery-milestones.md, docs/README.md, and .github/copilot-instructions.md.
- grep_search confirmed both new filenames are present in docs/README.md and .github/copilot-instructions.md.
- grep_search confirmed both new docs contain Mermaid diagrams and Document Network sections.

Deviations / Risks:
- The new docs are architecture-first delivery references, not proof that current modules in the repo conform to the template or milestone sequence.
- Existing document-network sections across other root docs were not globally expanded to include the two new files; only the index entrypoint and the new files' own network sections were updated, per task scope.

Open Questions:
- Whether the user wants a follow-up pass to propagate these two new docs into the wider root-doc Document Network sections.
- Whether file-scoped instructions should be added under .github/instructions/ to enforce using these two docs during module scaffolding or milestone planning.