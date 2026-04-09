Completed migration execution for canonical workflow source move from modules/workspace-flow to modules/workspace/subdomains/workflow.

Actions completed:
- Copied full implementation tree (api/application/domain/infrastructure/interfaces and module docs) into modules/workspace/subdomains/workflow preserving structure.
- Ensured modules/workspace/subdomains/workflow/api/index.ts mirrors legacy surface exports.
- Updated modules/workspace/api/contracts.ts to re-export workflow types/constants from ../subdomains/workflow/api.
- Updated modules/workspace/api/facade.ts to re-export workflow facades/queries/listener types from ../subdomains/workflow/api.
- Updated modules/workspace/api/ui.ts to export WorkspaceFlowTab from ../subdomains/workflow/api.
- Migrated consumer imports; verified no code matches for @/modules/workspace-flow/api.
- Deleted all files under modules/workspace-flow (directory now contains empty folders only).

Verification:
- rg @/modules/workspace-flow in app/modules/packages => no matches.
- lint/build command execution blocked in this environment because pwsh.exe is unavailable for powershell tool, and command-exec task agent was environment-restricted; reported as validation blocker.

Risk/notes:
- Empty legacy folders remain on disk; no tracked files remain under modules/workspace-flow.
- Functional API boundary now centralized through modules/workspace/api and workflow subdomain API.