---
name: plan-vsa-mddd
agent: vsa-mddd-planner
description: Analyze current code and produce a minimal VSA to MDDD migration plan.
argument-hint: "[feature, route, or module to migrate]"
---
Use **xuanwu-skill** first.

Analyze the requested area as part of the Xuanwu **VSA -> MDDD** migration:
- map the current implementation across `app/`, `modules/`, `infrastructure/`, `interfaces/`, `lib/`, `shared/`, and `ui/`
- compare it against `ARCHITECTURE.md`
- identify the smallest high-value migration slice
- if the request is "continue next phase", pick the next slice in this order:
  1) identity/account/organization closure
  2) workspace + shell context consistency
  3) remaining unfinished modules by user-facing impact
- exclude VS8 unless the user explicitly asks for VS8
- ask up to 3 clarifying questions only if required
- return a concrete checklist, validation plan, and Serena memory updates to perform after implementation
