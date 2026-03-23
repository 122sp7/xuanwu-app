// ── Domain: AcceptanceGate (readiness check service) ─────────────────────────
export type {
  AcceptanceGate,
  AcceptanceGateStatus,
  WorkspaceAcceptanceSummary,
} from "./domain/entities/AcceptanceGate";
export type { AcceptanceRepository, AcceptanceScope } from "./domain/repositories/AcceptanceRepository";
export {
  createAcceptanceWorkspaceSnapshot,
  deriveAcceptanceGates,
  type AcceptanceWorkspaceSnapshotSource,
  type AcceptanceWorkspaceSnapshot,
} from "./domain/services/derive-acceptance-gates";

// ── Domain: AcceptanceRecord aggregate ───────────────────────────────────────
export type {
  AcceptanceRecord,
  AcceptanceStatus,
  AcceptanceLineItem,
  AcceptanceLineItemStatus,
  CreateAcceptanceRecordInput,
} from "./domain/entities/AcceptanceRecord";

// ── Domain: lifecycle status & state machine ──────────────────────────────────
export type { AcceptanceLifecycleStatus } from "./domain/value-objects/acceptance-state";
export {
  ACCEPTANCE_STATUSES,
  canTransitionAcceptance,
  isTerminalAcceptanceStatus,
} from "./domain/value-objects/acceptance-state";

// ── Domain: repository port ───────────────────────────────────────────────────
export type {
  AcceptanceRecordRepository,
  AcceptanceRecordTransitionExtra,
} from "./domain/repositories/AcceptanceRecordRepository";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  AcceptanceDomainEvent,
  AcceptanceRecordCreatedEvent,
  AcceptanceStatusChangedEvent,
  AcceptanceSignedEvent,
  AcceptanceRejectedEvent,
} from "./domain/events/acceptance.events";

// ── Application: DTOs ─────────────────────────────────────────────────────────
export type {
  CreateAcceptanceRecordInputDto,
  SignAcceptanceInputDto,
  RejectAcceptanceInputDto,
} from "./application/dto/acceptance.dto";
export {
  CreateAcceptanceRecordInputSchema,
  SignAcceptanceInputSchema,
  RejectAcceptanceInputSchema,
  AcceptanceStatusSchema,
} from "./application/dto/acceptance.dto";

// ── Application: use-cases ────────────────────────────────────────────────────
export { ListWorkspaceAcceptanceGatesUseCase } from "./application/use-cases/list-workspace-acceptance-gates.use-case";
export {
  CreateAcceptanceRecordUseCase,
  TransitionAcceptanceRecordUseCase,
  ListAcceptanceRecordsUseCase,
} from "./application/use-cases/acceptance-record.use-cases";

// ── Infrastructure ────────────────────────────────────────────────────────────
export { DefaultWorkspaceAcceptanceRepository } from "./infrastructure/default/DefaultWorkspaceAcceptanceRepository";
export { FirebaseAcceptanceRecordRepository } from "./infrastructure/firebase/FirebaseAcceptanceRecordRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export { createAcceptanceRecord, transitionAcceptanceRecord } from "./interfaces/_actions/acceptance.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getWorkspaceAcceptanceSummary } from "./interfaces/queries/acceptance.queries";
export { getAcceptanceRecords } from "./interfaces/queries/acceptance-record.queries";

// ── Interfaces: UI component ──────────────────────────────────────────────────
export { WorkspaceAcceptanceTab } from "./interfaces/components/WorkspaceAcceptanceTab";
