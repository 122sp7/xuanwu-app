Scope:
- Investigate `/organization/schedule` showing "載入失敗，請重新整理。"
- Reproduce via runtime diagnostics + browser automation and apply minimal boundary-safe fix.

Decisions/Findings:
- Next.js runtime `get_errors` reported no global compile/runtime error.
- Browser reproduction in current test context showed non-org guard state ("請先切換到組織帳戶。").
- Error string source confirmed in scheduling views (`AccountSchedulingView`, `WorkspaceSchedulingTab`) when demand query throws.
- High-probability root cause found: `work-demand.queries.ts` was marked `"use server"` while it composes Firebase Web client repository (`FirebaseDemandRepository` via `makeDemandRepo`).
- Applied minimal fix: removed `"use server"` from scheduling read queries and added input normalization guards.

Validation/Evidence:
- `npm run lint`: 0 errors, 8 warnings (baseline unchanged).
- `npm run build`: success.

Deviations/Risks:
- Could not fully replay org-account-specific flow in this automation session because no available organization account context in menu.
- Fix is architecture-aligned and reduces server/client runtime mismatch risk for scheduling reads.

Open Questions:
- Verify with a real organization account that `/organization/schedule` no longer enters error state.
- If still failing, capture exact thrown error text in `AccountSchedulingView` catch block for next root-cause iteration.
