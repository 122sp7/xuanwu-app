---
title: Handoff matrix
description: Formal stage transitions, required inputs, and return paths for the Xuanwu Copilot Delivery Suite.
---

# Handoff matrix

This matrix defines the valid stage transitions for the formal delivery workflow.

## Primary delivery chain

| From | To | Trigger | Required input | Expected output | Can next stage edit? | Can work return? |
| --- | --- | --- | --- | --- | --- | --- |
| Planner | Implementer | Plan is complete and safe to execute | Approved implementation plan | Code changes, docs updates, validation results | Yes | No direct return in v1 |
| Implementer | Reviewer | Implementation and plan-defined validation are complete | Implementation plan, change summary, validation run | Findings or approval to proceed to QA | No | Yes, to Implementer |
| Reviewer | QA | No blocking review findings remain | Implementation plan, reviewed change summary, review findings | QA evidence and release recommendation | No | Yes, to Implementer |

## Return paths

| From | To | When to use | Required input |
| --- | --- | --- | --- |
| Reviewer | Implementer | Bugs, regressions, boundary violations, missing validation, or missing docs must be fixed | Review findings and affected scope |
| QA | Implementer | QA failures or release-blocking residual risk require changes | QA findings, failed scenarios, and evidence |

## Re-entry paths

| Situation | Recommended entry |
| --- | --- |
| New feature request | `/plan-feature` |
| New bug fix | `/plan-bugfix` |
| Plan already exists and implementation should start or resume | `/implement-plan` |
| Changes exist and a formal review should run | `/review-changes` |
| Review is complete and QA should run or rerun | `/run-qa` |
| Session was interrupted and stage must be reconstructed | `/resume-delivery` |

## Transition rules

- Only the Implementer stage edits repository files in the formal chain.
- Reviewer and QA are gates, not fallback implementation stages.
- The Planner stage should be rerun only when scope, owner, runtime, or validation has materially changed.
- If a later stage discovers a plan defect instead of an implementation defect, document that defect explicitly before restarting planning.