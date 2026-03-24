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

# LlamaParse Skill (Condensed)

## Preconditions

Confirm before execution:
- `LLAMA_CLOUD_API_KEY` is set
- `@llamaindex/llama-cloud` is installed

If missing package:
- `npm install @llamaindex/llama-cloud@latest`

## Core Pattern

Use two-step flow:
1. Upload file -> get `file_id`
2. Parse using `file_id`

Always use top-level `LlamaCloud` client.

## Parse Defaults

- Default tier: `agentic`
- Always set `expand` explicitly (`text_full`, `markdown_full`, `items`, etc.)
- Guard nullable fields: `result.text_full ?? ""`

## Minimal Script Requirements

- Include node shebang
- Read file -> create `File` -> `client.files.create()` -> `client.parsing.parse()`
- Use nested option blocks (`input_options`, `output_options`, `processing_options`, `agentic_options`) only when requested

## Images

If requesting `images_content_metadata`, download presigned URLs with Bearer auth using `LLAMA_CLOUD_API_KEY`.

## Execution Flow

1. Show generated TypeScript script.
2. Ask permission before running.
3. Execute and return results per user request.

## Guardrails

- Do not parse before preconditions are confirmed.
- Do not omit `expand`.
- Keep script minimal and task-specific.
