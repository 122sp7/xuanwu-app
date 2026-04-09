Scope
- Migrated modules/workspace-scheduling implementation into modules/workspace/subdomains/scheduling as canonical ownership.
- Integrated scheduling exports into modules/workspace/api (contracts, facade, ui).
- Replaced runtime imports from @/modules/workspace-scheduling/api to @/modules/workspace/api.
- Removed legacy modules/workspace-scheduling files after replacement.

Decisions / Findings
- Kept API-only consumption by exporting scheduling types, actions, queries, and UI via workspace parent API.
- Preserved existing runtime behavior and Firestore collection contract (workspacePlannerDemands).
- Subdomain structure now follows interfaces -> application -> domain <- infrastructure with API boundary.

Validation / Evidence
- No matches for @/modules/workspace-scheduling in app/modules/packages code paths.
- No remaining files under modules/workspace-scheduling.
- workspace/api has scheduling contracts/facade/ui exports.

Deviations / Risks
- Could not execute npm lint/build via powershell tool because pwsh.exe is unavailable in environment.

Open Questions
- None in current scope.