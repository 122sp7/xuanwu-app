/**
 * Module: qa
 * Layer: domain/value-object
 * Purpose: QA TestRun lifecycle status and pure transition helpers.
 *
 * Status flow:
 *   pending → in_progress → passed
 *                         → failed  (→ triggers Issue creation)
 *
 * Invariant: Once passed or failed the run is closed.
 * A "retest" opens a NEW TestRun rather than recycling the old one.
 */

export type QARunStatus = "pending" | "in_progress" | "passed" | "failed";

export const QA_RUN_STATUSES = [
  "pending",
  "in_progress",
  "passed",
  "failed",
] as const satisfies readonly QARunStatus[];

const QA_RUN_TRANSITIONS: Readonly<Record<QARunStatus, readonly QARunStatus[]>> = {
  pending: ["in_progress"],
  in_progress: ["passed", "failed"],
  passed: [],
  failed: [],
};

export function canTransitionQARun(from: QARunStatus, to: QARunStatus): boolean {
  return QA_RUN_TRANSITIONS[from].includes(to);
}

export function isTerminalQARunStatus(status: QARunStatus): boolean {
  return QA_RUN_TRANSITIONS[status].length === 0;
}

/** Possible individual test-case verdicts (value, not a lifecycle state). */
export const QA_TEST_RESULTS = ["pass", "fail", "retest"] as const;
export type QATestResult = (typeof QA_TEST_RESULTS)[number];
