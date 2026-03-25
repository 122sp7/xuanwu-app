---
name: md-index
description: Generate or update README/INDEX files after leaf docs are optimized.
agent: md-writer
argument-hint: "Target folder for index generation"
---

# md-index — Index Generator

## Trigger

Run after all leaf documents in a folder are optimized.

## Output Format

```md
# {Folder} Index

## Documents
| File | Purpose | Key Concepts |
|---|---|---|
| `file.md` | one-line purpose | concept, concept |

## Map
{ASCII tree of folder structure}

## Cross-References
| Source | → Target | Reason |
|---|---|---|
```

## Rules

- One row per document — no paragraphs
- Purpose ≤ 10 words
- Key concepts ≤ 3 tags per file
- Link all cross-folder references explicitly
- Merge old INDEX content; never overwrite without diff check
- Remove dead links (files that no longer exist)

## Anti-Patterns

| Bad | Good |
|---|---|
| Long prose intro | One-line description |
| Nested bullet lists | Table rows |
| Repeated folder path | Relative link only |
| "This document explains..." | Direct noun phrase |
