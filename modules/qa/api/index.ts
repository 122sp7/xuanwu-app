/**
 * Module: qa
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the QA domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  TestCaseEntity,
  TestRunEntity,
  TestResultEntry,
} from "../domain/entities/TestCase";

// ─── Lifecycle state machine ──────────────────────────────────────────────────

export type { QARunStatus, QATestResult } from "../domain/value-objects/qa-state";

export {
  QA_RUN_STATUSES,
  QA_TEST_RESULTS,
  canTransitionQARun,
  isTerminalQARunStatus,
} from "../domain/value-objects/qa-state";

// ─── Domain events (cross-domain) ────────────────────────────────────────────

export type {
  QADomainEvent,
  TestRunStartedEvent,
  TestCaseResultRecordedEvent,
  TestRunCompletedEvent,
} from "../domain/events/qa.events";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getTestCases } from "../interfaces/queries/qa.queries";
