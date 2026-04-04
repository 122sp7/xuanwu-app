# Xuanwu Engineering Rules Index

This folder stores machine-readable engineering rules for Xuanwu MDDD delivery.

## Rule organization

Rules are grouped by filename prefix defined in `_sections.md`.

| Prefix | Section | Impact |
| --- | --- | --- |
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

## Core files

- `_sections.md`: section order and impact model.
- `_template.md`: base template for new rules.
- `{section}-{rule-name}.md`: individual rule files.

## Authoring flow

1. Copy `_template.md` to a new file with the correct prefix.
2. Fill frontmatter (`title`, `impact`, `tags`).
3. Add concise rationale.
4. Add incorrect and correct examples.
5. Add a reference when relevant.

## Boundary principle

Follow module-driven boundaries: modules are isolated bounded contexts, cross-module access goes through target `api/`, and shared concerns go through package aliases.
