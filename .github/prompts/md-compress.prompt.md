---
mode: agent
tools: [markitdown]
description: Compress Markdown files — reduce token count while preserving full information
---

# md-compress — Token Compressor

## Compression Targets

| Pattern | Action |
|---|---|
| "In order to" | → "To" |
| "It is important to note that" | → delete or bold key point |
| "The following is a list of" | → delete; use list directly |
| "Please note that" | → delete |
| "As mentioned above/below" | → delete or direct link |
| Long intro paragraph | → one-line purpose statement |
| Repeated section titles in prose | → remove; H2 is sufficient |
| `**Note:**` prose blocks | → table row or callout rule |
| Example then re-explanation | → example only (self-evident) |

## Compression Techniques

1. **Nominalize verbs** — "performs validation" → "validates"
2. **Remove hedging** — "might potentially", "in some cases" → omit or specify
3. **Collapse repetition** — if concept appears twice, keep once + link
4. **Extract constants** — repeated values → single definition at top
5. **Inline short explanations** — parenthetical beats a new paragraph
6. **Drop obvious context** — don't explain what a README is

## Token Budget Rules

| Doc category | Max lines |
|---|---|
| Leaf spec | 80 |
| Folder README | 40 |
| Root README | 60 |
| Agent prompt | 50 |
| How-to guide | 60 |

> Exceed budget → split into linked sub-documents.

## Validation

After compression, verify:
- [ ] No information loss (diff original concepts)
- [ ] All code blocks intact
- [ ] All links valid
- [ ] Token count ↓ vs original
