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
