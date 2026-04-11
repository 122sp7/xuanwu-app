Scope:
- Execute third strangler wave for profile write path with an explicit UI entrypoint.
- Keep lint/build warning baseline unchanged while introducing the new entrypoint.

Decisions/Findings:
- Added a focused bridge file `account/api/legacy-account-profile.bridge.ts` so account-profile API can consume legacy account read/write wiring without importing `account/api/index`.
- Updated `account-profile/api/index.ts` to use the bridge and removed the write-side compatibility alias export (`updateUserProfile`).
- Replaced `/settings/profile` redirect with a real profile editor page that reads via `getProfile` and writes via `updateProfile` from account-profile API.
- Reverted a temporary account interfaces cross-subdomain import to avoid introducing new boundaries warnings.

Validation/Evidence:
- `npm run lint`: 0 errors, 8 warnings (same accepted baseline).
- `npm run build`: success (Next.js 16.1.7).

Deviations/Risks:
- Language-service diagnostics are intermittently stale/noisy compared with CLI lint/build output; CLI output remains source of truth.
- The bridge currently remains a migration seam and should be retired after full cutover away from account legacy wiring.

Open Questions:
- Next wave can switch one additional consumer from account profile aliases to account-profile public methods and then evaluate removing remaining read aliases (`getUserProfile`, `subscribeToUserProfile`) from account-profile API.
