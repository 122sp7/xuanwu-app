/**
 * Module: issue
 * Layer: domain/value-object
 * Purpose: Issue lifecycle status, cross-domain stage reference, and transition helpers.
 *
 * The Issue domain is a Cross-Domain Supporting Domain.
 * Issues can be raised at any stage of the work flow:
 *   qa | acceptance | finance | task
 *
 * IssueStatus flow:
 *   open → investigating → fixing → retest → resolved → closed
 *
 * Design rationale:
 *   - Task status never moves backward because of an issue.
 *   - An Issue carries `stage` to know which domain to notify on resolution.
 *   - "retest" means: Issue is fixed, awaiting verification in original domain.
 *   - After retest passes, status → resolved → closed.
 */

// ── IssueStatus ───────────────────────────────────────────────────────────────

export type IssueLifecycleStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";

export const ISSUE_LIFECYCLE_STATUSES = [
  "open",
  "investigating",
  "fixing",
  "retest",
  "resolved",
  "closed",
] as const satisfies readonly IssueLifecycleStatus[];

// ── IssueStage (cross-domain context where the issue was raised) ──────────────

/**
 * Cross-domain stage reference.
 * Exported from this module and imported by QA, Acceptance, Finance.
 */
export type IssueStage = "task" | "qa" | "acceptance" | "finance";

export const ISSUE_STAGES = ["task", "qa", "acceptance", "finance"] as const satisfies readonly IssueStage[];

// ── Transition table ──────────────────────────────────────────────────────────

const ISSUE_NEXT: Readonly<Record<IssueLifecycleStatus, readonly IssueLifecycleStatus[]>> = {
  open: ["investigating", "closed"],           // may be immediately closed if duplicate
  investigating: ["fixing", "resolved"],       // resolved directly if no code change needed
  fixing: ["retest"],
  retest: ["resolved", "fixing"],              // may cycle back if fix is insufficient
  resolved: ["closed"],
  closed: [],                                  // terminal
};

export function canTransitionIssue(
  from: IssueLifecycleStatus,
  to: IssueLifecycleStatus,
): boolean {
  return ISSUE_NEXT[from].includes(to);
}

export function isTerminalIssueStatus(status: IssueLifecycleStatus): boolean {
  return ISSUE_NEXT[status].length === 0;
}
