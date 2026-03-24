---
mode: agent
tools: [markitdown, filesystem]
description: Orchestrate full Markdown optimization pipeline (Leaf → Root)
---

# md-optimize — Master Pipeline

## Scope

```
.github/{agents,copilot,hooks,instructions,ISSUE_TEMPLATE,prompts,rules,skills,workflows}
.github/{copilot-instructions.md,README.md}
docs/{decision-architecture,development-reference,diagrams-events-explanations,how-to-user,index.js,README.md}
```

## Execution Order (Leaf → Root)

```
1. Leaf documents        → md-compress + md-dedup + md-rules + md-lint
2. Folder README/INDEX   → md-index + md-structure
3. docs/README.md        → md-index + md-structure
4. .github/README.md     → md-index + md-structure
5. Root README.md        → md-index + md-structure
```

> ⚠️ Never process parent before children — broken references cascade upward.

## Per-File Checklist

- [ ] Run `md-lint` → fix syntax errors first
- [ ] Run `md-compress` → reduce token count
- [ ] Run `md-dedup` → remove duplicate concepts
- [ ] Run `md-rules` → convert prose to rules/tables
- [ ] Run `md-structure` → enforce format hierarchy
- [ ] Update parent `md-index` after all children done

## Success Metrics

| Metric | Target |
|---|---|
| Token Efficiency | ↓ tokens, same info |
| Information Density | ↑ info per line |
| Computational Efficiency | simpler parse tree |
| Throughput | faster AI scan |
