Scope:
- Start first strangler-pattern convergence use case for platform/account-profile.
- Implement minimal Domain -> Application -> Ports -> Infrastructure -> Interface flow.

Decisions/Findings:
- Selected use case: GetAccountProfile (+ SubscribeAccountProfile) as low-risk read path.
- Replaced temporary legacy application port bridge with domain-owned repository port (`AccountProfileQueryRepository`).
- Added AccountProfile domain schema/value model using `@lib-zod` and branded id (`AccountProfileId`).
- Moved legacy dependency coupling to API composition boundary: `api/index.ts` wires account/api legacy functions into infrastructure adapter via datasource contract.
- Added interfaces queries that call account-profile API/use cases instead of direct infrastructure access.
- Kept migration compatibility aliases: `getUserProfile` and `subscribeToUserProfile` exported from account-profile/api and backed by new use cases.

Validation/Evidence:
- `npm run lint`: 0 errors, 8 warnings.
- Warnings dropped from previous 10 -> 8 by eliminating account-profile legacy cross-subdomain warnings.
- `npm run build`: success (Next.js 16.1.7).

Deviations/Risks:
- Legacy compatibility function names remain exported in account-profile/api for migration window.
- No consumer cutover yet; existing callers are not switched in this wave.

Open Questions:
- Next strangler wave should choose one write-side profile use case (e.g., UpdateAccountProfile) and cut over at least one UI consumer to account-profile/interfaces queries.
