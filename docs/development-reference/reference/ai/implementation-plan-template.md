---
title: Implementation plan template
description: Canonical template for formal implementation plans used by the Xuanwu Copilot Delivery Suite.
---

# Implementation plan template

Use this template for any non-trivial delivery task that should move through the formal Planner → Implementer → Reviewer → QA chain.

---

# Implementation Plan: <short title>

## 1. Request summary

- Request:
- Request type: `feature | bugfix | refactor | migration`
- Business or delivery goal:

## 2. Scope

- In scope:
- Explicitly out of scope:

## 3. Current state

- Relevant existing behavior:
- Current constraints:
- Existing docs or contracts already consulted:

## 4. Target state

- Intended end state:
- User-visible or system-visible outcome:

## 5. Owning modules and layers

| Area | Owner | Layer(s) touched | Notes |
| --- | --- | --- | --- |
| `<area>` | `<module or package>` | `<interfaces/application/domain/infrastructure>` | `<reason>` |

## 6. Runtime ownership

| Concern | Runtime owner | Notes |
| --- | --- | --- |
| `<concern>` | `<Next.js | py_fn | Firebase | other>` | `<reason>` |

## 7. Contracts and invariants

- Governing contracts:
- Invariants that must remain true:
- Acceptance gates that matter for this task:

## 8. Affected areas

- Files or folders likely to change:
- Public APIs, DTOs, or routes affected:
- Data model or persistence implications:

## 9. Implementation tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## 10. Validation plan

- Required checks:
- Required tests:
- Manual verification:

## 11. Documentation updates

- Docs that must be updated:
- Docs that were checked and do not need changes:

## 12. Compatibility or rollback notes

- Compatibility period, if any:
- Rollback or fallback notes:

## 13. Risks

- Risk 1:
- Risk 2:

## 14. Open questions

- Question 1:
- Question 2:

## 15. Handoff notes for Implementer

- Execution order to preserve:
- Edge cases to keep in view:
- Required validation before handoff to Reviewer: