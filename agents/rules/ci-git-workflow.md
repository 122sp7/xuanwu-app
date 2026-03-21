---
title: Git and CI Workflow
impact: HIGH
impactDescription: Maintains clean history and predictable CI behavior
tags: ci, git, workflow, branches
---

## Git and CI Workflow

**Impact: HIGH**

Follow a consistent git workflow that keeps the main branch clean and CI predictable.

**Branch naming:** `<type>/<description>` (e.g., `feat/add-wiki-search`, `fix/schedule-derivation`, `refactor/task-module-ports`)

**Commit message format:**

```
<type>(<scope>): <description>

feat(wiki): add document search use case
fix(schedule): correct derived item status calculation
refactor(file): extract hexagonal ports
docs(agents): update MDDD knowledge base
```

**Guidelines:**
- Keep commits focused — one logical change per commit
- Rebase feature branches on main before merging
- Run `npm run lint && npm run build` locally before pushing
- CI must pass before merge — no exceptions
- If CI fails, fix the issue in the same branch (no follow-up PRs)
