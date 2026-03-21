---
title: Engineering Accountability
impact: MEDIUM
impactDescription: Ensures ownership and follow-through on all changes
tags: culture, accountability, ownership
---

## Engineering Accountability

**Impact: MEDIUM**

Every change has an owner. The author of a change is responsible for its correctness, its test coverage, and its impact on the broader system.

**Principles:**
- **Own your module** — if you change a module, verify that its barrel exports still work, its tests pass, and its README (if present) is accurate
- **No orphaned code** — every file belongs to a module or package; don't create stray files outside the established structure
- **Complete your work** — a PR with TODOs or broken tests is not ready for review
- **Fix what you break** — if your change causes a failure in another module, fix the downstream impact before merging
- **Document decisions** — when you make a non-obvious architectural choice, explain it in the PR description or a module README
