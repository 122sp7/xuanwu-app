---
name: xuanwu-development-contracts
description: 'Follow Xuanwu''s contract-first development workflow. Use when modifying workflows with explicit contracts, including RAG ingestion, parser, schedule, daily, acceptance, billing, and audit. Triggers include runtime boundaries, state transitions, invariants, and acceptance gates. Helps find the right contract first and align code to it.'
disable-model-invocation: true
---

# xuanwu-development-contracts (Condensed)

## Scope
Use this skill only when the request clearly matches its description/frontmatter.

## Workflow
1. Define the concrete outcome and success criteria in one short block.
2. Collect only the minimum files/docs needed for that outcome.
3. Implement the smallest safe change that satisfies the request.
4. Validate with project-required commands and report evidence.

## Output Contract
- State owner/boundary impact (module, runtime, or integration).
- List changed files and why each changed.
- Report validation results and residual risk.

## Guardrails
- Do not duplicate repository-global policy text from AGENTS or copilot instructions.
- Do not copy long handbooks into responses; reference canonical docs instead.
- Keep examples short and directly executable.

## Anti-Noise
- Prefer checklist-style guidance over long prose.
- Keep this file focused on skill-specific execution intent.
- Remove repeated conceptual background that exists elsewhere.
