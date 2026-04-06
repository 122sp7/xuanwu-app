/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStatus.ts
 * @description Issue lifecycle status union, multi-successor transition table, and helpers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";

export const ISSUE_STATUSES = [
  "open",
  "investigating",
  "fixing",
  "retest",
  "resolved",
  "closed",
] as const satisfies readonly IssueStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for issue lifecycle.
 *
 * open → investigating (START)
 * investigating → fixing (FIX)
 * fixing → retest (SUBMIT_RETEST)
 * retest → resolved (PASS_RETEST)
 * retest → fixing (FAIL_RETEST — back-edge within the Issue fix cycle)
 * resolved → closed (CLOSE)
 */
const ISSUE_NEXT: Readonly<Record<IssueStatus, readonly IssueStatus[]>> = {
  open: ["investigating"],
  investigating: ["fixing"],
  fixing: ["retest"],
  retest: ["resolved", "fixing"],
  resolved: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean {
  return ISSUE_NEXT[from].includes(to);
}

/** Returns true when the issue has reached a terminal state and cannot progress. */
export function isTerminalIssueStatus(status: IssueStatus): boolean {
  return ISSUE_NEXT[status].length === 0;
}
