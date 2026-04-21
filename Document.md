# Documentation Routing Standard

Use this file as a short routing map.
Keep detailed authority in the owning documents instead of duplicating long guidance here.

## Read Order

1. `.github/copilot-instructions.md`
2. `docs/README.md`
3. `.github/instructions/docs-authority-and-language.instructions.md`

## Document Placement

| Type | Canonical location | Primary owner |
|---|---|---|
| Behavior rules | `.github/instructions/` | `.github/copilot-instructions.md` |
| Skills and flows | `.github/skills/` | `.github/skills/README.md` |
| Task prompts | `.github/prompts/` | prompt-specific frontmatter |
| Strategic structure | `docs/structure/` | `docs/README.md` |
| ADRs | `docs/decisions/` | `docs/decisions/README.md` |
| Examples | `docs/examples/` | owning example README/AGENTS |
| Tooling references | `docs/tooling/` | `docs/tooling/commands-reference.md` |

## Naming Rules

- Use kebab-case.
- Keep one document for one purpose.
- Prefer updating the existing owner document over adding a parallel explanation.

## Cleanup Rule

If content duplicates `docs/**/*` or `.github/instructions/*`, remove the duplicate and keep only a pointer here.
