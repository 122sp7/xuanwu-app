export { WorkspaceQATab } from "./interfaces/components/WorkspaceQATab";
export type {
  WorkspaceQualityCheckEntity,
  WorkspaceQualityCheckStatus,
  CreateWorkspaceQualityCheckInput,
  UpdateWorkspaceQualityCheckInput,
} from "./domain/entities/QualityCheck";
export type { QualityCheckRepository } from "./domain/repositories/QualityCheckRepository";
export {
  CreateWorkspaceQualityCheckUseCase,
  UpdateWorkspaceQualityCheckUseCase,
  DeleteWorkspaceQualityCheckUseCase,
  ListWorkspaceQualityChecksUseCase,
} from "./application/use-cases/quality-check.use-cases";
export { FirebaseQualityCheckRepository } from "./infrastructure/firebase/FirebaseQualityCheckRepository";
export {
  createWorkspaceQualityCheck,
  updateWorkspaceQualityCheck,
  deleteWorkspaceQualityCheck,
} from "./interfaces/_actions/qa.actions";
export { getWorkspaceQualityChecks } from "./interfaces/queries/qa.queries";

// ── MDDD Domain: TestCase / TestRun entities ──────────────────────────────────
export type {
  TestCaseEntity,
  TestRunEntity,
  TestResultEntry,
  QATestRunStatus,
  QATestResult,
  CreateTestCaseInput,
} from "./domain/entities/TestCase";

// ── MDDD Domain: lifecycle status & state machine ─────────────────────────────
export type { QARunStatus } from "./domain/value-objects/qa-state";
export {
  QA_RUN_STATUSES,
  QA_TEST_RESULTS,
  canTransitionQARun,
  isTerminalQARunStatus,
} from "./domain/value-objects/qa-state";

// ── MDDD Domain: events ───────────────────────────────────────────────────────
export type {
  QADomainEvent,
  TestRunStartedEvent,
  TestCaseResultRecordedEvent,
  TestRunCompletedEvent,
} from "./domain/events/qa.events";

// ── MDDD Application: DTOs ────────────────────────────────────────────────────
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
