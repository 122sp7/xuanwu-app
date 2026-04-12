Scope: align notion/notebooklm API boundaries with workspace as the browser-facing orchestration owner.
Decisions / Findings:
- workspace is the UI orchestration owner for shell composition; app-layer browser flows should prefer workspace/api/ui and workspace/api/facade.
- notion root api remains a public semantic barrel and now explicitly documents that internal factory wiring stays private during migration convergence.
- notebooklm root api keeps public and server-only entry surfaces, but root api/factories was removed because it exposed internal wiring without external consumers.
- notebooklm/api/server.ts now uses a server-only guard to reflect its runtime boundary.
Validation / Evidence:
- repository search found no remaining imports of `@/modules/notebooklm/api/factories`.
- edited files reported no errors via get_errors.
Deviations / Risks:
- notion still has migration-state comments because the convergence is real; this pass clarified the boundary rather than pretending the migration is complete.
Open Questions:
- whether notion will eventually need a root api/server.ts once a real cross-module server-only contract appears.