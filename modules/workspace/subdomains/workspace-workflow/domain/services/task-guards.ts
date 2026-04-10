/**
 * @module workspace-flow/domain/services
 * @file task-guards.ts
 * @description Pure domain guards for task lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional business invariants as rules evolve
 */

// ── Guard: no open issues ─────────────────────────────────────────────────────

/**
 * Asserts that a task has no open issues before allowing QA-pass or acceptance-approve.
 *
 * @param openIssueCount - The number of open issues currently linked to the task
 * @returns true if the task may proceed; false if blocked by open issues
 */
export function hasNoOpenIssues(openIssueCount: number): boolean {
  return openIssueCount === 0;
}

// ── Guard: invoice closed or none ─────────────────────────────────────────────

/**
 * Asserts that any linked invoice is closed (or none exists) before allowing archive.
 *
 * @param invoiceStatus - The status of the linked invoice, or undefined if none
 * @returns true if the task may be archived; false if blocked by an active invoice
 */
export function invoiceAllowsArchive(
  invoiceStatus: string | undefined,
): boolean {
  if (invoiceStatus === undefined) return true;
  return invoiceStatus === "closed";
}
 
