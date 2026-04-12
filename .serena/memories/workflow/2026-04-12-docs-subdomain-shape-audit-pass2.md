Scope: second-pass audit of remaining module/context documentation and local instruction files after the subdomain shape alignment.
Decisions / Findings:
- Remaining drift was isolated to local instruction files under `modules/workspace/subdomains/`, `modules/platform/subdomains/`, and `modules/workspace/infrastructure/`.
- These files were updated to match the root governance: subdomains are core-first by default, and adapters/UI belong at the bounded-context root unless the mini-module gate is justified.
Validation / Evidence:
- repository search no longer finds the stale phrases `Every subdomain must maintain the full hexagonal shape`, `subdomains/<name>/infrastructure`, `empty, use subdomain layers`, or `Public boundary for cross-subdomain access` across docs/modules markdown surfaces.
- `get_errors` reported no issues in the edited local instruction files.
Deviations / Risks:
- This audit targeted documentation and instruction drift only; it did not refactor runtime code.
Open Questions:
- Whether similar local instruction files should be added for notion/notebooklm or continue to inherit from root governance only.