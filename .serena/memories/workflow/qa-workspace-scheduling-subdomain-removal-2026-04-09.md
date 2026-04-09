Scope
- QA sweep for scheduling subdomain migration and legacy module removal.

Validation / Evidence
- Verified app/modules/packages no longer import @/modules/workspace-scheduling.
- Verified modules/workspace-scheduling file tree removed.
- Verified workspace parent API now exports scheduling contracts, actions/queries, and UI components.

Constraints
- Lint/build verification could not run through current powershell tool due to missing pwsh.exe.

Result
- Runtime reference migration and module removal are complete for scheduling scope.