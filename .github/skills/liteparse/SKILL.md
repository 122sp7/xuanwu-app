---
name: liteparse
description: Use this skill when the user asks to parse, perform multi-format document conversion or spatially extract text from an unstructured file (PDF, DOCX, PPTX, XLSX, images, etc.) locally without cloud dependencies.
compatibility: Requires Node 18+ and `@llamaindex/liteparse` installed globally via npm (`npm i -g @llamaindex/liteparse`)
license: MIT
metadata:
  author: LlamaIndex
  version: "0.1.0"
disable-model-invocation: true
---

# liteparse (Condensed)

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
