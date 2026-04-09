## Phase: impl
## Task: remove legacy workspace-audit module after subdomain migration
## Date: 2026-04-09

### Scope
- Confirmed audit functionality already migrated to `modules/workspace/subdomains/audit` and exposed via `@/modules/workspace/api`.
- Removed legacy `modules/workspace-audit` source/docs files.

### Actions completed
- Deleted all tracked files under `modules/workspace-audit/**` (API, application, domain, infrastructure, interfaces, docs).
- Kept canonical audit surface in workspace parent API:
  - `modules/workspace/api/contracts.ts`
  - `modules/workspace/api/facade.ts`
  - `modules/workspace/api/ui.ts`
  - all re-export from `../subdomains/audit/api`
- Verified runtime code has no remaining references to `@/modules/workspace-audit` or `modules/workspace-audit` (app/modules globs).

### Validation / Evidence
- grep checks on `app/**/*` and `modules/**/*` return no legacy import/path matches.
- workspace API still resolves to subdomain audit re-exports.

### Environment limits
- `npm run lint` and `npm run build` could not run because this runtime lacks `pwsh.exe`.
- Serena `#sym:prune_index` equivalent tool is not exposed in current MCP toolset.

### Notes
- Files are removed; local empty directory visibility may persist until filesystem cleanup by shell/Git operations.