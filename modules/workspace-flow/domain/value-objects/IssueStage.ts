/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStage.ts
 * @description Cross-domain stage reference indicating at which task-flow stage an issue was raised.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Extend stage list if workflow introduces additional stages
 */

// ── IssueStage ─────────────────────────────────────────────────────────────────

/**
 * Indicates which stage of the task workflow this issue was raised in.
 * Used to route issue resolution back to the originating workflow step.
 */
export type IssueStage = "task" | "qa" | "acceptance";

export const ISSUE_STAGES = [
  "task",
  "qa",
  "acceptance",
] as const satisfies readonly IssueStage[];
