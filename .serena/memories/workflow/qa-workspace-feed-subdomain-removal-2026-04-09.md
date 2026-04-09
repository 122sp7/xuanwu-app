Scope
- QA sweep for workspace-feed migration and removal.

Validation / Evidence
- Searched app/ and modules/ for @/modules/workspace-feed references: none found.
- Verified feed consumer imports now use @/modules/workspace/api in key screens/pages.
- Confirmed modules/workspace-feed file tree is removed.

Constraints
- Automated lint/build commands were not executable via tooling due to missing pwsh.exe.

Result
- Migration and legacy removal are consistent for runtime code paths in current repository tree.