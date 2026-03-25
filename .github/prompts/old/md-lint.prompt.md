---
name: md-lint
description: Lint Markdown syntax, validate links, and enforce formatting consistency.
agent: md-writer
argument-hint: "Target file(s) to lint"
---

# md-lint — Linter & Validator

## Run First — Before Any Other md-* Prompt

## Syntax Checks

| Check | Rule |
|---|---|
| Headings | Space after `#`; no skipped levels (H1→H3 invalid) |
| Links `[]()` | `[]` not empty; `()` not empty; path exists |
| Code fences | Opening ` ``` ` has language tag; closing ` ``` ` on own line |
| Tables | Header row present; column count consistent; `|---|` separator row |
| Bold/Italic | `**text**` closed; no space inside markers |
| Lists | Consistent marker (`-` preferred); 2-space indent for nesting |
| Frontmatter | Valid YAML; `mode`, `tools`, `description` present in prompt files |

## Naming Conventions

| File Type | Pattern |
|---|---|
| Prompt files | `{verb}-{noun}.prompt.md` |
| Spec files | `{SYSTEM}-SPEC-{NUM}.md` |
| How-to guides | `how-to-{action}.md` |
| Agent configs | `{agent-name}.agent.md` |
| Index files | `README.md` or `INDEX.md` |

## Link Validation

```
1. Collect all [text](path) in file
2. Resolve relative to file location
3. Check file exists in repo
4. Flag: broken | external (http) | anchor-only (#) | valid
```

- Broken links → fix or remove
- External links → verify reachable; flag if domain suspicious
- Anchors → verify heading exists in target file

## Output Format

```md
## Lint Report — {filename}

| Line | Issue | Severity | Fix |
|---|---|---|---|
| 12 | Missing language tag on code fence | warn | Add `ts` |
| 34 | Broken link `../missing.md` | error | Remove or fix path |
```

Severity levels: `error` (must fix before other passes) · `warn` (fix in same pass) · `info` (optional)
