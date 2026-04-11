/**
 * Application-layer DTO re-exports for the scheduling subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { WorkDemand, DemandPriority } from "../../domain/types";
export { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../../domain/types";

import type { DemandPriority } from "../../domain/types";

export interface CreateDemandInput {
  workspaceId: string;
  accountId: string;
  requesterId: string;
  title: string;
  description?: string;
  priority: DemandPriority;
  scheduledAt: string;
}

export interface AssignMemberInput {
  demandId: string;
  userId: string;
  assignedBy: string;
}
