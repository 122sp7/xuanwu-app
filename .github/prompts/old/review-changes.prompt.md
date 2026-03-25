---
name: review-changes
description: Review changes against the implementation plan, repository boundaries, and required validation.
agent: Reviewer
argument-hint: Provide the plan reference, affected files or change summary, and any areas of concern.
---

# Review Changes

Review the implementation against the approved plan.

## Requirements

- Prioritize bugs, regressions, boundary violations, missing validation, and missing docs.
- Check alignment with [xuanwu-mddd-boundaries](../../.github/skills/xuanwu-mddd-boundaries/SKILL.md) when ownership or layer placement is involved.
- Check alignment with [xuanwu-development-contracts](../../.github/skills/xuanwu-development-contracts/SKILL.md) when a governed workflow is involved.
- Present findings first, ordered by severity.

## Output

State whether the implementation is ready for QA, requires fixes first, or is blocked by plan or boundary issues.