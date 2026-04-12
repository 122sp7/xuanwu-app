Scope: aligned bounded-context and subdomain documentation to the current core-first subdomain structure.
Decisions / Findings:
- `docs/bounded-context-subdomain-template.md` now describes subdomains as core-first by default (`api/`, `application/`, `domain/`, optional `ports/`).
- Root-level `infrastructure/` and `interfaces/` are documented as the default adapter/UI location, grouped by subdomain.
- `docs/contexts/_template.md`, `modules/notion/README.md`, `modules/notebooklm/README.md`, and affected subdomain README files were updated to remove the obsolete full mini-module subdomain shape.
Validation / Evidence:
- repo search found no remaining `empty, use subdomain layers` or `Public boundary for cross-subdomain access` strings in docs and module README surfaces.
- `get_errors` reported no issues in the edited authority files.
Deviations / Risks:
- This pass targeted the explicit documentation conflicts surfaced by the current template and README wording; it did not rewrite every module document in the repository.
Open Questions:
- Whether additional context-local docs should explicitly restate the mini-module gate or continue inheriting it from the root template.