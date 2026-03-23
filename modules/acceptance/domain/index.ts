export type {
  AcceptanceGate,
  AcceptanceGateStatus,
  WorkspaceAcceptanceSummary,
} from "./entities/AcceptanceGate";
export type { AcceptanceRepository, AcceptanceScope } from "./repositories/AcceptanceRepository";
export {
  createAcceptanceWorkspaceSnapshot,
  deriveAcceptanceGates,
  type AcceptanceWorkspaceSnapshotSource,
  type AcceptanceWorkspaceSnapshot,
} from "./services/derive-acceptance-gates";

// ── MDDD Domain: AcceptanceRecord aggregate ───────────────────────────────────
export type {
  AcceptanceRecord,
  AcceptanceStatus,
  AcceptanceLineItem,
  AcceptanceLineItemStatus,
  CreateAcceptanceRecordInput,
} from "./entities/AcceptanceRecord";

// ── MDDD Domain: lifecycle status & state machine ─────────────────────────────
export type { AcceptanceLifecycleStatus } from "./value-objects/acceptance-state";
export {
  ACCEPTANCE_STATUSES,
  canTransitionAcceptance,
  isTerminalAcceptanceStatus,
} from "./value-objects/acceptance-state";

// ── MDDD Domain: events ───────────────────────────────────────────────────────
export type {
  AcceptanceDomainEvent,
  AcceptanceRecordCreatedEvent,
  AcceptanceStatusChangedEvent,
  AcceptanceSignedEvent,
  AcceptanceRejectedEvent,
} from "./events/acceptance.events";
