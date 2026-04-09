## Phase: impl
## Task: start migration implementation for account/identity/notification/organization into platform subdomains
## Date: 2026-04-10

### Scope
- Implemented Phase-1 migration foundation inside `modules/platform/subdomains/*` without breaking existing consumers.
- Kept source modules intact; introduced compatibility bridges in platform subdomains.

### Changes
- identity subdomain:
  - Added application port: `LegacyIdentityApplicationPort`.
  - Added adapter factory: `createLegacyIdentityApplicationAdapter`.
  - Updated `application/index.ts`, `adapters/index.ts`, and subdomain `index.ts` exports.
- account subdomain:
  - Added application port: `LegacyAccountApplicationPort` (using only symbols exported by `modules/account/api`).
  - Added adapter factory: `createLegacyAccountApplicationAdapter`.
  - Updated `application/index.ts`, `adapters/index.ts`, and subdomain `index.ts` exports.
- account-profile subdomain:
  - Added application port: `LegacyAccountProfileApplicationPort`.
  - Added adapter factory: `createLegacyAccountProfileApplicationAdapter`.
  - Updated `application/index.ts`, `adapters/index.ts`, and subdomain `index.ts` exports.
- organization subdomain:
  - Added application port: `LegacyOrganizationApplicationPort`.
  - Added adapter factory: `createLegacyOrganizationApplicationAdapter`.
  - Updated `application/index.ts`, `adapters/index.ts`, and subdomain `index.ts` exports.
- notification subdomain:
  - Added application port: `LegacyNotificationApplicationPort`.
  - Added adapter factory: `createLegacyNotificationApplicationAdapter`.
  - Updated `application/index.ts`, `adapters/index.ts`, and subdomain `index.ts` exports.

### Validation / Evidence
- Ran `npm run lint`: pass with pre-existing warnings unrelated to current change (workspace/scheduling + workspace/audit).
- Ran `npm run build`: pass after fixing a compatibility import mismatch (`updateUserProfile` not exported by `modules/account/api`).
- Corrective action taken: account/account-profile bridges now only depend on symbols publicly exported by `modules/account/api`.

### Deviations / Risks
- Bridges currently target legacy module APIs; they are compatibility scaffolds, not final platform-native implementations.
- No consumer cutover yet; app/modules continue importing legacy module APIs.
- Serena LSP restart/prune-index operations were not available in current active Serena toolset for this session.

### Next Steps
1. Introduce platform-native use case handlers behind these ports.
2. Add platform-level facade projection for these subdomain bridges.
3. Start consumer cutover from source module APIs to platform APIs in waves.
4. When Serena tool availability allows, run explicit LSP restart and index pruning.
