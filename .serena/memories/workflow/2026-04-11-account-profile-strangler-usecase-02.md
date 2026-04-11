Scope:
- Continue strangler migration for platform/account-profile with first write-side use case.
- Cut over one real UI consumer to account-profile read boundary.

Decisions/Findings:
- Added write-side use case `UpdateAccountProfileUseCase` with explicit use-case contract.
- Added domain update input schema (`UpdateAccountProfileInputSchema`) and command repository port (`AccountProfileCommandRepository`).
- Extended legacy infrastructure adapter to implement both query and command repository contracts.
- API boundary now composes and exposes `updateAccountProfile`, with migration alias `updateUserProfile`.
- Added account-profile server action adapter `interfaces/_actions/account-profile.actions.ts`.
- Consumer cutover done in ShellLayout: header avatar now subscribes profile via account-profile API (`subscribeToProfile`) and prefers profile displayName/email.

Validation/Evidence:
- `npm run lint`: 0 errors, 8 warnings (same baseline warning count as previous accepted state).
- `npm run build`: success.

Deviations/Risks:
- account-profile API still uses legacy account datasource wiring for migration window.
- Header avatar now depends on profile subscription availability; falls back to auth user data when profile missing.

Open Questions:
- Next wave should migrate one explicit profile write UI entrypoint to `account-profile/interfaces/_actions/updateProfile` and remove account-level compatibility alias when usage reaches zero.
