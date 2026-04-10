Scope:
- Updated the 39 targeted docs files under docs/, docs/decisions/, and docs/contexts/.
- Added anti-pattern / prohibited behavior rules and explicit dependency-direction guidance aligned to Hexagonal Architecture with Domain-Driven Design.

Decisions / Findings:
- Used /sairyss/domain-driven-hexagon as authority for inward dependency direction, framework-independent domain core, and port/adapter boundaries.
- Used /contextmapper/contextmapper.github.io as authority for upstream/downstream semantics, ACL vs Conformist exclusivity, and symmetric relationship contradictions.
- Used /joelparkerhenderson/architecture-decision-record as authority for ADR structure and explicit consequences/conflict framing.
- Applied the anti-pattern guidance at four levels: strategic docs, ADRs, per-context docs, and context template.
- Standardized repeated guardrails: interfaces -> application -> domain <- infrastructure, API-boundary-only cross-context integration, no framework leakage into domain, no ownership drift, and no mixing ACL/Conformist with symmetric relations.

Validation / Evidence:
- apply_patch updated all requested files successfully in four batches.
- get_errors on d:\GitHub\122sp7\xuanwu-app\docs returned no errors.
- grep_search confirmed anti-pattern/dependency-direction sections exist across the updated docs set.
- grep_search found no patch marker residue in docs/**/*.md.

Deviations / Risks:
- The new rules are architecture-first and Context7-based; they are not proof that the implementation already conforms.
- Some other markdown files under modules/**/docs also mention dependency direction, but this task only changed the 39 requested docs files.

Open Questions:
- Whether the user wants the same anti-pattern rule language propagated into .github/instructions or copilot governance files next.
- Whether the user wants a follow-up pass to make the wording even more terse and imperative across all 39 docs.