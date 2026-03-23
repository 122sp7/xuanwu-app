/**
 * Module: qa
 * Layer: domain/event
 * Purpose: Domain events emitted by the QA aggregate.
 *
 * Event flow:
 *   TestRunStarted → TestCaseResultRecorded (×n) → TestRunPassed | TestRunFailed
 *
 * On TestRunFailed the QA layer emits this event; the Issue domain listens
 * and creates an Issue for the failing test run (cross-domain side-effect).
 */

import type { QARunStatus, QATestResult } from "../value-objects/qa-state";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface TestRunStartedEvent {
  readonly type: "qa.test_run_started";
  readonly testRunId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly performedBy: string;
  readonly occurredAtISO: string;
}

export interface TestCaseResultRecordedEvent {
  readonly type: "qa.test_case_result_recorded";
  readonly testRunId: string;
  readonly testCaseId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly result: QATestResult;
  readonly note?: string;
  readonly occurredAtISO: string;
}

export interface TestRunCompletedEvent {
  readonly type: "qa.test_run_completed";
  readonly testRunId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly finalStatus: QARunStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type QADomainEvent =
  | TestRunStartedEvent
  | TestCaseResultRecordedEvent
  | TestRunCompletedEvent;
