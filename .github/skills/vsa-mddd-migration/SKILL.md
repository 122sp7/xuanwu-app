---
name: vsa-mddd-migration
description: Workflow skill for Xuanwu VSA to MDDD migration. Use this when planning or implementing architecture migration, modularization, or project-wide UI/UX consistency work.
---

# Xuanwu VSA -> MDDD Migration Skill

Use this skill for:
- architecture migration planning
- modularization and boundary cleanup
- moving logic from views/shell code into MDDD modules
- aligning UI work with reusable shell and shadcn patterns

## Mandatory startup sequence
1. Invoke **Use skill: xuanwu-skill** immediately.
2. Use filesystem MCP to map the relevant folders before opening individual files.
3. Use repomix MCP for project-wide references and memory MCP for verified migration notes.

## Migration priorities
1. Stabilize and clarify `modules/` boundaries.
2. Keep `app/` thin and route-focused.
3. Move reusable logic toward `shared/`, `lib/`, and `ui/`.
4. Keep `infrastructure/` and `interfaces/` as adapter layers, not feature dumping grounds.
5. Maintain shell UI/UX consistency while migration proceeds.
6. Validate identity/account/organization module completeness before other unfinished areas.

## Next-phase continuation rule
When asked to "continue next phase", apply this deterministic order:
1. Finish any remaining identity/account/organization gaps.
2. Finish workspace + shell context/UX gaps that block post-login continuity.
3. Continue unfinished modules by user-facing impact (`task`, `notification`, `knowledge`, `retrieval`) before lower-frequency back-office areas.
4. Exclude VS8 unless the user explicitly requests VS8 work.

## Required architecture scan checklist
- Compare current state against expected MDDD target structure in:
  - `app/`
  - `modules/`
  - `infrastructure/`
  - `interfaces/`
  - `lib/`
  - `shared/`
  - `ui/`
- Continue only unfinished or partially implemented scopes.
- Keep all changes idempotent and augment existing paths instead of duplicating implementations.

## MCP strategy
- **filesystem MCP**: understand the project as a graph of folders and flows, not isolated files.
- **repomix MCP**: inspect merged project references and searchable snapshots before broad migration edits.
- **memory MCP**: update durable migration facts after meaningful milestones.
- **next-devtools MCP**: inspect App Router, RSC, cache, and shell runtime behavior before modifying Next.js flows.
- **shadcn MCP**: reuse or extend existing UI primitives instead of inventing inconsistent controls.

## Definition of done
- the change clearly improves VSA -> MDDD alignment
- no duplicate logic is introduced
- validation is run
- UI changes include a screenshot
- memory MCP notes are updated with new durable facts and remaining gaps
- memory MCP updates capture completed modules, enforced UI/UX patterns, and remaining gaps
