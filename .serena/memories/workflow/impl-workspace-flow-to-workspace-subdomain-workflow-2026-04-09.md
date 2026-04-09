Phase: impl/qa
Task: migrate modules/workspace-flow to modules/workspace/subdomains/workflow as canonical source

Completed:
- Copied full implementation tree from modules/workspace-flow to modules/workspace/subdomains/workflow (api/application/domain/infrastructure/interfaces and files).
- Updated workspace API aggregators:
  - modules/workspace/api/contracts.ts now exports workflow types/constants from ../subdomains/workflow/api.
  - modules/workspace/api/facade.ts now exports workflow facades/queries/listener surface from ../subdomains/workflow/api.
  - modules/workspace/api/ui.ts now exports WorkspaceFlowTab from ../subdomains/workflow/api.
- Migrated consumer import in WorkspaceDetailScreen to @/modules/workspace/api.
- Verified zero matches for '@/modules/workspace-flow' in app, modules, packages via rg.

Constraints/blockers:
- Runtime shell tool requires pwsh.exe, unavailable in environment.
- Could not execute npm run lint/build through shell.
- Could not remove empty legacy directory tree modules/workspace-flow (files are removed; empty dirs remain).

Validation evidence:
- rg '@/modules/workspace-flow' app => No matches
- rg '@/modules/workspace-flow' modules => No matches
- rg '@/modules/workspace-flow' packages => No matches

Follow-up needed when pwsh/cmd execution is available:
- Remove leftover empty directory: modules/workspace-flow
- Run: npm run lint, npm run build