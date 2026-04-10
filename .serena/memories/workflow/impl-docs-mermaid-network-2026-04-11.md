Scope:
- Upgraded the 39 targeted docs files under docs/, docs/decisions/, and docs/contexts/.
- Added Copilot-oriented generation rules, Occam-style minimal-abstraction rules, dependency-direction Mermaid flowcharts, correct interaction Mermaid flowcharts, and explicit document-network link sections.

Decisions / Findings:
- Used /sairyss/domain-driven-hexagon as authority for inward dependency direction, framework-independent core, and warning against unnecessary abstractions.
- Used /contextmapper/contextmapper.github.io as authority for upstream/downstream semantics, Published Language/OHS as upstream responsibility, and ACL/Conformist as downstream-only choices.
- Kept all updates docs-only, per user restriction; no non-doc code or config files were read.
- Standardized a repeated docs pattern across all 39 files: Copilot Generation Rules + Dependency Direction Flow + Correct Interaction Flow + Document Network.
- Added explicit Occam guardrails so docs steer Copilot toward the smallest abstraction that still protects boundaries.

Validation / Evidence:
- grep_search found 39 occurrences of '## Copilot Generation Rules'.
- grep_search found 39 occurrences of '## Document Network'.
- grep_search found 78 Mermaid blocks, matching two diagrams per targeted file.
- get_errors on d:\GitHub\122sp7\xuanwu-app\docs returned no errors.

Deviations / Risks:
- The diagrams and rules are architecture-first and Context7-based; they do not prove implementation conformance.
- Relative document links were added broadly; they are intended as a docs network, not as a claim that every linked doc is the sole authoritative source for every detail.

Open Questions:
- Whether the same Copilot Generation Rules should now be propagated into .github/instructions and copilot-instructions for runtime enforcement.
- Whether the user wants a second pass to compress wording and reduce duplication across the 39 docs while keeping the same network and diagram structure.