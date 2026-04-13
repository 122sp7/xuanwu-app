/**
 * Module: workspace/subdomains/scheduling
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer for scheduling subdomain.
 */

export {
  CreateDemandSchema,
  AssignMemberSchema,
} from "./schema";

export type {
  CreateDemandInput,
  AssignMemberInput,
} from "./schema";

export type {
  WorkDemand,
  DemandStatus,
  DemandPriority,
  CreateWorkDemandCommand,
  AssignWorkDemandCommand,
  WorkDemandDomainEvent,
} from "../domain/types";

export {
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
  DEMAND_PRIORITIES,
  DEMAND_PRIORITY_LABELS,
} from "../domain/types";

export type { AccountMember } from "../interfaces/AccountSchedulingView";
export { WorkspaceSchedulingTab } from "../interfaces/WorkspaceSchedulingTab";
export { AccountSchedulingView } from "../interfaces/AccountSchedulingView";
export { OrganizationScheduleRouteScreen } from "../interfaces/screens/OrganizationScheduleRouteScreen";

export { submitWorkDemand, assignWorkDemand } from "../interfaces/_actions/work-demand.actions";
export { getWorkspaceDemands, getAccountDemands } from "../interfaces/queries/work-demand.queries";

