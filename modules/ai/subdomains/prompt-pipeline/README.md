# prompt-pipeline subdomain

## Purpose

The prompt-pipeline subdomain owns reusable prompt, flow, and tool-calling semantics for AI-assisted workflows.
It is a pure bounded-context capability inside `modules/ai` and does not call any provider SDK directly.

## Responsibility

- define prompt-pipeline intents in domain language
- provide a typed registry for prompt families, template keys, and manual vs workflow variants
- resolve prompt text for downstream consumers such as workspace and notebooklm

A single prompt-pipeline subdomain may contain many prompt templates. The capability stays singular because the business boundary is shared prompt orchestration, not one folder per prompt.

## Non-Responsibility

- no Genkit runtime calls in this prompt-pipeline root
- no React components
- no Firebase or storage access
- no domain-state mutation in workspace or notebooklm

## Current prompt-pipeline capabilities

- `source-ocr`
- `source-rag-index`
- `source-knowledge-page`
- `source-task-materialization`

## Dependency direction

`api -> application -> domain`

Outer runtimes may consume this prompt-pipeline subdomain through the public API only:

- workspace UI may read prompt metadata for button hints
- notebooklm flows may resolve prompt payloads before calling provider adapters
