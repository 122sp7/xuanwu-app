---
name: vscode-copilot-skillbook
description: Route VS Code Copilot and customization questions to the right skill. Use when the user wants a skillbook for agents, customizations, context engineering, testing, debugging, TypeScript workflows, or tasks authoring in VS Code.
user-invocable: true
disable-model-invocation: true
---

# vscode-copilot-skillbook (Condensed)

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
