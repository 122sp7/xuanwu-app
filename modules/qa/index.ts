// ── Domain: TestCase / TestRun entities ───────────────────────────────────────
export type {
  TestCaseEntity,
  TestRunEntity,
  TestResultEntry,
  CreateTestCaseInput,
} from "./domain/entities/TestCase";

// ── Domain: lifecycle status & state machine ──────────────────────────────────
export type { QARunStatus, QATestResult } from "./domain/value-objects/qa-state";
export {
  QA_RUN_STATUSES,
  QA_TEST_RESULTS,
  canTransitionQARun,
  isTerminalQARunStatus,
} from "./domain/value-objects/qa-state";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  QADomainEvent,
  TestRunStartedEvent,
  TestCaseResultRecordedEvent,
  TestRunCompletedEvent,
} from "./domain/events/qa.events";

// ── Domain: repository port ───────────────────────────────────────────────────
export type { TestCaseRepository } from "./domain/repositories/TestCaseRepository";

// ── Application: DTOs ─────────────────────────────────────────────────────────
export type {
  CreateTestCaseInputDto,
  StartTestRunInputDto,
  RecordTestCaseResultInputDto,
} from "./application/dto/qa.dto";
export {
  CreateTestCaseInputSchema,
  StartTestRunInputSchema,
  RecordTestCaseResultInputSchema,
  QARunStatusSchema,
  QATestResultSchema,
} from "./application/dto/qa.dto";

// ── Application: use-cases ────────────────────────────────────────────────────
export {
  CreateTestCaseUseCase,
  DeleteTestCaseUseCase,
  ListTestCasesUseCase,
} from "./application/use-cases/test-case.use-cases";

// ── Infrastructure ────────────────────────────────────────────────────────────
export { FirebaseTestCaseRepository } from "./infrastructure/firebase/FirebaseTestCaseRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export { createTestCase, deleteTestCase } from "./interfaces/_actions/qa.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getTestCases } from "./interfaces/queries/qa.queries";

// ── Interfaces: UI component ──────────────────────────────────────────────────
export { WorkspaceQATab } from "./interfaces/components/WorkspaceQATab";
