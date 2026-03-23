/**
 * Module: qa
 * Layer: domain/entity
 * Purpose: Core QA domain entities — TestCase and TestRun aggregates.
 *
 * QA domain resolves ONE question: "Does this task meet quality criteria?"
 * It is deliberately separate from Task (workflow) and Acceptance (client sign-off).
 *
 * Lifecycle:
 *   TestRun is created for a task in the "qa" stage.
 *   TestCases are executed → each gets a TestResult (pass | fail | retest).
 *   When all TestCases pass, a TaskStatusChangedEvent (qa → acceptance) is emitted.
 *   Failures trigger an IssueDomainEvent (handled by the Issue domain).
 */

// ── TestCase ──────────────────────────────────────────────────────────────────

export interface TestCaseEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** Task this test case validates. */
  readonly taskId: string;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTestCaseInput {
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
}

// ── TestRun ───────────────────────────────────────────────────────────────────

export type QATestRunStatus = "pending" | "in_progress" | "passed" | "failed";

export interface TestRunEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly taskId: string;
  readonly status: QATestRunStatus;
  /** Result summary per test case. */
  readonly results: readonly TestResultEntry[];
  readonly performedBy: string;
  readonly startedAtISO: string;
  readonly completedAtISO?: string;
}

// ── TestResult (value object embedded in TestRun) ─────────────────────────────

export type QATestResult = "pass" | "fail" | "retest";

export interface TestResultEntry {
  readonly testCaseId: string;
  readonly result: QATestResult;
  /** Optional tester note / defect description. */
  readonly note?: string;
  readonly performedAtISO: string;
}
