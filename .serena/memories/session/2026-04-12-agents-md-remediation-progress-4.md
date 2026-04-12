Scope: Root-cause remediation for AGENTS boundary violations using API-composition injection.

Decisions/Findings:
- Refactored cross-subdomain dependencies from infrastructure layer to API composition roots.
- account-profile: infrastructure no longer imports account infrastructure; legacy data source is now configured from account-profile/api via account/api bridge.
- account: infrastructure token refresh adapter no longer imports identity API; emitter configured from account/api.
- organization: infrastructure no longer imports team infrastructure; team port factory configured from organization/api via team/api.

Validation/Evidence:
- npm run lint completed with 0 errors.
- Lint warnings reduced from 6 to 3 and all remaining warnings are non-boundary unrelated issues.

Files touched:
- modules/platform/subdomains/account-profile/infrastructure/account-profile-service.ts
- modules/platform/subdomains/account-profile/infrastructure/index.ts
- modules/platform/subdomains/account-profile/api/index.ts
- modules/platform/subdomains/account/infrastructure/identity-token-refresh.adapter.ts
- modules/platform/subdomains/account/api/index.ts
- modules/platform/subdomains/organization/infrastructure/organization-service.ts
- modules/platform/subdomains/organization/api/index.ts

Open Questions:
- Whether to also migrate deprecated boundaries/element-types config to boundaries/dependencies as a separate lint-infra task.