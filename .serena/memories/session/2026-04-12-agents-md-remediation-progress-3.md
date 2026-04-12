Scope: Continue AGENTS violation remediation with direct code changes.

Completed:
- Resolved platform shell cross-layer violations by moving quick-create access to platform public API path.
- Added interfaces-layer shell quick-create service and exported it through platform API.
- Updated ShellDashboardSidebar import to use @/modules/platform/api (removed internal application-layer import).
- Updated account-profile and organization infrastructure wiring away from cross-subdomain api imports (toward infrastructure wiring).

Validation:
- eslint now reports 6 warnings (down from 9).
- The two previous shell warnings were removed.

Remaining blockers:
- 3 boundaries warnings remain for cross-subdomain dependencies in platform infrastructure:
  1) account-profile infra -> account infra
  2) account infra -> identity api
  3) organization infra -> team infra
- These require architectural composition-root relocation (main-domain level wiring) rather than local import swaps.

Next recommended slice:
- Introduce platform main-domain composition adapters under modules/platform/infrastructure and inject ports into subdomain infrastructure/application to remove cross-subdomain imports.