## Phase: impl
## Task: docs-stale-cleanup-root-and-docs
## Date: 2026-03-25

### Scope
- Updated root docs: SPEC-WORKFLOW.md, README.md, PERMISSIONS.md, CLAUDE.md, AGENTS.md.
- Cleaned stale references in .github and docs paths.
- Synced deploy command naming from deploy:functions:python to deploy:functions:py-fn where applicable.

### Decisions / Findings
- SPEC-WORKFLOW.md was outdated: referenced non-existent docs/decision-architecture/design path.
- Current canonical planning flow is in docs/how-to-user/how-to/start-feature-delivery.md plus ai reference templates.
- Module ownership references using modules/file and modules/ai were stale in PERMISSIONS/docs.
- modules-naming instruction still used workspace-planner example after workspace-scheduling migration.

### Validation / Evidence
- Ran grep search for stale tokens: deploy:functions:python, docs/decision-architecture/design/, modules/file/README.md, workspace-planner.
- Post-edit grep returned no matches in targeted root/.github/docs/packages/agents command docs.
- get_errors reported no errors for all edited files.

### Deviations / Risks
- Did not modify CODE_OF_CONDUCT.md because no stale/invalid project-specific content found.
- .github/skills/xuanwu-skill reference artifacts contain many historical snapshots and may still include stale strings by design; not cleaned in this pass.

### Open Questions
- Should we run an additional cleanup pass for generated skill reference artifacts under .github/skills/xuanwu-skill/references/ after next repomix refresh?