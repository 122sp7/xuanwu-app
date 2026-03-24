# Xuanwu MDDD Engineering Rules

This directory contains modular, machine-readable engineering rules for the xuanwu-app Module-Driven Domain Design architecture.

## Structure

Rules are organized by section prefix, as defined in `_sections.md`:

| Prefix | Section | Impact |
|--------|---------|--------|
| `architecture-` | Architecture | CRITICAL |
| `quality-` | Code Quality | CRITICAL |
| `data-` | Data Layer | HIGH |
| `api-` | API Design | HIGH |
| `performance-` | Performance | HIGH |
| `testing-` | Testing | MEDIUM-HIGH |
| `patterns-` | Design Patterns | MEDIUM |
| `culture-` | Team Culture | MEDIUM |
| `ci-` | CI/CD | HIGH |
| `reference-` | Reference | LOW |

## Files

- `_sections.md` — Defines all sections, their ordering, and impact levels
- `_template.md` — Template for creating new rules
- `{section}-{rule-name}.md` — Individual rule files

## Rule Format

Each rule file follows a consistent format with YAML frontmatter:

```markdown
---
title: Rule Title Here
impact: CRITICAL | HIGH | MEDIUM | LOW
impactDescription: Optional description (e.g., "Prevents architecture erosion")
tags: tag1, tag2, tag3
---

## Rule Title Here

**Impact: LEVEL (optional description)**

Brief explanation of the rule and why it matters.

**Incorrect (description):**
\`\`\`typescript
// Bad code example
\`\`\`

**Correct (description):**
\`\`\`typescript
// Good code example
\`\`\`

Reference: [Link](https://example.com)
```

## Adding New Rules

1. Copy `_template.md` to a new file with the appropriate section prefix
2. Fill in the frontmatter (title, impact, tags)
3. Write a clear explanation using xuanwu-app examples
4. Provide incorrect and correct code examples
5. Add a reference link if applicable

## Core Principles

> The architecture is **module-driven, not layer-driven**. Every business capability is a self-contained module. Modules communicate through each target domain's `api/` boundary, never by reaching into each other's internals. Packages are stable public boundaries for shared concerns.
