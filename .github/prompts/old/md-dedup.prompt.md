---
name: md-dedup
description: Detect and remove duplicate concepts across and within Markdown files.
agent: md-writer
argument-hint: "Target docs folder and canonicalization preference"
---

# md-dedup — Deduplication Engine

## Scope

- **Intra-file**: same concept repeated in multiple sections
- **Cross-file**: same concept defined in multiple documents

## Detection Rules

| Signal | Action |
|---|---|
| Identical heading in 2+ files | Consolidate to canonical file; replace others with link |
| Same code block in 2+ files | Extract to shared snippet file; link both |
| Same rule stated differently | Pick clearest; delete rest |
| Same table with different formatting | Merge; keep most complete version |
| Concept explained then re-explained in example | Keep example; delete explanation |

## Canonical Source Strategy

```
1. Identify most authoritative file for each concept
2. Keep full definition there
3. Replace all other occurrences with:
   > See: [Concept Name](../path/to/canonical.md#section)
4. Update md-index cross-reference table
```

## Priority for Canonical Location

| Concept Type | Canonical Location |
|---|---|
| Architecture decisions | `docs/decision-architecture/` |
| Dev conventions | `.github/copilot-instructions.md` |
| Agent behaviors | `.github/agents/` |
| Workflow steps | `.github/workflows/` |
| API / schema | `docs/development-reference/` |

## Output

For each dedup action, append to dedup log:

```
| Removed from | Canonical at | Concept |
|---|---|---|
| file-a.md | file-b.md#section | Firestore path rules |
```
