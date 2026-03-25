## Phase: impl
## Task: migrate-modules-audit-to-workspace-audit
## Date: 2026-03-25

### Scope
- Renamed bounded context directory from modules/audit to modules/workspace-audit using git mv.
- Updated all import paths and documentation references from modules/audit to modules/workspace-audit.

### Decisions / Findings
- PowerShell wildcard git mv failed (`fatal: bad source`); reliable approach is folder-level `git mv modules/audit modules/workspace-audit` after removing destination placeholder.
- Required touchpoints included app route import, workspace UI import, module README/API comments, and development contract docs.

### Validation / Evidence
- Global grep for `@/modules/audit|modules/audit|Module: audit` returned no matches.
- `npm run lint` could not execute due missing local dependency `eslint-plugin-boundaries` (environment issue).

### Deviations / Risks
- Lint/build validation not completed because dependency missing in local environment.

### Open Questions
- none
