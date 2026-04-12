# Scope
- Performed governance-level conflict scan for subdomain folder rules across docs, instructions, AGENTS alignment, and skill snapshots.

# Findings
1. docs/bounded-context-subdomain-template.md defines subdomain mini-module gate: default core-only; infrastructure/interfaces conditional.
2. .github/instructions/subdomain-rules.instructions.md still had hard prohibition of infrastructure/interfaces and old one-line summary.
3. xuanwu-markdown-skill snapshot could retain stale wording if not regenerated after governance edits.

# Root Cause
- Documentation authority evolved to conditional mini-module gate, but instruction-layer rule remained stale (governance drift).
- Generated skill snapshot not refreshed after rule update, risking stale retrieval guidance.

# Fix Chain
- Updated subdomain-rules Hard Rules to:
  - default allow api/domain/application with optional ports,
  - conditionally allow infrastructure/interfaces via mini-module gate,
  - forbid infrastructure/interfaces only when gate is unmet.
- Updated one-line summary to mini-module-exception wording.
- Regenerated markdown repomix skill via npm run repomix:markdown.

# Validation
- Targeted grep on docs + .github/instructions confirms mini-module gate language is consistent.
- Targeted grep on .github/skills confirms old strict summary string no longer present.
- AGENTS.md scanned for contradictory subdomain hard-prohibition wording: none found.

# Notes
- Repository working tree reports clean after operations; final authoritative state is validated by current file content and search evidence.
