Scope
- Completed migration from modules/workspace-feed to modules/workspace/subdomains/feed as canonical implementation.
- Integrated feed public surface into modules/workspace/api (contracts, facade, ui).
- Replaced runtime app/modules imports from @/modules/workspace-feed/api to @/modules/workspace/api.
- Removed legacy modules/workspace-feed files after reference replacement.

Decisions / Findings
- Preserved API-only consumption model by exposing feed via workspace parent api boundary.
- Kept subdomain internals under modules/workspace/subdomains/feed and exported only required types/actions/components.
- Updated workspace/api/contracts.ts to re-export feed contracts from subdomain api index instead of direct entity path.

Validation / Evidence
- No runtime matches for @/modules/workspace-feed under app/ and modules/.
- glob confirms modules/workspace-feed has no remaining files.

Deviations / Risks
- Could not run npm lint/build in this environment because pwsh.exe is unavailable for powershell tool execution.

Open Questions
- None in current scope.