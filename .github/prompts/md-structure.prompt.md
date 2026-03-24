---
mode: agent
tools: [markitdown, filesystem]
description: Enforce consistent document structure hierarchy across all MD files
---

# md-structure — Structure Enforcer

## Document Hierarchy (Priority Order)

```
Index / Map          ← highest value
Rules Table          ← second
Checklist            ← third
Short Sentences      ← fourth
Paragraphs           ← avoid
```

## Required Sections by Type

| Doc Type | Required Sections |
|---|---|
| Feature spec | Purpose · Rules · API/Schema · Checklist |
| Architecture | Map · Components · Data Flow · Constraints |
| How-to | Trigger · Steps (numbered) · Validation |
| Agent/Prompt | mode · tools · description · Rules |
| README | Index table · Map · Quick links |

## Format Rules

- H1: document title only (one per file)
- H2: major sections
- H3: subsections (max depth = 3)
- No H4+ — flatten or split file instead
- Code blocks: always specify language
- Tables: header row required, align with `|---|`
- Lists: use `-` not `*`; max 2 levels deep
- Links: relative paths only within repo

## Transformation Map

| Input Pattern | Target Structure |
|---|---|
| Multi-paragraph explanation | H2 + rules table |
| Numbered how-to paragraphs | Numbered list + code block |
| "There are X types of..." | Table with type column |
| Nested bullet > 2 levels | Split into subsections |
| Inline code in prose | Extract to code block |
