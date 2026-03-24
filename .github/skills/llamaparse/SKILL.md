---
name: llamaparse
description: Parse unstructured files (PDF, PPTX, DOCX, XLSX, etc.) via LlamaParse and return requested output formats.
compatibility: Needs LLAMA_CLOUD_API_KEY in environment and @llamaindex/llama-cloud installed.
license: MIT
metadata:
  author: LlamaIndex
  version: "1.0.0"
disable-model-invocation: true
---

# llamaparse (Condensed)

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
