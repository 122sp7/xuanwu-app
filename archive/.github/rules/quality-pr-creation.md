---
title: Pull Request Best Practices
impact: MEDIUM
impactDescription: Ensures clean, reviewable, and complete pull requests
tags: quality, pr, git, review
---

## Pull Request Best Practices

**Impact: MEDIUM**

Every pull request must be complete, focused, and reviewable. No "follow-up PRs" for unfinished work — if it's in scope, finish it in the current PR.

**Guidelines:**

1. **Single responsibility** — One PR addresses one concern (feature, bug fix, refactor)
2. **Complete work** — Don't leave TODOs or broken tests for follow-up PRs
3. **Clear description** — Explain what changed, why, and how to verify
4. **Small diffs** — Prefer multiple small PRs over one massive PR
5. **Module-scoped** — Changes should ideally be contained within one module; cross-module changes need extra review attention

**PR description template:**

```markdown
## What
Brief description of the change.

## Why
Business context or technical motivation.

## How to Verify
Steps to test the change locally.

## Module(s) Affected
- modules/workspace-flow
- packages/shared-types
```
