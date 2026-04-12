Scope: Canonical condensed record for AGENTS.md remediation outcomes on 2026-04-12.

Decisions/Findings:
- AGENTS.md authority is valid; core violations were in code boundaries, not doc intent.
- Violation #2 (NotionKnowledgePageGateway cross-domain infra dependency) was fixed by constructor injection + API-layer composition binding.
- Violation #3 (workspace/audit ActorId language mapping ambiguity) was fixed via explicit published-language JSDoc mapping.
- Violation #1 (notebooklm/ai ownership conflict with platform-only AI rule) remained a staged migration item; anti-spread guardrails and partial decoupling slices were applied.

Validation/Evidence:
- Lint passed with no new boundary regressions for the completed slices.
- Boundary warnings were reduced in remediation phases; remaining issues were composition-root cross-subdomain couplings.

Deviations/Risks:
- notebooklm/ai physical removal was not fully completed in the recorded slices.
- Some prior progress memories are superseded by this canonical summary.

Open Questions:
- When to execute full notebooklm/ai removal and final API/server export migration in one controlled phase.
