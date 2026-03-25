/**
 * Module: workspace-planner
 * Layer: module/barrel (public API)
 *
 * External modules MUST import from here ONLY.
 * Never import from domain/, application/, infrastructure/, or interfaces/
 * sub-paths directly.
 *
 * Boundary rule: keep exports minimal (Occam's Razor).
 */

// ── Domain: entity types (read-only exports) ──────────────────────────────────
export type {
  WorkDemand,
  DemandStatus,
  DemandPriority,
  CreateWorkDemandCommand,
  AssignWorkDemandCommand,
  WorkDemandDomainEvent,
} from "./domain/types";

export {
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
  DEMAND_PRIORITIES,
  DEMAND_PRIORITY_LABELS,
} from "./domain/types";

// ── API: schema types ─────────────────────────────────────────────────────────
export type { CreateDemandInput, AssignMemberInput } from "./api/schema";

// ── Interfaces: UI components ─────────────────────────────────────────────────
export { WorkspacePlannerTab } from "./interfaces/WorkspacePlannerTab";
export { AccountPlannerView } from "./interfaces/AccountPlannerView";
export type { AccountMember } from "./interfaces/AccountPlannerView";

// ── Interfaces: server actions ────────────────────────────────────────────────
export { submitWorkDemand, assignWorkDemand } from "./interfaces/_actions/work-demand.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getWorkspaceDemands, getAccountDemands } from "./interfaces/queries/work-demand.queries";
